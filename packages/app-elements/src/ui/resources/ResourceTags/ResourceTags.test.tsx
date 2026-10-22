import { act, render, screen } from "@testing-library/react"
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
            modal={{ title: "customer@tk.com" }}
          />
        </CoreSdkProvider>
      </TokenProvider>,
    ),
  )

describe("ResourceTags", () => {
  // Edit sits in the section header. The labels come from i18n, which is not
  // initialised here.
  it("shows edit in the header", async () => {
    const { container } = await setup()
    // the tags are fetched on mount: waiting for them keeps the request from
    // settling after the test, once the jsdom environment is torn down
    expect(await screen.findByText("vip")).toBeInTheDocument()
    const header = container.querySelector("header")

    expect(header?.querySelectorAll("button")).toHaveLength(1)
    expect(
      header?.querySelector('[aria-label="common.edit_resource"]'),
    ).toBeInTheDocument()
  })
})
