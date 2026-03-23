import type { Order } from "@commercelayer/sdk"
import { render, waitFor } from "@testing-library/react"
import { act, type FC } from "react"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
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

describe("useResourceList - pagination mode", () => {
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
