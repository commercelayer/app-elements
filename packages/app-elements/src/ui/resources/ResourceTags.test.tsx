import { act, fireEvent, render } from "@testing-library/react"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { ResourceTags } from "./ResourceTags"

const setup = async () =>
  await act(async () =>
    render(
      <TokenProvider kind="integration" appSlug="customers" devMode>
        <CoreSdkProvider>
          <ResourceTags
            resourceType="customers"
            resourceId="NMWYhbGorj"
            overlay={{ title: "customer@tk.com" }}
          />
        </CoreSdkProvider>
      </TokenProvider>,
    ),
  )

describe("ResourceTags", () => {
  // The section header carries a `…` menu rather than an Edit button, so the block
  // looks the same on a page, in a drawer and in the sidebar — the surface variants
  // then differ by CSS alone. Labels come from i18n, which is not initialised here,
  // so the item is matched by its `aria-label` key.
  it("offers editing through a `…` menu", async () => {
    const { container } = await setup()
    const header = container.querySelector("header")

    expect(header?.querySelectorAll("button")).toHaveLength(1)
    expect(
      container.querySelector('[aria-label="common.edit"]'),
    ).not.toBeInTheDocument()

    await act(async () => {
      fireEvent.click(header?.querySelector("button") as HTMLButtonElement)
    })

    expect(
      container.querySelector('[aria-label="common.edit"]'),
    ).toBeInTheDocument()
  })
})
