import { fireEvent, render } from "@testing-library/react"
import { Modal } from "./Modal"

interface SetupOptions {
  dismissible?: boolean
  show?: boolean
}

const setup = ({ dismissible = false, show = true }: SetupOptions = {}) => {
  const onClose = vi.fn()

  const utils = render(
    <Modal show={show} onClose={onClose} dismissible={dismissible}>
      <Modal.Header>My Modal</Modal.Header>
      <Modal.Body>Body</Modal.Body>
    </Modal>,
  )

  const dialog = document.body.querySelector("dialog") as HTMLDialogElement
  const backdrop = utils.getByTestId("modal-backdrop")
  const closeButton = utils.getByLabelText("Close")

  return {
    ...utils,
    onClose,
    dialog,
    backdrop,
    closeButton,
  }
}

describe("Modal", () => {
  test("Should not close on backdrop click when dismissible is false", () => {
    const { backdrop, onClose } = setup({ dismissible: false })

    fireEvent.click(backdrop)

    expect(onClose).not.toHaveBeenCalled()
  })

  test("Should not close on Escape cancel event when dismissible is false", () => {
    const { dialog, onClose } = setup({ dismissible: false })

    fireEvent(dialog, new Event("cancel", { cancelable: true }))

    expect(onClose).not.toHaveBeenCalled()
  })

  test("Should not close from keyboard activation on close button when dismissible is false", () => {
    const { closeButton, onClose } = setup({ dismissible: false })

    fireEvent.keyDown(closeButton, { key: "Enter" })
    fireEvent.keyDown(closeButton, { key: " " })

    expect(onClose).not.toHaveBeenCalled()
  })

  test("Should close on close button click when dismissible is false", () => {
    const { closeButton, onClose } = setup({ dismissible: false })

    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test("Should close on backdrop click when dismissible is true", () => {
    const { backdrop, onClose } = setup({ dismissible: true })

    fireEvent.click(backdrop)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test("Should close on Escape cancel event when dismissible is true", () => {
    const { dialog, onClose } = setup({ dismissible: true })

    fireEvent(dialog, new Event("cancel", { cancelable: true }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test("Should keep dialog visibility in sync across open-close-open cycle", () => {
    const onClose = vi.fn()
    const { rerender } = render(
      <Modal show={false} onClose={onClose} dismissible>
        <Modal.Header>My Modal</Modal.Header>
        <Modal.Body>Body</Modal.Body>
      </Modal>,
    )

    const dialog = document.body.querySelector("dialog") as HTMLDialogElement
    expect(dialog).toHaveClass("hidden")
    expect(dialog.open).toBe(false)

    rerender(
      <Modal show onClose={onClose} dismissible>
        <Modal.Header>My Modal</Modal.Header>
        <Modal.Body>Body</Modal.Body>
      </Modal>,
    )
    expect(dialog).toHaveClass("grid")
    expect(dialog.open).toBe(true)

    rerender(
      <Modal show={false} onClose={onClose} dismissible>
        <Modal.Header>My Modal</Modal.Header>
        <Modal.Body>Body</Modal.Body>
      </Modal>,
    )
    expect(dialog).toHaveClass("hidden")
    expect(dialog.open).toBe(false)

    rerender(
      <Modal show onClose={onClose} dismissible>
        <Modal.Header>My Modal</Modal.Header>
        <Modal.Body>Body</Modal.Body>
      </Modal>,
    )
    expect(dialog).toHaveClass("grid")
    expect(dialog.open).toBe(true)
  })

  test("Should use ariaLabel when Modal.Header is not rendered", () => {
    const onClose = vi.fn()
    render(
      <Modal show onClose={onClose} ariaLabel="Details panel" dismissible>
        <Modal.Body>Body</Modal.Body>
      </Modal>,
    )

    expect(document.body.querySelector("dialog")).toHaveAttribute(
      "aria-label",
      "Details panel",
    )
  })

  test("Should keep backdrop out of tab order", () => {
    const { backdrop } = setup({ dismissible: true })

    expect(backdrop).toHaveAttribute("tabindex", "-1")
  })

  test("Should keep aria-labelledby associations unique with multiple modals", () => {
    const onClose = vi.fn()
    render(
      <>
        <Modal show onClose={onClose} dismissible>
          <Modal.Header>First Modal</Modal.Header>
          <Modal.Body>Body</Modal.Body>
        </Modal>
        <Modal show onClose={onClose} dismissible>
          <Modal.Header>Second Modal</Modal.Header>
          <Modal.Body>Body</Modal.Body>
        </Modal>
      </>,
    )

    const dialogs = Array.from(document.body.querySelectorAll("dialog"))
    expect(dialogs).toHaveLength(2)

    const firstLabelId = dialogs[0]?.getAttribute("aria-labelledby")
    const secondLabelId = dialogs[1]?.getAttribute("aria-labelledby")

    expect(firstLabelId).toBeTruthy()
    expect(secondLabelId).toBeTruthy()
    expect(firstLabelId).not.toBe(secondLabelId)
    expect(document.getElementById(firstLabelId ?? "")).toBeInTheDocument()
    expect(document.getElementById(secondLabelId ?? "")).toBeInTheDocument()
  })

  test("Should fallback to open property when showModal/close are unavailable", () => {
    const onClose = vi.fn()
    const { rerender } = render(
      <Modal show={false} onClose={onClose} dismissible>
        <Modal.Header>My Modal</Modal.Header>
        <Modal.Body>Body</Modal.Body>
      </Modal>,
    )

    const dialog = document.body.querySelector("dialog") as HTMLDialogElement
    const originalShowModal = dialog.showModal
    const originalClose = dialog.close

    Object.defineProperty(dialog, "showModal", {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(dialog, "close", {
      configurable: true,
      value: undefined,
    })

    rerender(
      <Modal show onClose={onClose} dismissible>
        <Modal.Header>My Modal</Modal.Header>
        <Modal.Body>Body</Modal.Body>
      </Modal>,
    )
    expect(dialog.open).toBe(true)

    rerender(
      <Modal show={false} onClose={onClose} dismissible>
        <Modal.Header>My Modal</Modal.Header>
        <Modal.Body>Body</Modal.Body>
      </Modal>,
    )
    expect(dialog.open).toBe(false)

    Object.defineProperty(dialog, "showModal", {
      configurable: true,
      value: originalShowModal,
    })
    Object.defineProperty(dialog, "close", {
      configurable: true,
      value: originalClose,
    })
  })
})
