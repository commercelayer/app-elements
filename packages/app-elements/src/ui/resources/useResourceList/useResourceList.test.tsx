import type { Order } from "@commercelayer/sdk"
import { render, waitFor } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import { act, type FC, type JSX } from "react"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { server } from "../../../mocks/server"
import { type UseResourceListConfig, useResourceList } from "./useResourceList"

const mockedOrder: Order = {
  id: "mock",
  created_at: "2023-03-15T13:57:06.856Z",
  updated_at: "2023-03-15T13:57:06.856Z",
  type: "orders",

  fulfillment_status: "fulfilled",
  payment_status: "authorized",
  status: "approved",
}

const ResourceListImplementation: FC<
  Pick<UseResourceListConfig<any>, "query">
> = ({ query }) => {
  const { ResourceList } = useResourceList({
    type: "orders",
    query,
  })

  return (
    <ResourceList
      title="All orders"
      emptyState={<div>No orders found</div>}
      ItemTemplate={({ resource = mockedOrder }) => {
        return (
          <div
            data-testid={
              resource.id === "mock" ? "orderItem-loading" : "orderItem-ready"
            }
          >
            <div>Order #{resource.number}</div>
            <div>Total {resource.formatted_total_amount}</div>
          </div>
        )
      }}
    />
  )
}

const PaginationListImplementation: FC = () => {
  const { ResourceList, Pagination } = useResourceList({
    type: "orders",
    paginationType: "pagination",
  })

  return (
    <>
      <ResourceList
        title="All orders"
        ItemTemplate={({ resource = mockedOrder }) => (
          <div
            data-testid={
              resource.id === "mock" ? "orderItem-loading" : "orderItem-ready"
            }
            data-page={
              resource.id.startsWith("page")
                ? resource.id.split("-")[0]
                : undefined
            }
          >
            Order #{resource.number}
          </div>
        )}
      />
      <Pagination />
    </>
  )
}

describe("useResourceList", () => {
  test("Should render list component", async () => {
    const { getByTestId } = render(
      <TokenProvider kind="integration" appSlug="orders" devMode>
        <CoreSdkProvider>
          <ResourceListImplementation />
        </CoreSdkProvider>
      </TokenProvider>,
    )
    act(() => {
      expect(getByTestId("resource-list")).toBeDefined()
    })
  })

  test("Should show initial loading items", async () => {
    const { getAllByTestId, queryByTestId } = render(
      <TokenProvider kind="integration" appSlug="orders" devMode>
        <CoreSdkProvider>
          <ResourceListImplementation />
        </CoreSdkProvider>
      </TokenProvider>,
    )
    const loadingItems = getAllByTestId("orderItem-loading")
    expect(loadingItems.length).toBe(8)
    expect(queryByTestId("visibility-trigger")).not.toBeInTheDocument()
  })

  test("Should show fetched items, once loaded", async () => {
    const { findAllByTestId, queryByTestId } = render(
      <TokenProvider kind="integration" appSlug="orders" devMode>
        <CoreSdkProvider>
          <ResourceListImplementation />
        </CoreSdkProvider>
      </TokenProvider>,
    )
    expect((await findAllByTestId("orderItem-ready")).length).toBe(10)
    expect(queryByTestId("orderItem-loading")).not.toBeInTheDocument()
    expect(queryByTestId("visibility-trigger")).toBeInTheDocument()
  })

  test("Should render computed title", async () => {
    const { findByLabelText, findByText } = render(
      <TokenProvider kind="integration" appSlug="orders" devMode>
        <CoreSdkProvider>
          <ResourceListImplementation />
        </CoreSdkProvider>
      </TokenProvider>,
    )

    const section = await findByLabelText("All orders · 15")
    expect(section).toBeVisible()
    expect(section.tagName).toEqual("SECTION")

    expect(await findByText("All orders · 15")).toBeVisible()
  })

  test("Should render empty list", async () => {
    const { findByText } = render(
      <TokenProvider kind="integration" appSlug="orders" devMode>
        <CoreSdkProvider>
          <ResourceListImplementation
            query={{
              filters: {
                emptyList: true, // fake filter
              },
            }}
          />
        </CoreSdkProvider>
      </TokenProvider>,
    )

    expect(await findByText("No orders found")).toBeVisible()
  })
})

