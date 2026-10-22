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
          <ResourceMetadata resourceType="customers" resourceId="NMWYhbGorj" />
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

  // Edit sits in the section header, while the JSON view lives inside the
  // metadata card. The labels come from i18n, which is not initialised here.
  it("shows edit in the header and the JSON view inside the card", async () => {
    const { container, getByText } = await setup()
    const header = container.querySelector("header")

    expect(header?.querySelectorAll("button")).toHaveLength(1)
    expect(
      header?.querySelector('[aria-label="common.edit_resource"]'),
    ).toBeInTheDocument()

    const viewJson = getByText("common.view_json")
    expect(header).not.toContainElement(viewJson)
    expect(
      container.querySelector(
        '[data-testid="ResourceMetadata-item-first_name"]',
      )?.parentElement,
    ).toContainElement(viewJson)
  })

  // `gdpr_preferences` is an object, which this form cannot edit: its row is kept
  // in the form values — hidden — so the value survives an update. Removing a row
  // above it used to shift it onto the type of whichever entry had been sitting
  // at its new index, turning it into an editable text input.
  it("keeps a non-editable entry hidden after a row above it is removed", async () => {
    const { container, baseElement } = await setup()

    await act(async () => {
      fireEvent.click(
        container.querySelector(
          '[aria-label="common.edit_resource"]',
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
