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
            modal={{ title: "customer@tk.com" }}
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
      container.querySelector('[aria-label="common.edit common.metadata"]'),
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
      container.querySelector('[aria-label="common.edit common.metadata"]'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[aria-label="common.view_json"]'),
    ).toBeInTheDocument()
  })

  // `gdpr_preferences` is an object, which this form cannot edit: its row is kept
  // in the form values — hidden — so the value survives an update. Removing a row
  // above it used to shift it onto the type of whichever entry had been sitting
  // at its new index, turning it into an editable text input.
  it("keeps a non-editable entry hidden after a row above it is removed", async () => {
    const { container, baseElement } = await setup()

    const trigger = container.querySelector("header")?.querySelector("button")
    await act(async () => {
      fireEvent.click(trigger as HTMLButtonElement)
    })
    await act(async () => {
      fireEvent.click(
        container.querySelector(
          '[aria-label="common.edit common.metadata"]',
        ) as HTMLElement,
      )
    })

    // the two string entries, while `gdpr_preferences` has no row on screen
    const removeButtons = (): HTMLElement[] =>
      Array.from(baseElement.querySelectorAll('[aria-label="common.remove"]'))
    expect(removeButtons()).toHaveLength(2)

    await act(async () => {
      fireEvent.click(removeButtons()[0] as HTMLElement)
    })

    expect(removeButtons()).toHaveLength(1)
  })
})
