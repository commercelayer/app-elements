import type { Resource } from "@commercelayer/sdk"
import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react"
import { delay, HttpResponse, http } from "msw"
import type { ReactNode } from "react"
import { SWRConfig } from "swr"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { server } from "../../../mocks/server"
import {
  ResourceDetailsContent,
  type ResourceDetailsContentProps,
} from "./ResourceDetailsContent"
import { isHasManyRelationship } from "./ResourceRelationships"

/**
 * Rendered without `I18NProvider`, so `t()` yields raw keys: assertions match
 * record ids and labels, which are data, and relationship names, which are
 * formatted locally.
 */
const resource = {
  id: "NgojhKoyYN",
  type: "orders",
  status: "placed",
  market: { id: "dvzXAuNQpm", type: "markets", name: "Europe" },
  customer: null,
} as unknown as Resource

/**
 * Every test gets its own SWR cache: the requests share their keys, so a
 * cached page from an earlier test would otherwise be served without a fetch.
 */
const Providers = ({ children }: { children: ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map() }}>
    <TokenProvider kind="integration" appSlug="orders" devMode>
      <CoreSdkProvider>{children}</CoreSdkProvider>
    </TokenProvider>
  </SWRConfig>
)

/** Serves `/orders/:id/line_items` and records every page requested. */
function mockLineItems(): { requestedPages: string[] } {
  const requestedPages: string[] = []
  server.use(
    http.get(`https://*/api/:version/orders/:id/line_items`, ({ request }) => {
      requestedPages.push(
        new URL(request.url).searchParams.get("page[number]") ?? "1",
      )
      return HttpResponse.json({
        data: [
          {
            id: "kDrVYTkJDl",
            type: "line_items",
            attributes: { name: "Black T-shirt", sku_code: "TSHIRT" },
          },
          { id: "pWqzLbNmXa", type: "line_items", attributes: {} },
        ],
        meta: { record_count: 2, page_count: 1 },
      })
    }),
  )
  return { requestedPages }
}

/**
 * Serves `/orders/:id/line_items` as 12 records, ten per page, and records
 * every `page/size` requested.
 */
function mockPagedLineItems(): { requestedPages: string[] } {
  const requestedPages: string[] = []
  server.use(
    http.get(`https://*/api/:version/orders/:id/line_items`, ({ request }) => {
      const params = new URL(request.url).searchParams
      const pageNumber = Number(params.get("page[number]") ?? "1")
      const pageSize = Number(params.get("page[size]"))
      requestedPages.push(`${pageNumber}/${pageSize}`)
      const from = (pageNumber - 1) * pageSize
      const to = Math.min(from + pageSize, 12)
      return HttpResponse.json({
        data: Array.from({ length: to - from }, (_, index) => ({
          id: `lineItem${from + index}`,
          type: "line_items",
          attributes: {},
        })),
        meta: { record_count: 12, page_count: 2 },
      })
    }),
  )
  return { requestedPages }
}

const setup = async (
  relationships: ResourceDetailsContentProps["relationships"],
): Promise<RenderResult> => {
  const result = await act(async () =>
    render(
      <Providers>
        <ResourceDetailsContent
          resource={resource}
          relationships={relationships}
        />
      </Providers>,
    ),
  )

  await act(async () => {
    result.getAllByRole("tab")[1]?.click()
  })

  return result
}

const expand = async (result: RenderResult, name: string): Promise<void> => {
  await act(async () => {
    fireEvent.click(result.getByRole("button", { name: new RegExp(name) }))
  })
}

