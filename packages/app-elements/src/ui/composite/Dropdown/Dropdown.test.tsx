import { fireEvent, render } from "@testing-library/react"
import { Button } from "#ui/atoms/Button"
import { Dropdown, DropdownDivider, DropdownItem } from "#ui/composite/Dropdown"

const items = (
  <>
    <DropdownItem onClick={() => {}} icon="creditCard" label="Payments" />
    <DropdownItem
      onClick={() => {}}
      icon="keep-space" // no icon, keep same gap
      label="Items"
    />

    <DropdownDivider />
    <DropdownItem onClick={() => {}} icon="xCircle" label="Delete" />
  </>
)

describe("Dropdown", () => {
  test("Should use the provided Button when `dropdownLabel` is set to Button", () => {
    const { container, getByText, getAllByRole } = render(
      <Dropdown
        dropdownLabel={<Button>Open dropdown</Button>}
        dropdownItems={items}
      />,
    )

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="relative"
        >
          <button
            aria-expanded="false"
            aria-haspopup="true"
            class="font-medium whitespace-nowrap leading-5 inline-flex items-center gap-1 justify-center transition-opacity duration-500 button h-10 min-w-10 text-base px-4 rounded bg-black border border-black text-white hover:opacity-80"
          >
            Open dropdown
          </button>
        </div>
      </div>
    `)

    const button = getByText("Open dropdown")
    expect(button).not.toHaveClass("m-0 p-0 align-top")

    expect(getAllByRole("button").length).toEqual(1)
  })

  test("Should be rendering with default bottom-right position", () => {
    const { container, getByText } = render(
      <Dropdown dropdownLabel="open dropdown" dropdownItems={items} />,
    )
    fireEvent.click(getByText("open dropdown"))
    expect(container).toMatchSnapshot()
  })

  test("Should be rendering bottom-left", () => {
    const { container, getByText } = render(
      <Dropdown
        dropdownLabel="open dropdown"
        menuPosition="bottom-left"
        dropdownItems={<div />}
      />,
    )
    fireEvent.click(getByText("open dropdown"))
    expect(container).toMatchSnapshot()
  })

  test("Should be rendering top-left", () => {
    const { container, getByText } = render(
      <Dropdown
        dropdownLabel="open dropdown"
        menuPosition="top-left"
        dropdownItems={<div />}
      />,
    )
    fireEvent.click(getByText("open dropdown"))
    expect(container).toMatchSnapshot()
  })

  test("Should be rendering top-right", () => {
    const { container, getByText } = render(
      <Dropdown
        dropdownLabel="open dropdown"
        menuPosition="top-right"
        dropdownItems={<div />}
      />,
    )
    fireEvent.click(getByText("open dropdown"))
    expect(container).toMatchSnapshot()
  })

  test("Should close the menu when an item is clicked, by default", () => {
    const { getByText, queryByText } = render(
      <Dropdown dropdownLabel="open dropdown" dropdownItems={items} />,
    )
    fireEvent.click(getByText("open dropdown"))
    fireEvent.click(getByText("Payments"))
    expect(queryByText("Payments")).toBeNull()
  })

  test("Should keep the menu open on item click when `closeOnItemClick` is false", () => {
    const { getByText } = render(
      <Dropdown
        dropdownLabel="open dropdown"
        dropdownItems={items}
        closeOnItemClick={false}
      />,
    )
    fireEvent.click(getByText("open dropdown"))
    fireEvent.click(getByText("Payments"))
    expect(getByText("Payments")).toBeVisible()
  })

  test("Should close on Escape and focus the trigger when `closeOnItemClick` is false", () => {
    const { getByText, queryByText } = render(
      <Dropdown
        dropdownLabel="open dropdown"
        dropdownItems={items}
        closeOnItemClick={false}
      />,
    )
    const trigger = getByText("open dropdown").closest("button")
    assertToBeDefined(trigger)
    fireEvent.click(trigger)
    fireEvent.keyDown(getByText("Payments"), { key: "Escape" })
    expect(queryByText("Payments")).toBeNull()
    expect(trigger).toHaveFocus()
  })

  test("Should close on Escape and focus the trigger with the default `closeOnItemClick`", () => {
    const { getByText, queryByText } = render(
      <Dropdown dropdownLabel="open dropdown" dropdownItems={items} />,
    )
    const trigger = getByText("open dropdown").closest("button")
    assertToBeDefined(trigger)
    fireEvent.click(trigger)
    // the item has focus: closing the menu unmounts it, and focus would fall
    // to `body` if nothing gave it back to the trigger
    getByText("Payments").closest("button")?.focus()
    fireEvent.keyDown(getByText("Payments"), { key: "Escape" })
    expect(queryByText("Payments")).toBeNull()
    expect(trigger).toHaveFocus()
  })

  test("Should name an icon-only trigger, so it does not read as a bare button", () => {
    const { getByRole } = render(
      <Dropdown dropdownLabel={<svg />} dropdownItems={items} />,
    )
    expect(
      getByRole("button", { name: "common.more_actions" }),
    ).toHaveAttribute("aria-haspopup", "true")
  })

  test("Should leave a text trigger to name itself", () => {
    const { getByRole } = render(
      <Dropdown dropdownLabel="open dropdown" dropdownItems={items} />,
    )
    expect(getByRole("button", { name: "open dropdown" })).not.toHaveAttribute(
      "aria-label",
    )
  })

  test("Should stay open on an Escape already handled inside the menu", () => {
    const { getByText } = render(
      <Dropdown
        dropdownLabel="open dropdown"
        closeOnItemClick={false}
        dropdownItems={
          // biome-ignore lint/a11y/noStaticElementInteractions: test fixture that consumes Escape, as a drag handle does
          <div
            onKeyDown={(event) => {
              event.preventDefault()
            }}
            onKeyUp={(event) => {
              event.preventDefault()
            }}
          >
            <DropdownItem onClick={() => {}} label="Payments" />
          </div>
        }
      />,
    )
    fireEvent.click(getByText("open dropdown"))
    fireEvent.keyDown(getByText("Payments"), { key: "Escape" })
    fireEvent.keyUp(getByText("Payments"), { key: "Escape" })
    expect(getByText("Payments")).toBeVisible()
  })
})
