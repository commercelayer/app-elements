import type { Resource } from "@commercelayer/sdk"
import { act, type RenderResult, render } from "@testing-library/react"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import type { TokenProviderExtras } from "#providers/TokenProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import {
  ResourceDetailsContent,
  type ResourceDetailsTab,
} from "./ResourceDetailsContent"

/**
 * Assertions avoid translated copy: like the other tests in this package, the
 * component is rendered without `I18NProvider`, so `t()` yields raw keys.
 * Attribute labels and the upsell link are unaffected by that.
 */
const EVENT_STORES_DOCS_URL =
  "https://docs.commercelayer.io/core-api-reference/event_stores"

const resource = {
  id: "NgojhKoyYN",
  type: "orders",
  status: "placed",
  payment_status: "authorized",
  formatted_total_amount: "$650.00",
  metadata: { source: "storefront" },
  market: { id: "dvzXAuNQpm", type: "markets", name: "Europe" },
  billing_address: { id: "yzXAuNQpmd", type: "addresses", first_name: "Bruce" },
  line_items: [{ id: "kDrVYTkJDl", type: "line_items" }],
} as unknown as Resource

const setup = async ({
  tabs,
  extras,
}: {
  tabs?: ResourceDetailsTab[]
  extras?: TokenProviderExtras
} = {}): Promise<RenderResult> =>
  await act(async () =>
    render(
      <TokenProvider
        kind="integration"
        appSlug="orders"
        devMode
        extras={extras}
      >
        <CoreSdkProvider>
          <ResourceDetailsContent resource={resource} tabs={tabs} />
        </CoreSdkProvider>
      </TokenProvider>,
    ),
  )

const openTab = async (result: RenderResult, index: number): Promise<void> => {
  const tabs = result.getAllByRole("tab")
  await act(async () => {
    tabs[index]?.click()
  })
}

describe("ResourceDetailsContent", () => {
  it("renders an Attributes and an Events tab", async () => {
    const { getAllByRole } = await setup()

    expect(getAllByRole("tab")).toHaveLength(2)
  })

  it("shows plain attributes and leaves relationships out", async () => {
    const { getByText, queryByText } = await setup()

    expect(getByText("Status")).toBeVisible()
    expect(getByText("placed")).toBeVisible()
    // Relationships are not this component's concern.
    expect(queryByText("Market")).toBeNull()
    expect(queryByText("Billing address")).toBeNull()
    expect(queryByText("Line items")).toBeNull()
  })

  it("keeps free-form JSON attributes in the attribute list", async () => {
    const { getByText } = await setup()

    expect(getByText("Metadata")).toBeVisible()
  })

  it("renders additional tabs between Attributes and Events", async () => {
    const { getAllByRole } = await setup({
      tabs: [{ name: "Transactions", content: () => <div>tab body</div> }],
    })

    const tabs = getAllByRole("tab")
    expect(tabs).toHaveLength(3)
    expect(tabs[1]?.textContent).toBe("Transactions")
  })

  it("passes the resource to an additional tab", async () => {
    const result = await setup({
      tabs: [
        {
          name: "Transactions",
          content: (given) => <div>received {given.id}</div>,
        },
      ],
    })

    await openTab(result, 1)

    expect(result.getByText(/received NgojhKoyYN/)).toBeVisible()
  })

  it("gives each instance its own tab ids, so several can share a page", async () => {
    const { container } = await act(async () =>
      render(
        <TokenProvider kind="integration" appSlug="orders" devMode>
          <CoreSdkProvider>
            <ResourceDetailsContent resource={resource} />
            <ResourceDetailsContent resource={resource} />
          </CoreSdkProvider>
        </TokenProvider>,
      ),
    )

    const ids = [...container.querySelectorAll("[id]")].map((el) => el.id)
    expect(ids).toHaveLength(new Set(ids).size)
  })

  it("shows the Event Stores upsell when the organization is not enterprise", async () => {
    const result = await setup()

    await openTab(result, 1)

    expect(
      result.container.querySelector(`a[href="${EVENT_STORES_DOCS_URL}"]`),
    ).toBeVisible()
  })

  it("loads the event timeline when the organization is enterprise", async () => {
    const result = await setup({
      extras: { organization: { isEnterprise: true } },
    })

    await openTab(result, 1)

    // Proves the `event_stores` request is actually served: the name is
    // derived from the mocked events' `who.owner`. The mock returns a full page,
    // so several rows carry it.
    expect((await result.findAllByText("R. Starr")).length).toBeGreaterThan(0)

    expect(
      result.container.querySelector(`a[href="${EVENT_STORES_DOCS_URL}"]`),
    ).toBeNull()
  })
})
