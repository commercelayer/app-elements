import { fireEvent, render, waitFor } from "@testing-library/react"
import type { FC } from "react"
import { Button } from "#ui/atoms/Button"
import { useConfirmDialog } from "./useConfirmDialog"

const Implementation: FC<{ onConfirm?: () => void }> = ({ onConfirm }) => {
  const { show, ConfirmDialog } = useConfirmDialog()
  return (
    <>
      <Button onClick={show}>Open dialog</Button>
      <ConfirmDialog
        icon="trash"
        title="Delete import prices"
        description="This action cannot be undone."
        confirm={{
          label: "Delete",
          variant: "danger",
          onClick: async () => {
            onConfirm?.()
          },
        }}
      />
    </>
  )
}

/** The dialog's buttons, in DOM order, excluding the one that opens it. */
async function openDialog(): Promise<HTMLButtonElement[]> {
  return await waitFor(() => {
    const buttons = [
      ...document.querySelectorAll<HTMLButtonElement>(
        '[data-testid="modal-footer"] button',
      ),
    ]
    if (buttons.length === 0) throw new Error("dialog not open yet")
    return buttons
  })
}

describe("useConfirmDialog", () => {
  // A dialog is narrow at every width, so its buttons stay stacked and full width
  // rather than shrinking to their content on a wide screen.
  it("renders its buttons full width, one below the other", async () => {
    const { getByText } = render(<Implementation />)
    fireEvent.click(getByText("Open dialog"))

    const buttons = await openDialog()
    expect(buttons).toHaveLength(2)
    for (const button of buttons) {
      expect(button.className).toContain("w-full")
      expect(button.className).not.toContain("lg:w-auto")
    }
    // the footer stacks them: no flex row, just vertical rhythm
    const footer = buttons[0]?.parentElement
    expect(footer?.className).toContain("space-y-2")
    expect(footer?.className).not.toContain("flex-row")
  })

  it("confirms and cancels", async () => {
    const onConfirm = vi.fn()
    const { getByText } = render(<Implementation onConfirm={onConfirm} />)
    fireEvent.click(getByText("Open dialog"))

    const [confirm, cancel] = await openDialog()
    expect(confirm?.textContent).toBe("Delete")
    expect(cancel?.textContent).toBe("Cancel")

    fireEvent.click(confirm as HTMLButtonElement)
    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1)
    })
  })
})
