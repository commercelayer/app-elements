import { act, render, waitFor } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import type { FC } from "react"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { server } from "../../../mocks/server"
import {
  refreshResourceLists,
  removeFromResourceLists,
} from "./resourceListSignals"
import { useResourceList } from "./useResourceList"

const mockedOrders = [
  { id: "order-1", number: 1001 },
  { id: "order-2", number: 1002 },
]

/** Deterministic orders, plus a count of how many times the list was fetched. */
function mockOrdersList(): { requestCount: () => number } {
  let requests = 0
  server.use(
    http.get(`https://*/api/orders`, () => {
      requests += 1
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
  return { requestCount: () => requests }
}

const OrdersList: FC = () => {
  const { ResourceList } = useResourceList({ type: "orders", query: {} })
  return (
    <ResourceList
      title="All orders"
      emptyState={<div>No orders found</div>}
      ItemTemplate={({ resource }) => <div>Order #{resource?.number}</div>}
    />
  )
}

const renderList = () =>
  render(
    <TokenProvider kind="integration" appSlug="orders" devMode>
      <CoreSdkProvider>
        <OrdersList />
      </CoreSdkProvider>
    </TokenProvider>,
  )

describe("resource list signals, against a mounted list", () => {
  it("removes the row without refetching, and adjusts the total count", async () => {
    const { requestCount } = mockOrdersList()
    const { findByText, queryByText, getByText } = renderList()

    expect(await findByText("Order #1001")).toBeInTheDocument()
    const requestsAfterFirstLoad = requestCount()
    // the title carries the record count, which has to follow the removal
    expect(getByText("All orders · 2")).toBeInTheDocument()

    act(() => {
      removeFromResourceLists("orders", "order-1")
    })

    await waitFor(() => {
      expect(queryByText("Order #1001")).not.toBeInTheDocument()
    })
    expect(queryByText("Order #1002")).toBeInTheDocument()
    expect(getByText("All orders · 1")).toBeInTheDocument()
    expect(requestCount()).toBe(requestsAfterFirstLoad)
  })

  it("ignores a row it does not hold", async () => {
    const { requestCount } = mockOrdersList()
    const { findByText, queryByText } = renderList()
    expect(await findByText("Order #1001")).toBeInTheDocument()
    const requestsAfterFirstLoad = requestCount()

    act(() => {
      removeFromResourceLists("orders", "order-from-another-page")
    })

    expect(queryByText("Order #1001")).toBeInTheDocument()
    expect(queryByText("Order #1002")).toBeInTheDocument()
    expect(requestCount()).toBe(requestsAfterFirstLoad)
  })

  it("is ignored by a list of a different resource type", async () => {
    const { requestCount } = mockOrdersList()
    const { findByText, queryByText } = renderList()
    expect(await findByText("Order #1001")).toBeInTheDocument()
    const requestsAfterFirstLoad = requestCount()

    act(() => {
      removeFromResourceLists("skus", "order-1")
    })

    expect(queryByText("Order #1001")).toBeInTheDocument()
    expect(requestCount()).toBe(requestsAfterFirstLoad)
  })

  it("refetches on a refresh signal", async () => {
    const { requestCount } = mockOrdersList()
    const { findByText } = renderList()
    expect(await findByText("Order #1001")).toBeInTheDocument()
    const requestsAfterFirstLoad = requestCount()

    act(() => {
      refreshResourceLists("orders")
    })

    await waitFor(() => {
      expect(requestCount()).toBeGreaterThan(requestsAfterFirstLoad)
    })
    expect(await findByText("Order #1001")).toBeInTheDocument()
  })

  it("refetches the first page, so a record created elsewhere shows up", async () => {
    // an infinite list works out the page to ask for from the data it holds, so a
    // refresh that kept that data would fetch the page *after* the last one and
    // append it — leaving a record created at the top of the list invisible
    const requestedPages: number[] = []
    const orders = [...mockedOrders]
    server.use(
      http.get(`https://*/api/orders`, ({ request }) => {
        const url = new URL(request.url)
        requestedPages.push(Number(url.searchParams.get("page[number]") ?? 1))
        return HttpResponse.json({
          data: orders.map((order) => ({
            id: order.id,
            type: "orders",
            attributes: { number: order.number },
          })),
          meta: { record_count: orders.length, page_count: 1 },
        })
      }),
    )

    const { findByText } = renderList()
    expect(await findByText("Order #1001")).toBeInTheDocument()
    expect(requestedPages).toEqual([1])

    orders.unshift({ id: "order-3", number: 1003 })
    act(() => {
      refreshResourceLists("orders")
    })

    expect(await findByText("Order #1003")).toBeInTheDocument()
    expect(requestedPages).toEqual([1, 1])
  })

  it("stops listening once unmounted", async () => {
    mockOrdersList()
    const { findByText, unmount } = renderList()
    expect(await findByText("Order #1001")).toBeInTheDocument()

    unmount()

    expect(() => {
      removeFromResourceLists("orders", "order-1")
      refreshResourceLists("orders")
    }).not.toThrow()
  })
})
