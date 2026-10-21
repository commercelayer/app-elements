import { render } from "@testing-library/react"
import { Button } from "#ui/atoms/Button"
import { ModalFooterButtons } from "./ModalFooterButtons"

describe("ModalFooterButtons", () => {
  it("Should render the buttons, stacked on a phone and in a row from 480px", () => {
    const { getByTestId, getByText } = render(
      <ModalFooterButtons>
        <Button variant="secondary">Cancel</Button>
        <Button>Update</Button>
      </ModalFooterButtons>,
    )

    const element = getByTestId("modal-footer-buttons")
    const cancel = getByText("Cancel")
    const update = getByText("Update")

    // both in the same group, which goes full width and stacks the primary on top
    expect(cancel.parentElement).toBe(update.parentElement)
    expect(update.parentElement?.className).toContain("flex-col-reverse")
    expect(update.parentElement?.className).toContain("*:w-full")
    expect(update.parentElement?.className).toContain("min-[480px]:flex-row")
    expect(update.parentElement?.className).toContain("min-[480px]:ml-auto")
    expect(element.children.length).toBe(1)
  })

  it("Should render the start action apart from the other buttons", () => {
    const { getByTestId, getByText } = render(
      <ModalFooterButtons start={<Button variant="secondary">Add</Button>}>
        <Button>Update</Button>
      </ModalFooterButtons>,
    )

    const element = getByTestId("modal-footer-buttons")
    const add = getByText("Add")
    const update = getByText("Update")

    expect(element.children.length).toBe(2)
    expect(add.parentElement).toBe(element.firstElementChild)
    expect(add.parentElement).not.toBe(update.parentElement)
    expect(add.parentElement?.className).toContain("*:w-full")
  })
})
