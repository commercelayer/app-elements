import { createEvent, fireEvent, render, waitFor } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import type { FC } from "react"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { server } from "../../../mocks/server"
import type {
  ResourceTableColumn,
  ResourceTableProps,
  ResourceTableSort,
} from "./types"
import { useResourceTable } from "./useResourceTable"

const mockedOrders = [
  { id: "order-1", number: 1001 },
  { id: "order-2", number: 1002 },
  { id: "order-3", number: 1003 },
]

/**
 * Deterministic orders, replacing the shared handler's randomized ones, plus a
 * record of every `sort` the API is asked for — sorting is server-side, so the
 * outgoing query is the observable behavior.
 */
function mockOrdersList(): { requestedSorts: Array<string | null> } {
  const requestedSorts: Array<string | null> = []
  server.use(
    http.get(`https://*/api/orders`, ({ request }) => {
      requestedSorts.push(new URL(request.url).searchParams.get("sort"))
      return HttpResponse.json({
        data: mockedOrders.map((order) => ({
          id: order.id,
          type: "orders",
          attributes: { number: order.number },
        })),
        meta: { record_count: mockedOrders.length, page_count: 1 },
      })
    }),
  )
  return { requestedSorts }
}

const columns: Array<ResourceTableColumn<"orders">> = [
  {
    header: "Order",
    sortBy: "number",
    cell: ({ resource }) => `#${resource.number}`,
  },
  // no `sortBy`, so this one must not become interactive
  { header: "Status", cell: () => "placed" },
]

const Wrapper: FC<{ children: React.ReactNode }> = ({ children }) => (
  <TokenProvider kind="integration" appSlug="orders" devMode>
    <CoreSdkProvider>{children}</CoreSdkProvider>
  </TokenProvider>
)

/** Row elements in document order. */
function getRows(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll("tbody tr"))
}