describe("useResourceList - the page in the url", () => {
  const renderList = (): ReturnType<typeof render> =>
    render(
      <TokenProvider kind="integration" appSlug="orders" devMode>
        <CoreSdkProvider>
          <PaginationListImplementation />
        </CoreSdkProvider>
      </TokenProvider>,
    )

  const currentPageParam = (): string | null =>
    new URLSearchParams(window.location.search).get("page")

  beforeEach(() => {
    window.history.pushState({}, "", "/")
  })

  test("Should write the page to the url, and drop the parameter on page 1", async () => {
    const { findByRole, findAllByTestId } = renderList()
    await findAllByTestId("orderItem-ready")
    expect(currentPageParam()).toBeNull()

    await act(async () => {
      ;(await findByRole("button", { name: "Next page" })).click()
    })
    await waitFor(() => {
      expect(currentPageParam()).toBe("2")
    })

    await act(async () => {
      ;(await findByRole("button", { name: "Previous page" })).click()
    })
    await waitFor(() => {
      expect(currentPageParam()).toBeNull()
    })
  })

  test("Should open the page the url asks for, on a core api list", async () => {
    window.history.pushState({}, "", "/?page=2")
    const { findAllByTestId } = renderList()

    await waitFor(async () => {
      const items = await findAllByTestId("orderItem-ready")
      expect(items[0]?.dataset.page).toBe("page2")
    })
    // the request was honoured, so the url keeps it
    expect(currentPageParam()).toBe("2")
  })

  test("Should walk the pages with the browser back button", async () => {
    const { findByRole, findAllByTestId } = renderList()
    await findAllByTestId("orderItem-ready")

    await act(async () => {
      ;(await findByRole("button", { name: "Next page" })).click()
    })
    await waitFor(() => {
      expect(currentPageParam()).toBe("2")
    })

    await act(async () => {
      window.history.back()
    })
    await waitFor(async () => {
      expect(currentPageParam()).toBeNull()
      const items = await findAllByTestId("orderItem-ready")
      expect(items[0]?.dataset.page).toBe("page1")
    })
  })

  test("Should open a restored page with a single request", async () => {
    // `initialFetch` reads the page from the url, so a list restored on page 2
    // must not fetch page 1 first and then correct itself
    const listRequests: string[] = []
    const countRequest = ({ request }: { request: Request }): void => {
      const url = new URL(request.url)
      if (url.pathname.endsWith("/orders")) {
        listRequests.push(url.searchParams.get("page[number]") ?? "1")
      }
    }
    server.events.on("request:start", countRequest)

    try {
      window.history.pushState({}, "", "/?page=2")
      const { findAllByTestId } = renderList()

      await waitFor(async () => {
        const items = await findAllByTestId("orderItem-ready")
        expect(items[0]?.dataset.page).toBe("page2")
      })

      expect(listRequests).toStrictEqual(["2"])
    } finally {
      server.events.removeListener("request:start", countRequest)
    }
  })

  test("Should ignore a page parameter that is not a positive integer", async () => {
    window.history.pushState({}, "", "/?page=nope")
    const { findAllByTestId } = renderList()

    await waitFor(async () => {
      const items = await findAllByTestId("orderItem-ready")
      expect(items[0]?.dataset.page).toBe("page1")
    })
  })
})

