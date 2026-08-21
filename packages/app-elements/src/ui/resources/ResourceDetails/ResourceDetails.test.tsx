import { fireEvent, render } from "@testing-library/react"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { PageLayout } from "#ui/composite/PageLayout"
import { ResourceDetails } from "./ResourceDetails"

const resource = {
  id: "NMWYhbGorj",
  type: "customers" as const,
  reference: null,
  reference_origin: null,
  created_at: "2024-03-15T12:35:00.000Z",
  updated_at: "2024-03-15T12:35:00.000Z",
}

const wrap = (children: React.ReactNode) => (
  <TokenProvider kind="integration" appSlug="customers" devMode>
    {children}
  </TokenProvider>
)

/** The row wrapping the given label. */
const row = (container: HTMLElement, label: string): HTMLElement | null =>
  container.querySelector(`[data-testid="list-details-item-${label}"]`)

describe("ResourceDetails", () => {
  it("lays out for the wider surfaces by default", () => {
    const { container } = render(
      wrap(<ResourceDetails resource={resource} onUpdated={async () => {}} />),
    )
    const id = row(container, "ID")

    // two columns from md up, with a divider on every row
    expect(id?.className).toContain("md:grid-cols-[1fr_1.4fr]!")
    expect(id?.className).not.toContain("lg:grid-cols-1!")
    expect(id?.className).toContain("border-b")
    expect(id?.className).not.toContain("lg:border-b-0")
  })

  // In a 380px column two columns do not fit, and the vertical gaps separate the
  // rows better than lines do.
  it("stays stacked and drops its dividers in the sidebar, from lg up", () => {
    const { container } = render(
      wrap(
        <ResourceDetails
          resource={resource}
          onUpdated={async () => {}}
          variant="sidebar"
        />,
      ),
    )
    const id = row(container, "ID")

    expect(id?.className).toContain("lg:grid-cols-1!")
    expect(id?.className).toContain("lg:border-b-0")
  })

  it("takes the sidebar rendering from the layout, with no prop", () => {
    const { container } = render(
      wrap(
        <PageLayout
          title="Customer"
          sidebar={
            <ResourceDetails resource={resource} onUpdated={async () => {}} />
          }
        >
          main
        </PageLayout>,
      ),
    )

    expect(row(container, "ID")?.className).toContain("lg:grid-cols-1!")
  })

  it("lets the prop override what the layout says", () => {
    const { container } = render(
      wrap(
        <PageLayout
          title="Customer"
          sidebar={
            <ResourceDetails
              resource={resource}
              onUpdated={async () => {}}
              variant="default"
            />
          }
        >
          main
        </PageLayout>,
      ),
    )

    expect(row(container, "ID")?.className).not.toContain("lg:grid-cols-1!")
  })

  // The rows show values only: copying the id and editing the reference are in the
  // section's menu, so the block looks the same wherever it renders.
  it("keeps its actions in the `…` menu", () => {
    const { container } = render(
      wrap(<ResourceDetails resource={resource} onUpdated={async () => {}} />),
    )

    // no control on the rows themselves: the id is text, not a copy button
    expect(row(container, "ID")?.querySelector("button")).toBeNull()

    const trigger = container.querySelector('[aria-haspopup="true"]')
    assertToBeDefined(trigger)
    expect(container.textContent).not.toContain("common.copy_id")

    fireEvent.click(trigger)

    // rendered without `I18NProvider`, so the items read as their keys
    expect(container.textContent).toContain("common.copy_id")
    expect(container.textContent).toContain("common.edit_resource")
  })

  // Every difference hides behind `lg:`, so the two read the same on a phone.
  it("renders identically below lg", () => {
    const unprefixed = (className: string): string[] =>
      className.split(" ").filter((c) => c !== "" && !c.includes(":"))

    const { container: asDefault, unmount } = render(
      wrap(<ResourceDetails resource={resource} onUpdated={async () => {}} />),
    )
    const defaultRow = unprefixed(row(asDefault, "ID")?.className ?? "")
    unmount()

    const { container: asSidebar } = render(
      wrap(
        <ResourceDetails
          resource={resource}
          onUpdated={async () => {}}
          variant="sidebar"
        />,
      ),
    )

    expect(unprefixed(row(asSidebar, "ID")?.className ?? "")).toEqual(
      defaultRow,
    )
  })
})
