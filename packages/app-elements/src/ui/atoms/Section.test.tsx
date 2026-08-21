import { render } from "@testing-library/react"
import { PageLayout } from "#ui/composite/PageLayout"
import { Section } from "./Section"

describe("Legend", () => {
  it("Should be rendered", () => {
    const { getByLabelText } = render(
      <Section
        title="Hello world"
        actionButton={<button type="button">Click me</button>}
      >
        My section content!
      </Section>,
    )

    expect(getByLabelText("Hello world")).toBeInTheDocument()
  })

  it("Should render as a <section> when title is defined", () => {
    const { container, getByRole } = render(
      <Section
        title="Hello world"
        actionButton={<button type="button">Click me</button>}
      >
        My section content!
      </Section>,
    )

    const [element] = container.children
    assertToBeDefined(element)

    expect(getByRole("banner")).toBeVisible()
    expect(getByRole("banner").children.length).toEqual(2)
    expect(getByRole("heading").tagName).toEqual("H2")

    expect(container.children.length).toEqual(1)
    expect(element).toBeVisible()
    expect(element.tagName).toEqual("SECTION")
    expect(element).toHaveAttribute("aria-label", "Hello world")
  })

  it("Should get the innerText from the `title` prop and set a valid `aria-label`", () => {
    const { getByRole } = render(
      <Section
        title={
          <div>
            This <b>is</b> <span style={{ color: "red" }}>the title</span>!
          </div>
        }
      >
        My section content!
      </Section>,
    )

    expect(getByRole("region")).toHaveAttribute(
      "aria-label",
      "This is the title!",
    )
  })

  it("Should render as a <div> when title is NOT defined", () => {
    const { container, getByRole, queryByRole } = render(
      <Section actionButton={<button type="button">Click me</button>}>
        My section content!
      </Section>,
    )

    const [element] = container.children
    assertToBeDefined(element)

    expect(getByRole("banner")).toBeVisible()
    expect(getByRole("banner").children.length).toEqual(1)
    expect(queryByRole("heading")).toBeNull()

    expect(container.children.length).toEqual(1)
    expect(element).toBeVisible()
    expect(element.tagName).toEqual("DIV")
    expect(element).not.toHaveAttribute("aria-label")
  })

  it("Should NOT render the header when `title` and `actionButton` are not defined", () => {
    const { container, queryByRole } = render(
      <Section>My section content!</Section>,
    )

    const [element] = container.children
    assertToBeDefined(element)

    expect(queryByRole("banner")).toBeNull()
    expect(queryByRole("heading")).toBeNull()

    expect(container.children.length).toEqual(1)
    expect(element).toBeVisible()
    expect(element.tagName).toEqual("DIV")
    expect(element).not.toHaveAttribute("aria-label")
  })

  // The sidebar column is narrower, so its header is more compact — but only from
  // `lg` up, where `PageLayout` actually splits into two columns. Below that the
  // section is full width and renders exactly as the default does.
  it("renders a more compact header in the sidebar, from lg up", () => {
    const { getByText } = render(
      <Section title="Details" surface="sidebar">
        content
      </Section>,
    )
    const title = getByText("Details")
    const header = title.parentElement

    expect(title.className).toContain("text-lg")
    expect(title.className).toContain("lg:text-base")
    expect(header?.className).toContain("pb-4")
    expect(header?.className).toContain("lg:pb-2")
  })

  it("keeps the default header at every width", () => {
    const { getByText } = render(<Section title="Details">content</Section>)
    const title = getByText("Details")

    expect(title.className).toContain("text-lg")
    expect(title.className).not.toContain("lg:text-base")
    expect(title.parentElement?.className).not.toContain("lg:pb-2")
  })

  // The unprefixed classes must match, or the two would differ on a phone.
  it("renders identically below lg", () => {
    const unprefixed = (className: string): string[] =>
      className.split(" ").filter((c) => c !== "" && !c.includes(":"))

    // rendered separately, so the two titles do not collide in one document
    const { getByText: getDefault, unmount } = render(
      <Section title="Details">content</Section>,
    )
    const asDefault = getDefault("Details")
    const defaultTitle = asDefault.className
    const defaultHeader = asDefault.parentElement?.className ?? ""
    unmount()

    const { getByText: getSidebar } = render(
      <Section title="Details" surface="sidebar">
        content
      </Section>,
    )
    const asSidebar = getSidebar("Details")

    expect(unprefixed(asSidebar.className)).toEqual(unprefixed(defaultTitle))
    expect(unprefixed(asSidebar.parentElement?.className ?? "")).toEqual(
      unprefixed(defaultHeader),
    )
  })

  // Any section in the sidebar adapts, not just the resource blocks: the whole
  // column should read as one thing.
  it("takes the sidebar rendering from the layout, with no prop", () => {
    const { getByText } = render(
      <PageLayout
        title="Customer"
        sidebar={<Section title="Details">x</Section>}
      >
        main
      </PageLayout>,
    )

    expect(getByText("Details").className).toContain("lg:text-base")
  })

  it("lets the prop override what the layout says", () => {
    const { getByText } = render(
      <PageLayout
        title="Customer"
        sidebar={
          <Section title="Details" surface="default">
            x
          </Section>
        }
      >
        main
      </PageLayout>,
    )

    expect(getByText("Details").className).not.toContain("lg:text-base")
  })
})