describe("useResourceList - the page in the url, on a metrics-backed list", () => {
  const metricsSearchUrl = "https://mock.localhost/metrics/orders/search"

  const MetricsListImplementation: FC<{ status?: string; dateTo?: string }> = ({
    status,
    dateTo,
  }) => {
    const { ResourceList, Pagination } = useResourceList({
      type: "orders",
      paginationType: "pagination",
      metricsQuery: {
        search: { limit: 2 },
        filter: { order: { status, date_to: dateTo } },
      },
    })

    return (
      <>
        <ResourceList
          title="All orders"
          ItemTemplate={({ resource = mockedOrder }) => (
            <div
              data-testid={
                resource.id === "mock" ? "orderItem-loading" : "orderItem-ready"
              }
            >
              Order #{resource.number}
            </div>
          )}
        />
        <Pagination />
      </>
    )
  }

  /** Records the cursor each search was asked to open. */
  let sentCursors: Array<string | null> = []

  const renderMetricsList = (
    props: { status?: string; dateTo?: string } = {},
  ): ReturnType<typeof render> => render(metricsTree(props))

  const metricsTree = (props: {
    status?: string
    dateTo?: string
  }): JSX.Element => (
    <TokenProvider kind="integration" appSlug="orders" devMode>
      <CoreSdkProvider>
        <MetricsListImplementation {...props} />
      </CoreSdkProvider>
    </TokenProvider>
  )

  const pageParam = (): string | null =>
    new URLSearchParams(window.location.search).get("page")

  const storedTrail = (): Array<string | null> | null => {
    for (let index = 0; index < window.sessionStorage.length; index++) {
      const key = window.sessionStorage.key(index)
      if (key?.startsWith("cl.metrics.trail.") === true) {
        return JSON.parse(window.sessionStorage.getItem(key) ?? "{}").cursors
      }
    }
    return null
  }

  const goNext = async (view: ReturnType<typeof render>): Promise<void> => {
    await act(async () => {
      ;(await view.findByRole("button", { name: "Next page" })).click()
    })
  }

  const goPrevious = async (view: ReturnType<typeof render>): Promise<void> => {
    await act(async () => {
      ;(await view.findByRole("button", { name: "Previous page" })).click()
    })
  }

  beforeEach(() => {
    sentCursors = []
    window.sessionStorage.clear()
    window.history.pushState({}, "", "/")
    server.use(
      http.post(metricsSearchUrl, async ({ request }) => {
        const body = (await request.json()) as {
          search?: { cursor?: string | null }
        }
        sentCursors.push(body.search?.cursor ?? null)

        return HttpResponse.json({
          data: [
            { id: "metrics-1", type: "orders", number: 1 },
            { id: "metrics-2", type: "orders", number: 2 },
          ],
          meta: {
            pagination: { record_count: 6, cursor: "cursor-for-page-2" },
          },
        })
      }),
    )
  })

  test("Should decline a page it holds no cursor for, and correct the url", async () => {
    window.history.pushState({}, "", "/?page=3")
    const { findAllByTestId, findByRole } = render(
      <TokenProvider kind="integration" appSlug="orders" devMode>
        <CoreSdkProvider>
          <MetricsListImplementation />
        </CoreSdkProvider>
      </TokenProvider>,
    )

    await findAllByTestId("orderItem-ready")

    // no cursor for page 3 on a fresh mount, so page 1 is the honest answer
    expect(sentCursors).toStrictEqual([null])
    await waitFor(() => {
      expect(new URLSearchParams(window.location.search).get("page")).toBeNull()
    })
    // and the pager agrees it is on the first page
    expect(await findByRole("button", { name: "Previous page" })).toBeDisabled()
  })

  test("Should honour a page whose cursor the trail already holds", async () => {
    const { findAllByTestId, findByRole } = render(
      <TokenProvider kind="integration" appSlug="orders" devMode>
        <CoreSdkProvider>
          <MetricsListImplementation />
        </CoreSdkProvider>
      </TokenProvider>,
    )
    await findAllByTestId("orderItem-ready")

    await act(async () => {
      ;(await findByRole("button", { name: "Next page" })).click()
    })

    await waitFor(() => {
      expect(new URLSearchParams(window.location.search).get("page")).toBe("2")
    })
    // page 1 opened with no cursor, page 2 with the one page 1 handed back
    expect(sentCursors).toStrictEqual([null, "cursor-for-page-2"])
  })

  test("Should reopen the requested page from the persisted trail, after a remount", async () => {
    const first = renderMetricsList()
    await first.findAllByTestId("orderItem-ready")
    await goNext(first)
    await waitFor(() => {
      expect(pageParam()).toBe("2")
    })

    // leaving for a details page unmounts the list; the trail must outlive it
    first.unmount()
    sentCursors = []

    const second = renderMetricsList()
    await second.findAllByTestId("orderItem-ready")

    expect(pageParam()).toBe("2")
    expect(sentCursors).toStrictEqual(["cursor-for-page-2"])
  })

  test("Should not reuse a trail walked against a different query", async () => {
    const first = renderMetricsList({ status: "placed" })
    await first.findAllByTestId("orderItem-ready")
    await goNext(first)
    await waitFor(() => {
      expect(pageParam()).toBe("2")
    })
    first.unmount()
    sentCursors = []

    // same url, different filters: those cursors mean nothing here
    const second = renderMetricsList({ status: "approved" })
    await second.findAllByTestId("orderItem-ready")

    expect(sentCursors).toStrictEqual([null])
    await waitFor(() => {
      expect(pageParam()).toBeNull()
    })
  })

  test("Should survive the default date range moving between mounts", async () => {
    // With no date filter of its own, the metrics filter defaults to a range
    // ending "now", rebuilt on every mount down to the second. The trail has to
    // outlive that, or it never survives a trip to a details page.
    const first = renderMetricsList({ dateTo: "2026-08-24T10:00:00Z" })
    await first.findAllByTestId("orderItem-ready")
    await goNext(first)
    await waitFor(() => {
      expect(pageParam()).toBe("2")
    })
    first.unmount()
    sentCursors = []

    const second = renderMetricsList({ dateTo: "2026-08-24T10:00:37Z" })
    await second.findAllByTestId("orderItem-ready")

    expect(pageParam()).toBe("2")
    expect(sentCursors).toStrictEqual(["cursor-for-page-2"])
  })

  test("Should reset the page, the url and the stored trail when filters or tab change", async () => {
    const view = renderMetricsList({ status: "placed" })
    await view.findAllByTestId("orderItem-ready")
    await goNext(view)
    await waitFor(() => {
      expect(pageParam()).toBe("2")
    })
    expect(storedTrail()).toHaveLength(3)

    // switching tab or editing a filter reaches the list as a changed query
    view.rerender(metricsTree({ status: "approved" }))

    await waitFor(() => {
      // back to the first page, with the url no longer asking for the second
      expect(pageParam()).toBeNull()
      // and the cursors walked against the previous filters are gone
      expect(storedTrail()).toStrictEqual([null, "cursor-for-page-2"])
    })
  })

  test("Should forget the trail when page 1 is reached again", async () => {
    const view = renderMetricsList()
    await view.findAllByTestId("orderItem-ready")

    await goNext(view)
    await waitFor(() => {
      expect(pageParam()).toBe("2")
    })
    await goNext(view)
    await waitFor(() => {
      expect(pageParam()).toBe("3")
    })
    expect(storedTrail()).toHaveLength(4)

    await goPrevious(view)
    await goPrevious(view)
    await waitFor(() => {
      expect(pageParam()).toBeNull()
    })

    // page 1 is fetched with no cursor, so it re-anchors the list and the
    // cursors measured against the older snapshot are dropped
    await waitFor(() => {
      expect(storedTrail()).toStrictEqual([null, "cursor-for-page-2"])
    })
  })
})

