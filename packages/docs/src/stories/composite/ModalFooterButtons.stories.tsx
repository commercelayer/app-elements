import type { Meta, StoryFn } from "@storybook/react-vite"
import { useState } from "react"
import { Button } from "#ui/atoms/Button"
import { Icon } from "#ui/atoms/Icon"
import { Modal } from "#ui/composite/Modal"
import {
  ModalFooterButtons,
  type ModalFooterButtonsProps,
} from "#ui/composite/ModalFooterButtons"

/**
 * Lays out the buttons of a `Modal.Footer`: bottom right, with an optional
 * action apart on the left. On very small viewports every button goes full
 * width and they stack, the primary one on top.
 */
const setup: Meta<typeof ModalFooterButtons> = {
  title: "Composite/ModalFooterButtons",
  component: ModalFooterButtons,
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    start: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    layout: "padded",
  },
}
export default setup

const Template: StoryFn<ModalFooterButtonsProps> = (args) => {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)

  return (
    <div>
      <Button onClick={() => setShow(true)}>Open modal</Button>
      <Modal size="medium" show={show} onClose={handleClose}>
        <Modal.Header>Edit address</Modal.Header>
        <Modal.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Modal.Body>
        <Modal.Footer>
          <ModalFooterButtons {...args}>
            <Button
              variant="secondary"
              type="button"
              size="small"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button size="small" onClick={handleClose}>
              Update address
            </Button>
          </ModalFooterButtons>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

/**
 * Cancel and submit, bottom right.
 */
export const Default = Template.bind({})
Default.args = {}

/**
 * With an action apart, bottom left.
 */
export const WithStartAction = Template.bind({})
WithStartAction.args = {
  start: (
    <Button variant="secondary" type="button" size="small" alignItems="center">
      <Icon name="plus" /> Add another
    </Button>
  ),
}
