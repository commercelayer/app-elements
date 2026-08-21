import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { ResourceMetadata } from "./ResourceMetadata"

const setup = async (): Promise<RenderResult> => {
  return await act(async () =>
    render(
      <TokenProvider kind="integration" appSlug="customers" devMode>
        <CoreSdkProvider>
          <ResourceMetadata
            resourceType="customers"
            resourceId="NMWYhbGorj"
            overlay={{ title: "customer@tk.com" }}
          />
        </CoreSdkProvider>
      </TokenProvider>,
    ),
  )
}

describe("ResourceMetadata", () => {
  it("should render object entries with string values", async () => {
    const { queryByTestId } = await setup()

    expect(queryByTestId("ResourceMetadata-item-first_name")).toBeVisible()
    expect(
      queryByTestId("ResourceMetadata-value-first_name")?.innerHTML,
    ).toContain("John")
    expect(queryByTestId("ResourceMetadata-item-last_name")).toBeVisible()
    expect(
      queryByTestId("ResourceMetadata-value-last_name")?.innerHTML,
    ).toContain("Doe")
  })

  it("should render in a different way object entries with non string values", async () => {
    const { queryByTestId } = await setup()
    expect(
      queryByTestId("ResourceMetadata-item-gdpr_preferences"),
    ).toBeVisible()
    expect(
      queryByTestId("ResourceMetadata-value-gdpr_preferences")?.innerHTML,
    ).toContain("[...]")
  })

  // The section header carries a `…` menu rather than buttons, so the block looks
  // the same on a page, in a drawer and in the sidebar — the surface variants then
  // differ by CSS alone. The labels come from i18n, which is not initialised here,
  // so the items are matched by their `aria-label` keys.
  it("offers its actions through a `…` menu", async () => {
    const { container } = await setup()
    const header = container.querySelector("header")

    // one trigger, and the actions are not on screen until it is opened
    expect(header?.querySelectorAll("button")).toHaveLength(1)
    // (the trigger icon carries an `aria-label` of its own, hence exact matches)
    expect(
      container.querySelector('[aria-label="common.edit"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[aria-label="common.view_json"]'),
    ).not.toBeInTheDocument()

    const trigger = header?.querySelector("button")
    await act(async () => {
      fireEvent.click(trigger as HTMLButtonElement)
    })

    // edit, plus the JSON view since this resource has metadata
    expect(
      container.querySelector('[aria-label="common.edit"]'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[aria-label="common.view_json"]'),
    ).toBeInTheDocument()
  })
})