describe("useResourceList - pagination mode", () => {
  // The page now lives in the query string, and jsdom keeps a single location
  // per test file: without this, a test that paged forward leaves `?page=2`
  // behind and the next one mounts already restored to page 2.
  beforeEach(() => {
    window.history.pushState({}, "", "/")
  })

  test("Should replace items (not accumulate) when navigating pages", async () => {
    const { findAllByTestId, findByRole } = render(
      <TokenProvider kind="integration" appSlug="orders" devMode>
        <CoreSdkProvider>
          <PaginationListImplementation />
        </CoreSdkProvider>
      </TokenProvider>,
    )

    // Wait for page 1 to load
    const page1Items = await findAllByTestId("orderItem-ready")
    expect(page1Items.length).toBe(10)
    expect(page1Items[0]?.dataset.page).toBe("page1")

    // Navigate to page 2 (wait for button to be enabled)
    const nextButton = await findByRole("button", { name: "Next page" })
    await act(async () => {
      nextButton.click()
    })

    // Wait for page 2 items — list should be replaced, not grown
    await waitFor(async () => {
      const page2Items = await findAllByTestId("orderItem-ready")
      expect(page2Items.length).toBe(10)
      expect(page2Items[0]?.dataset.page).toBe("page2")
    })
  })

  test("Should disable prev button on first page and next button on last page", async () => {
    const { findByRole } = render(
      <TokenProvider kind="integration" appSlug="orders" devMode>
        <CoreSdkProvider>
          <PaginationListImplementation />
        </CoreSdkProvider>
      </TokenProvider>,
    )

    // Wait for buttons to appear (Pagination renders only after data is loaded)
    await waitFor(async () => {
      const prevButton = await findByRole("button", { name: "Previous page" })
      const nextButton = await findByRole("button", { name: "Next page" })
      expect(prevButton).toBeDisabled()
      expect(nextButton).not.toBeDisabled()
    })

    // Navigate to last page (page_count is 2)
    const nextButton = await findByRole("button", { name: "Next page" })
    await act(async () => {
      nextButton.click()
    })

    // On page 2 (last): next should be disabled, prev enabled
    await waitFor(async () => {
      const prevButton = await findByRole("button", { name: "Previous page" })
      const nextButtonUpdated = await findByRole("button", {
        name: "Next page",
      })
      expect(nextButtonUpdated).toBeDisabled()
      expect(prevButton).not.toBeDisabled()
    })
  })
})
