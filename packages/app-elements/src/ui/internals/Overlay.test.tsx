import { render } from "@testing-library/react"
import { Modal } from "#ui/composite/Modal"
import { Overlay } from "./Overlay"

describe("Overlay body scroll lock", () => {
  beforeEach(() => {
    document.body.style.overflow = ""
  })

  test("Should lock the body while open and restore it once closed", () => {
    const { unmount } = render(<Overlay>content</Overlay>)
    expect(document.body.style.overflow).toBe("hidden")

    unmount()
    expect(document.body.style.overflow).toBe("")
  })

  test("Should keep the lock when a nested overlay closes", () => {
    // a details drawer with an edit overlay opened on top of it, as every drawer
    // app does through `ResourceMetadata` and `ResourceDetails`
    const { rerender, unmount } = render(
      <Overlay>
        drawer
        <Overlay>edit</Overlay>
      </Overlay>,
    )
    expect(document.body.style.overflow).toBe("hidden")

    rerender(<Overlay>drawer</Overlay>)
    expect(document.body.style.overflow).toBe("hidden")

    unmount()
    expect(document.body.style.overflow).toBe("")
  })

  test("Should keep the lock when a modal inside it closes", () => {
    const { rerender, unmount } = render(
      <Overlay>
        drawer
        <Modal show onClose={() => undefined} ariaLabel="dialog">
          <Modal.Body>are you sure?</Modal.Body>
        </Modal>
      </Overlay>,
    )
    expect(document.body.style.overflow).toBe("hidden")

    // the confirmation dialog is dismissed, the drawer behind it stays open
    rerender(
      <Overlay>
        drawer
        <Modal show={false} onClose={() => undefined} ariaLabel="dialog">
          <Modal.Body>are you sure?</Modal.Body>
        </Modal>
      </Overlay>,
    )
    expect(document.body.style.overflow).toBe("hidden")

    unmount()
    expect(document.body.style.overflow).toBe("")
  })

  test("Should restore the overflow the page already had", () => {
    document.body.style.overflow = "scroll"
    const { unmount } = render(<Overlay>content</Overlay>)
    expect(document.body.style.overflow).toBe("hidden")

    unmount()
    expect(document.body.style.overflow).toBe("scroll")
  })
})
