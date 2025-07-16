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
    expect(saveButton.parentElement?.className).toContain("flex")
    expect(saveButton.parentElement?.className).not.toContain("md:basis-1/2")
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
    expect(saveButton.parentElement?.className).toContain("flex")
    expect(saveButton.parentElement?.className).toContain("md:basis-1/2")

    cancelButton.click()
    expect(onCancelClick).toBeCalled()
    expect(cancelButton.textContent).toEqual("Cancel")
    expect(cancelButton.parentElement?.className).toContain("flex")
    expect(cancelButton.parentElement?.className).toContain("md:basis-1/2")
  })
})
