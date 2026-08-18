import { type RenderResult, render } from "@testing-library/react"
import { OverlayContext } from "#ui/internals/overlayContext"
import { PageHeading, type PageHeadingProps } from "./PageHeading"

interface SetupProps extends PageHeadingProps {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, ...rest }: SetupProps): SetupResult => {
  const utils = render(<PageHeading data-testid={id} {...rest} />)
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils,
  }
}

describe("PageHeading", () => {
  test("Should be rendered", () => {
    const { element } = setup({ id: "heading", title: "My Page Heading" })
    expect(element.querySelector("h1")?.innerHTML).toBe("My Page Heading")
  })

  test("Should also render optional description", () => {
    const { getByText } = setup({
      id: "heading",
      title: "My Page Heading",
      description: "Lorem ipsum...",
    })
    expect(getByText("Lorem ipsum...")).toBeVisible()
  })

  test("Should render nothing below the title when there is no description", () => {
    const { element } = setup({ id: "heading", title: "My Page Heading" })
    // an empty div would still push its `mt-2` below the title
    expect(element.querySelector("h1")?.parentElement?.nextElementSibling).toBe(
      null,
    )
  })

  test("Should also render optional badge", () => {
    const { getByTestId } = setup({
      id: "heading-w-badge",
      title: "My Page Heading",
      badge: { label: "TEST DATA", variant: "success" },
    })
    const badgeElement = getByTestId("page-heading-badge")
    expect(badgeElement).toBeInTheDocument()
    expect(
      badgeElement.querySelector(".text-green-700.bg-green-100"),
    ).toBeInTheDocument()
  })

  test("Should also have a button when navigationButton is set", () => {
    const foo: string[] = []
    const { element } = setup({
      id: "heading",
      title: "My Page Heading",
      description: "Lorem ipsum...",
      navigationButton: {
        label: "Go back",
        onClick: () => foo.push("bar"),
      },
    })
    expect(element.querySelector("button")).toBeVisible()
    element.querySelector("button")?.click()
    expect(foo.includes("bar")).toBe(true)
  })

  test("Should render the navigation button as a secondary button when asked", () => {
    const { element, getByLabelText } = setup({
      id: "heading",
      title: "My Page Heading",
      navigationButton: {
        label: "",
        icon: "x",
        variant: "button",
        onClick: () => undefined,
      },
    })
    // an icon-only button still needs a name to be usable, and on a page (this one
    // is not rendered inside a drawer) the button goes back rather than closing
    const button = getByLabelText("Go back")
    expect(button).toBeVisible()
    expect(button.className).toContain("border-gray-200")
    // square, exactly like the toolbar buttons next to it: `Button` only drops its
    // horizontal padding when a lone `Icon` is its single child
    expect(button.className).toContain("h-9 min-w-9")
    expect(button.className).not.toContain("px-4")
    // the inline style renders its label in a `Text`, this one does not
    expect(element.querySelector("button > div")).toBe(null)
  })

  test("Should name the icon-only navigation button after its surface", () => {
    const { getByLabelText } = render(
      <OverlayContext.Provider value={{ surface: "drawer" }}>
        <PageHeading
          title="My Page Heading"
          navigationButton={{
            label: "",
            icon: "x",
            variant: "button",
            onClick: () => undefined,
          }}
        />
      </OverlayContext.Provider>,
    )
    // inside a drawer the button dismisses the panel it sits in
    expect(getByLabelText("Close")).toBeVisible()
  })
})

describe("PageHeading gap", () => {
  test("Should have gap top and bottom", () => {
    const { element } = setup({
      id: "heading",
      title: "My Page Heading",
    })
    expect(element).toHaveClass("pt-5 md:pt-10 pb-6 md:pb-14")
  })

  test("Should have gap only on top", () => {
    const { element } = setup({
      id: "heading",
      title: "My Page Heading",
      gap: "only-top",
    })
    expect(element).toHaveClass("pt-5 md:pt-10")
    expect(element).not.toHaveClass("pb-6 md:pb-14")
  })

  test("Should have no vertical gap", () => {
    const { element } = setup({
      id: "heading",
      title: "My Page Heading",
      gap: "none",
    })
    expect(element.classList.toString()).toBe("w-full")
  })
})
