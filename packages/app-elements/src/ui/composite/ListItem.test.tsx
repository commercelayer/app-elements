import { act, type RenderResult, render } from "@testing-library/react"
import { ListContext } from "#ui/internals/listContext"
import { ListItem, type ListItemProps } from "./ListItem"

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = (props: ListItemProps): SetupResult => {
  const utils = render(<ListItem data-testid="my-item" {...props} />)
  const element = utils.getByTestId("my-item")
  return {
    element,
    ...utils,
  }
}

describe("ListItem", () => {
  test("Should be rendered as div", async () => {
    const { element } = setup({
      children: <div>Content</div>,
    })
    expect(element).toBeInTheDocument()
    expect(element.tagName).toBe("DIV")
  })

  test("Should be rendered as button", async () => {
    const onClick = vi.fn()
    const { element } = setup({
      onClick,
      children: <div>Content</div>,
    })
    expect(element).toBeInTheDocument()
    expect(element.tagName).toBe("BUTTON")
    act(() => {
      element.click()
    })
    expect(onClick).toBeCalledTimes(1)
  })

  test("Should be rendered as anchor", () => {
    const { element } = setup({
      href: "https://www.commercelayer.io",
      children: <div>Content</div>,
    })
    expect(element).toBeInTheDocument()
    expect(element.tagName).toBe("A")
    expect(element.getAttribute("href")).toBe("https://www.commercelayer.io")
    expect(element).toHaveClass("hover:bg-gray-50")
  })

  test("Should not have hover effect when href is not set", () => {
    const { element } = setup({
      children: <div>Content</div>,
    })
    expect(element).toBeInTheDocument()
    expect(element).not.toHaveClass("hover:bg-gray-50")
  })

  test("Should fade its content instead of its background on hover in a boxed list", () => {
    const { getByTestId } = render(
      <ListContext.Provider value={{ boxed: true, isLastRow: false }}>
        <ListItem data-testid="my-item" href="#">
          <div>Content</div>
        </ListItem>
      </ListContext.Provider>,
    )
    const element = getByTestId("my-item")
    expect(element).not.toHaveClass("hover:bg-gray-50")
    expect(element).toHaveClass("group/list-item")
    expect(element.firstElementChild).toHaveClass(
      "group-hover/list-item:opacity-70",
    )
  })

  test("Should leave out the side padding of a clickable row in a boxed list", () => {
    const { getByTestId } = render(
      <ListContext.Provider value={{ boxed: true, isLastRow: false }}>
        <ListItem data-testid="my-item" href="#">
          <div>Content</div>
        </ListItem>
      </ListContext.Provider>,
    )
    const element = getByTestId("my-item")
    expect(element).toHaveClass("py-4")
    expect(element).not.toHaveClass("px-4")
  })

  test("Should keep an explicit padding in a boxed list", () => {
    const { getByTestId } = render(
      <ListContext.Provider value={{ boxed: true, isLastRow: false }}>
        <ListItem data-testid="my-item" href="#" padding="xy">
          <div>Content</div>
        </ListItem>
      </ListContext.Provider>,
    )
    expect(getByTestId("my-item")).toHaveClass("px-4")
  })
})
