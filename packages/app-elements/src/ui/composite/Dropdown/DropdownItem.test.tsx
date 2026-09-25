import { fireEvent, render } from "@testing-library/react"
import { DropdownItem } from "./DropdownItem"

describe("DropdownItem", () => {
  const mockedOnClick = vi.fn()

  afterEach(() => {
    vi.clearAllMocks()
  })

  test("Should render with width default options as button", () => {
    const { getByText, container } = render(
      <DropdownItem label="Edit item" onClick={mockedOnClick} />,
    )
    const element = container.firstElementChild
    assertToBeDefined(element)
    expect(element.tagName).toBe("BUTTON")
    expect(getByText("Edit item")).toBeVisible()
    expect(mockedOnClick).toHaveBeenCalledTimes(0)
  })

  test("Should handle onClick event", () => {
    const { getByText } = render(
      <DropdownItem label="Edit item" onClick={mockedOnClick} />,
    )
    expect(getByText("Edit item")).toBeVisible()
    fireEvent.click(getByText("Edit item"))
    expect(mockedOnClick).toHaveBeenCalledTimes(1)
  })

  test("Should be rendered as anchor when used with href", () => {
    const { container, getByText } = render(
      <DropdownItem
        label="Visit documentation"
        href="https://commercelayer.io/"
        target="_blank"
      />,
    )
    const element = container.firstElementChild
    assertToBeDefined(element)
    expect(getByText("Visit documentation")).toBeVisible()
    expect(element.tagName).toBe("A")
    expect(element.getAttribute("href")).toBe("https://commercelayer.io/")
    expect(element.getAttribute("target")).toBe("_blank")
  })

  test("Should render a checkable item with a check mark when `checked` is true", () => {
    const { getByRole } = render(
      <DropdownItem label="Status" checked onClick={mockedOnClick} />,
    )
    const item = getByRole("menuitemcheckbox", { name: "Status" })
    expect(item).toHaveAttribute("aria-checked", "true")
    expect(item.querySelector("svg")).not.toBeNull()
  })

  test("Should keep the icon slot empty when `checked` is false", () => {
    const { getByRole } = render(
      <DropdownItem label="Tags" checked={false} onClick={mockedOnClick} />,
    )
    const item = getByRole("menuitemcheckbox", { name: "Tags" })
    expect(item).toHaveAttribute("aria-checked", "false")
    expect(item.querySelector("svg")).toBeNull()
  })

  test("Should let `role` override the checkable default", () => {
    const { getByRole } = render(
      <DropdownItem
        label="Newest first"
        checked
        role="menuitemradio"
        onClick={mockedOnClick}
      />,
    )
    expect(getByRole("menuitemradio", { name: "Newest first" })).toBeVisible()
  })
})
