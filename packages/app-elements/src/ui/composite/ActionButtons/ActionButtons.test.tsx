import { render } from "@testing-library/react"
import { ActionButtons } from "./ActionButtons"

describe("ActionButtons", () => {
  it("Should not render when no actions", () => {
    const { getByTestId } = render(<ActionButtons actions={[]} />)
    expect(() => getByTestId("action-buttons")).toThrow()
  })

  it("Should render", () => {
    const { getByTestId } = render(
      <ActionButtons actions={[{ label: "Save", onClick: () => {} }]} />,
    )
    expect(getByTestId("action-buttons")).toBeVisible()
  })

  it("Should render one primary action", () => {
    const onSaveClick = vi.fn()
    const { getByTestId } = render(
      <ActionButtons actions={[{ label: "Save", onClick: onSaveClick }]} />,
    )

    const actionButtons = getByTestId("action-buttons")
    const buttons = actionButtons.querySelectorAll("button")
    const [saveButton] = buttons
    assertToBeDefined(saveButton)

    expect(buttons.length).toEqual(1)

    saveButton.click()
    expect(onSaveClick).toBeCalled()
    expect(saveButton.textContent).toEqual("Save")
    // stacked and full width on a phone, side by side from lg up
    expect(saveButton.className).toContain("w-full")
    expect(saveButton.className).toContain("lg:w-auto")
    expect(saveButton.parentElement?.className).toContain("flex-col-reverse")
    expect(saveButton.parentElement?.className).toContain("lg:flex-row")
  })

  it("Should render one primary action and one secondary action", () => {
    const onSaveClick = vi.fn()
    const onCancelClick = vi.fn()

    const { getByTestId } = render(
      <ActionButtons
        actions={[
          { label: "Save", onClick: onSaveClick },
          { label: "Cancel", onClick: onCancelClick, variant: "secondary" },
        ]}
      />,
    )

    const actionButtons = getByTestId("action-buttons")
    const buttons = actionButtons.querySelectorAll("button")
    const [cancelButton, saveButton] = buttons
    assertToBeDefined(cancelButton)
    assertToBeDefined(saveButton)

    expect(buttons.length).toEqual(2)

    saveButton.click()
    expect(onSaveClick).toBeCalled()
    expect(saveButton.textContent).toEqual("Save")
    expect(saveButton.className).toContain("w-full")
    expect(saveButton.className).toContain("lg:w-auto")

    cancelButton.click()
    expect(onCancelClick).toBeCalled()
    expect(cancelButton.textContent).toEqual("Cancel")
    expect(cancelButton.className).toContain("w-full")
    expect(cancelButton.className).toContain("lg:w-auto")
    // both in the same row, the secondary one first
    expect(cancelButton.parentElement).toBe(saveButton.parentElement)
  })
})
