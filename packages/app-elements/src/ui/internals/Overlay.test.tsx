import { render, waitFor } from "@testing-library/react"
import { CodeBlock } from "#ui/atoms/CodeBlock"
import { Modal } from "#ui/composite/Modal"
import { Input } from "#ui/forms/Input"
import { Overlay } from "./Overlay"

describe("Overlay surface", () => {
  /**
   * The class is a contract with the blocks rendered on the surface: `CodeBlock`
   * reads it to go a shade darker, because its own `bg-gray-50` would be
   * invisible on a gray-50 overlay. A white overlay must not carry it.
   */
  test("Should announce a light surface, so blocks on it can darken", () => {
    const { getByTestId } = render(
      <Overlay backgroundColor="light">
        <CodeBlock>secret</CodeBlock>
      </Overlay>,
    )

    expect(getByTestId("overlay").className).toContain(
      "overlay-container-light",
    )
  })

  test("Should not announce it when the overlay is white", () => {
    const { getByTestId } = render(
      <Overlay drawer onBackdropClick={() => {}}>
        <CodeBlock>secret</CodeBlock>
      </Overlay>,
    )

    expect(getByTestId("overlay").className).not.toContain(
      "overlay-container-light",
    )
  })
})

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

  test("focuses the first input, so an edit overlay is ready to type in", async () => {
    render(
      <Overlay>
        <Input placeholder="Reference" />
      </Overlay>,
    )
    // the overlay renders through a portal, so it lands on document.body
    const input = await waitFor(() => {
      const found = document.querySelector<HTMLInputElement>(
        'input[placeholder="Reference"]',
      )
      if (found == null) throw new Error("not rendered yet")
      return found
    })
    expect(document.activeElement).toBe(input)
  })

  // A details drawer's only input tends to be the timeline note at the bottom:
  // focusing it scrolled the panel down to it on open.
  test("leaves focus alone in a drawer", async () => {
    render(
      <Overlay drawer onBackdropClick={() => {}}>
        <Input placeholder="Leave a note" />
      </Overlay>,
    )
    const input = await waitFor(() => {
      const found = document.querySelector<HTMLInputElement>(
        'input[placeholder="Leave a note"]',
      )
      if (found == null) throw new Error("not rendered yet")
      return found
    })
    expect(document.activeElement).not.toBe(input)
  })
})
