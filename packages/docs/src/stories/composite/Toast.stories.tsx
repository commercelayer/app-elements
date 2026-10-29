import type { Meta, StoryFn } from "@storybook/react-vite"
import { useState } from "react"
import { useOverlay } from "#hooks/useOverlay"
import { Button } from "#ui/atoms/Button"
import { Modal } from "#ui/composite/Modal"
import { ToastContainer, toast } from "#ui/composite/Toast"

const setup: Meta<typeof ToastContainer> = {
  title: "Composite/Toast (notifications)",
  component: ToastContainer,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          paddingBottom: "50px",
        }}
      >
        <Story />
      </div>
    ),
  ],
}
export default setup

// The docs page renders all stories together, so the `ToastContainer` is rendered
// once in `Toast.mdx`: one per story would show every toast once per story.

export const Default: StoryFn = () => {
  return (
    <div className="flex flex-col gap-2">
      <Button
        className="w-fit"
        alignItems="center"
        size="regular"
        variant="secondary"
        onClick={() => toast("Hi there!")}
      >
        default
      </Button>
      <Button
        className="w-fit"
        alignItems="center"
        size="regular"
        variant="secondary"
        onClick={() => toast("Changes saved!", { type: "success" })}
      >
        Success
      </Button>
      <Button
        className="w-fit"
        alignItems="center"
        size="regular"
        variant="secondary"
        onClick={() => toast("Something went wrong!", { type: "error" })}
      >
        Error
      </Button>
      <Button
        className="w-fit"
        alignItems="center"
        size="regular"
        variant="secondary"
        onClick={() =>
          toast(
            "Condition invalid condition matcher: arry_match. Must be one of: start_with, not_start_with, end_with, not_end_with, does_not_match, matches, multiple, eq, not_eq, lt, lteq, gt, gteq, blank, present, null, not_null, gt_lt, gteq_lt, gt_lteq, gteq_lteq, is_in, is_not_in, array_match. in the rule 50% promo EU.",
            { type: "error" },
          )
        }
      >
        Long message
      </Button>
    </div>
  )
}

/**
 * Overlays and modals open as modal `<dialog>`s, which put the rest of the page
 * under the top layer. Toasts raised while one is open still have to show up on
 * top of it, and stay visible once it closes.
 */
export const InsideOverlay: StoryFn = () => {
  const { Overlay, open, close } = useOverlay()

  return (
    <>
      <Button onClick={open}>Open overlay</Button>
      <Overlay
        footer={
          <div className="flex flex-col gap-2">
            <Button
              fullWidth
              variant="secondary"
              onClick={() => toast("Changes saved!", { type: "success" })}
            >
              Toast
            </Button>
            <Button
              fullWidth
              onClick={() => {
                toast("Changes saved!", { type: "success" })
                close()
              }}
            >
              Toast and close
            </Button>
          </div>
        }
      >
        <p>Toasts raised from here render above the overlay.</p>
      </Overlay>
    </>
  )
}

/**
 * A drawer with a modal opened on top of it: the toast follows the topmost
 * dialog, and moves back to the drawer when the modal closes.
 */
export const InsideDrawerAndModal: StoryFn = () => {
  const { Overlay, open, close } = useOverlay()
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Button onClick={open}>Open drawer</Button>
      <Overlay
        drawer
        onBackdropClick={close}
        contentClassName="p-6"
        footer={
          <div className="flex flex-col gap-2">
            <Button
              fullWidth
              variant="secondary"
              onClick={() => toast("Something went wrong!", { type: "error" })}
            >
              Toast
            </Button>
            <Button fullWidth onClick={() => setShowModal(true)}>
              Open modal
            </Button>
          </div>
        }
      >
        <p>Toasts raised from here render above the drawer.</p>
      </Overlay>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Modal on top of the drawer</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-2">
            <Button
              variant="secondary"
              onClick={() => toast("Changes saved!", { type: "success" })}
            >
              Toast
            </Button>
            <Button
              onClick={() => {
                toast("Changes saved!", { type: "success" })
                setShowModal(false)
              }}
            >
              Toast and close
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