describe("ResourceDetailsContent relationships", () => {
  it("adds no Relationships tab unless asked to", async () => {
    const { getAllByRole } = await act(async () =>
      render(
        <Providers>
          <ResourceDetailsContent resource={resource} />
        </Providers>,
      ),
    )

    expect(getAllByRole("tab")).toHaveLength(2)
  })

  it("renders the Relationships tab right after Attributes", async () => {
    const { getAllByRole } = await setup({ names: ["market"] })

    const tabs = getAllByRole("tab")
    expect(tabs).toHaveLength(3)
    expect(tabs[1]?.textContent).toBe("common.resource_details.relationships")
  })

  it("lists the relationships alphabetically", async () => {
    const { getAllByRole } = await setup({
      names: ["market", "customer", "line_items"],
    })

    const rows = getAllByRole("button", { expanded: false })
    expect(rows.map((row) => row.textContent?.split("common")[0])).toEqual([
      "Customer",
      "Line items",
      "Market",
    ])
  })

  it("tells single relationships from multiple ones before loading them", async () => {
    const { getByRole } = await setup({ names: ["market", "line_items"] })

    expect(getByRole("button", { name: /^Market/ }).textContent).toContain(
      "common.resource_details.has_one",
    )
    expect(getByRole("button", { name: /^Line items/ }).textContent).toContain(
      "common.resource_details.has_many",
    )
  })

  it("reads a sideloaded has-one from the payload, without fetching", async () => {
    const { requestedPages } = mockLineItems()
    const result = await setup({ names: ["market"] })

    await expand(result, "Market")

    expect(result.getByText("dvzXAuNQpm")).toBeVisible()
    expect(result.getByText("Europe")).toBeVisible()
    expect(requestedPages).toEqual([])
  })

  it("shows an empty has-one as having no records", async () => {
    const result = await setup({ names: ["customer"] })

    await expand(result, "Customer")

    expect(result.getByText("common.resource_details.no_records")).toBeVisible()
  })

  it("fetches a has-many only once its row is expanded", async () => {
    const { requestedPages } = mockLineItems()
    const result = await setup({ names: ["line_items"] })

    expect(requestedPages).toEqual([])

    await expand(result, "Line items")

    expect(await result.findByText("kDrVYTkJDl")).toBeVisible()
    expect(result.getByText("Black T-shirt")).toBeVisible()
    expect(requestedPages).toEqual(["1"])
  })

  it("pages through a has-many ten records at a time", async () => {
    const { requestedPages } = mockPagedLineItems()
    const result = await setup({ names: ["line_items"] })

    await expand(result, "Line items")
    expect(await result.findByText("lineItem0")).toBeVisible()
    expect(result.getByText("lineItem9")).toBeVisible()
    expect(result.queryByText("lineItem10")).toBeNull()
    expect(result.getByText("common.pagination_range")).toBeVisible()

    await act(async () => {
      fireEvent.click(result.getByRole("button", { name: "common.next_page" }))
    })

    expect(await result.findByText("lineItem10")).toBeVisible()
    expect(result.queryByText("lineItem0")).toBeNull()
    expect(requestedPages).toEqual(["1/10", "2/10"])
  })

  it("keeps keyboard focus on the pager while it turns pages", async () => {
    mockPagedLineItems()
    const result = await setup({ names: ["line_items"] })

    await expand(result, "Line items")
    await result.findByText("lineItem0")
    const next = result.getByRole("button", { name: "common.next_page" })
    next.focus()

    await act(async () => {
      fireEvent.click(next)
    })
    await result.findByText("lineItem10")

    expect(next).toHaveFocus()
    expect(next).toHaveAttribute("aria-disabled", "true")
  })

  it("exposes an expanded row as a region labelled by its button", async () => {
    mockLineItems()
    const result = await setup({ names: ["line_items"] })

    await expand(result, "Line items")

    const button = result.getByRole("button", { name: /^Line items/ })
    const region = result.getByRole("region", { name: /^Line items/ })
    expect(button).toHaveAttribute("aria-controls", region.id)
  })

  it("announces the loading of a relationship", async () => {
    server.use(
      http.get(`https://*/api/:version/orders/:id/line_items`, async () => {
        await delay(100)
        return HttpResponse.json({
          data: [{ id: "kDrVYTkJDl", type: "line_items", attributes: {} }],
          meta: { record_count: 1, page_count: 1 },
        })
      }),
    )
    const result = await setup({ names: ["line_items"] })

    await expand(result, "Line items")

    expect(result.getByRole("status")).toHaveTextContent("common.loading")
    expect(await result.findByText("kDrVYTkJDl")).toBeVisible()
    expect(result.queryByRole("status")).toBeNull()
  })

  it("shows no pager when the records fit in one page", async () => {
    mockLineItems()
    const result = await setup({ names: ["line_items"] })

    await expand(result, "Line items")
    await result.findByText("kDrVYTkJDl")

    expect(
      result.queryByRole("button", { name: "common.next_page" }),
    ).toBeNull()
  })

  it("reopens a row on the page it was left on, without fetching it again", async () => {
    const { requestedPages } = mockPagedLineItems()
    const result = await setup({ names: ["line_items"] })

    await expand(result, "Line items")
    await result.findByText("lineItem0")
    await act(async () => {
      fireEvent.click(result.getByRole("button", { name: "common.next_page" }))
    })
    await result.findByText("lineItem10")
    await expand(result, "Line items")
    await expand(result, "Line items")

    expect(result.getByText("lineItem10")).toBeVisible()
    expect(requestedPages).toEqual(["1/10", "2/10"])
  })

  it("keeps the fetched records when the row is collapsed and reopened", async () => {
    const { requestedPages } = mockLineItems()
    const result = await setup({ names: ["line_items"] })

    await expand(result, "Line items")
    await result.findByText("kDrVYTkJDl")
    await expand(result, "Line items")
    await expand(result, "Line items")

    expect(result.getByText("kDrVYTkJDl")).toBeVisible()
    expect(requestedPages).toEqual(["1"])
  })

  it("calls onSelect with the related record", async () => {
    mockLineItems()
    const onSelect = vi.fn()
    const result = await setup({ names: ["line_items"], onSelect })

    await expand(result, "Line items")
    await result.findByText("kDrVYTkJDl")

    await act(async () => {
      fireEvent.click(
        result.getAllByRole("button", {
          name: "common.resource_details.view_record",
        })[0] as HTMLElement,
      )
    })

    expect(onSelect).toHaveBeenCalledWith({
      type: "line_items",
      id: "kDrVYTkJDl",
    })
  })

  it("lists records without a clickable eye when onSelect is not given", async () => {
    mockLineItems()
    const result = await setup({ names: ["line_items"] })

    await expand(result, "Line items")
    await result.findByText("kDrVYTkJDl")

    expect(
      result.queryAllByRole("button", {
        name: "common.resource_details.view_record",
      }),
    ).toHaveLength(0)
  })

  it("reports a relationship the SDK does not know, instead of an empty one", async () => {
    const result = await setup({ names: ["not_a_relationship"] })

    await expand(result, "Not a relationship")

    expect(await result.findByRole("alert")).toHaveTextContent(
      "common.resource_details.relationship_error",
    )
  })

  it("sets the message of a resource without relationships at 13px", async () => {
    const result = await setup({ names: [] })

    expect(
      result.getByText("common.resource_details.no_relationships"),
    ).toHaveClass("text-xs")
  })

  it("reports a failed request inside the row", async () => {
    server.use(
      http.get(`https://*/api/:version/orders/:id/line_items`, () =>
        HttpResponse.json({ errors: [] }, { status: 500 }),
      ),
    )
    const result = await setup({ names: ["line_items"] })

    await expand(result, "Line items")

    expect(await result.findByRole("alert")).toHaveTextContent(
      "common.resource_details.relationship_error",
    )
  })
})

describe("isHasManyRelationship", () => {
  it.each([
    ["line_items", true],
    ["available_payment_methods", true],
    ["skus", true],
    ["available_free_skus", true],
    ["market", false],
    ["billing_address", false],
    ["sku", false],
    ["discount_engine_item", false],
  ])("%s → %s", (name, expected) => {
    expect(isHasManyRelationship(name)).toBe(expected)
  })
})