describe("useResourceTable", () => {
  describe("component identity", () => {
    it("keeps the returned `ResourceTable` stable across re-renders, so rows are not remounted (which showed up as a flicker on row click)", async () => {
      mockOrdersList()
      const seen = new Set<FC<ResourceTableProps>>()

      const Implementation: FC<{ tick: number }> = () => {
        const { ResourceTable } = useResourceTable({
          type: "orders",
          columns,
          // inline handlers: a fresh identity on every render, as callers write them
          onRowClick: () => {},
          getRowHref: (order) => `/orders/${order.id}`,
        })
        seen.add(ResourceTable)
        return <ResourceTable />
      }

      const { findByText, rerender } = render(
        <Wrapper>
          <Implementation tick={0} />
        </Wrapper>,
      )

      // covers the render caused by the fetch resolving, which swaps `list`,
      // `meta` and `fetchMore`
      expect(await findByText("#1001")).toBeInTheDocument()

      rerender(
        <Wrapper>
          <Implementation tick={1} />
        </Wrapper>,
      )

      expect(seen.size).toBe(1)
    })
  })

  describe("row links", () => {
    const renderWithLinks = (
      onRowClick?: (order: { id: string }, event: React.MouseEvent) => void,
    ) => {
      const Implementation: FC = () => {
        const { ResourceTable } = useResourceTable({
          type: "orders",
          columns,
          getRowHref: (order) => `/orders/${order.id}`,
          onRowClick,
        })
        return <ResourceTable />
      }
      return render(
        <Wrapper>
          <Implementation />
        </Wrapper>,
      )
    }

    it("renders a single stretched anchor, on the first cell only", async () => {
      mockOrdersList()
      const { container, findByText } = renderWithLinks()
      await findByText("#1001")

      const [firstRow] = getRows(container)
      assertToBeDefined(firstRow)
      const anchors = firstRow.querySelectorAll("a")
      expect(anchors).toHaveLength(1)

      const anchor = anchors[0]
      assertToBeDefined(anchor)
      expect(anchor).toHaveAttribute("href", "/orders/order-1")
      expect(anchor.closest("td")).toBe(firstRow.querySelector("td"))
      // `::after` is what covers the row, so the anchor needs a positioned row
      expect(firstRow).toHaveClass("relative")
    })

    it("leaves the row itself non-interactive, so the anchor owns the click", async () => {
      mockOrdersList()
      const { container, findByText } = renderWithLinks(() => {})
      await findByText("#1001")

      const [firstRow] = getRows(container)
      assertToBeDefined(firstRow)
      expect(firstRow).not.toHaveAttribute("role", "button")
    })

    it("on a plain click, calls `onRowClick` with the row's resource and prevents the navigation", async () => {
      mockOrdersList()
      const onRowClick = vi.fn()
      const { container, findByText } = renderWithLinks(onRowClick)
      await findByText("#1001")

      const anchor = getRows(container)[0]?.querySelector("a")
      assertToBeDefined(anchor)
      const click = createEvent.click(anchor)
      fireEvent(anchor, click)

      expect(onRowClick).toHaveBeenCalledTimes(1)
      expect(onRowClick.mock.calls[0]?.[0]).toMatchObject({ id: "order-1" })
      expect(click.defaultPrevented).toBe(true)
    })

    it.each([
      ["metaKey", { metaKey: true }],
      ["ctrlKey", { ctrlKey: true }],
      ["shiftKey", { shiftKey: true }],
      ["altKey", { altKey: true }],
    ])(
      "on a %s click, falls through to the browser so the row opens in a new tab",
      async (_name, modifier) => {
        mockOrdersList()
        const onRowClick = vi.fn()
        const { container, findByText } = renderWithLinks(onRowClick)
        await findByText("#1001")

        const anchor = getRows(container)[0]?.querySelector("a")
        assertToBeDefined(anchor)
        const click = createEvent.click(anchor, modifier)
        fireEvent(anchor, click)

        expect(onRowClick).not.toHaveBeenCalled()
        expect(click.defaultPrevented).toBe(false)
      },
    )

    it("without `getRowHref`, makes the row itself the button and renders no anchor", async () => {
      mockOrdersList()
      const onRowClick = vi.fn()
      const Implementation: FC = () => {
        const { ResourceTable } = useResourceTable({
          type: "orders",
          columns,
          onRowClick,
        })
        return <ResourceTable />
      }
      const { container, findByText } = render(
        <Wrapper>
          <Implementation />
        </Wrapper>,
      )
      await findByText("#1001")

      const [firstRow] = getRows(container)
      assertToBeDefined(firstRow)
      expect(firstRow.querySelectorAll("a")).toHaveLength(0)
      expect(firstRow).toHaveAttribute("role", "button")

      fireEvent.click(firstRow)
      expect(onRowClick).toHaveBeenCalledTimes(1)
      expect(onRowClick.mock.calls[0]?.[0]).toMatchObject({ id: "order-1" })
    })
  })

  describe("sorting", () => {
    const renderSortable = (
      config: {
        sort?: ResourceTableSort<"orders">
        onSortChange?: (sort: ResourceTableSort<"orders">) => void
        defaultSort?: ResourceTableSort<"orders">
      } = {},
    ) => {
      const Implementation: FC = () => {
        const { ResourceTable } = useResourceTable({
          type: "orders",
          columns,
          ...config,
        })
        return <ResourceTable />
      }
      return render(
        <Wrapper>
          <Implementation />
        </Wrapper>,
      )
    }

    it("makes only the columns with a `sortBy` interactive", async () => {
      mockOrdersList()
      const { container, findByText } = renderSortable()
      await findByText("#1001")

      const headers = Array.from(container.querySelectorAll("thead th"))
      expect(headers).toHaveLength(2)
      expect(headers[0]?.querySelector("button")).toBeInTheDocument()
      expect(headers[1]?.querySelector("button")).not.toBeInTheDocument()
    })

    // A two-state toggle: the sort can never be removed, so `defaultSort` is
    // never silently discarded.
    it.each([
      ["unsorted", undefined, "number"],
      ["ascending", "number", "-number"],
      ["descending", "-number", "number"],
    ] as const)(
      "from %s, clicking a text column's header reports %s → %s",
      async (_name, sort, expected) => {
        mockOrdersList()
        const onSortChange = vi.fn()
        const { container, findByText } = renderSortable({ sort, onSortChange })
        await findByText("#1001")

        const button = container.querySelector("thead th button")
        assertToBeDefined(button)
        fireEvent.click(button)

        expect(onSortChange).toHaveBeenCalledTimes(1)
        expect(onSortChange).toHaveBeenCalledWith(expected)
      },
    )

    it.each([
      [
        "a date column, descending first",
        "updated_at",
        undefined,
        "-updated_at",
      ],
      [
        "an explicit `sortDescFirst`",
        "total_amount_cents",
        true,
        "-total_amount_cents",
      ],
      [
        "an explicitly ascending date column",
        "created_at",
        false,
        "created_at",
      ],
    ] as const)(
      "sorts %s on the first click",
      async (_name, sortBy, sortDescFirst, expected) => {
        mockOrdersList()
        const onSortChange = vi.fn()
        const Implementation: FC = () => {
          const { ResourceTable } = useResourceTable({
            type: "orders",
            columns: [
              {
                header: "Column",
                sortBy,
                sortDescFirst,
                cell: ({ resource }) => `#${resource.number}`,
              },
            ],
            sort: undefined,
            onSortChange,
          })
          return <ResourceTable />
        }
        const { container, findByText } = render(
          <Wrapper>
            <Implementation />
          </Wrapper>,
        )
        await findByText("#1001")

        const button = container.querySelector("thead th button")
        assertToBeDefined(button)
        fireEvent.click(button)

        expect(onSortChange).toHaveBeenCalledWith(expected)
      },
    )

    it("never clears the sort, however many times the header is clicked", async () => {
      mockOrdersList()
      const reported: Array<ResourceTableSort<"orders">> = []
      const { container, findByText } = renderSortable({
        defaultSort: "number",
        onSortChange: (sort) => {
          reported.push(sort)
        },
        sort: "number",
      })
      await findByText("#1001")

      const button = container.querySelector("thead th button")
      assertToBeDefined(button)
      for (let click = 0; click < 3; click++) {
        fireEvent.click(button)
      }

      expect(reported).toHaveLength(3)
      expect(reported).not.toContain(undefined)
    })

    it("sends the sort to the API rather than reordering rows client-side", async () => {
      const { requestedSorts } = mockOrdersList()
      const { container, findByText } = renderSortable({
        defaultSort: "-number",
      })
      await findByText("#1001")

      expect(requestedSorts).toContain("-number")

      const orderBefore = getRows(container).map((row) => row.textContent)
      const button = container.querySelector("thead th button")
      assertToBeDefined(button)
      fireEvent.click(button)

      // the click drives a refetch; the rows on screen keep the server's order
      await waitFor(() => {
        expect(requestedSorts).toContain("number")
      })
      expect(getRows(container).map((row) => row.textContent)).toEqual(
        orderBefore,
      )
    })
  })
})
