import {
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from "@storybook/addon-docs/blocks"
import type { Meta, StoryFn } from "@storybook/react-vite"
import { useRef, useState } from "react"
import { Button } from "#ui/atoms/Button"
import { Icon } from "#ui/atoms/Icon"
import { Spacer } from "#ui/atoms/Spacer"
import { StatusIcon } from "#ui/atoms/StatusIcon"
import { Text } from "#ui/atoms/Text"
import { Modal } from "#ui/composite/Modal"
import { InputDateRange } from "#ui/forms/InputDateRange"
import { InputSelect } from "#ui/forms/InputSelect"

/**
 * Modal component with a header, body, and footer.
 */
const setup: Meta = {
  title: "Composite/Modal",
  args: {},
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Stories includePrimary={false} />
        </>
      ),
      source: {
        type: "code",
      },
    },
  },
}
export default setup

/**
 * Modal with a short content. Header shows the provided title.
 */
export const Default: StoryFn = () => {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <div>
      <Button onClick={handleShow}>Open modal</Button>
      <Modal show={show} onClose={handleClose}>
        <Modal.Header>Modal title</Modal.Header>
        <Modal.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Modal.Body>
      </Modal>
    </div>
  )
}

/**
 * Modal with a long, scrollable content.
 */
export const LongContent: StoryFn = () => {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <div>
      <Button onClick={handleShow}>Open modal</Button>
      <Modal size="large" show={show} onClose={handleClose}>
        <Modal.Header>Modal title</Modal.Header>
        <Modal.Body>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            fringilla, leo vel blandit consequat, arcu tellus tristique ipsum,
            vel accumsan risus urna in ante. Morbi iaculis elit mattis dolor
            laoreet rhoncus. Aliquam interdum vel dui nec dapibus. Praesent id
            justo ultricies quam finibus sollicitudin eu nec magna.
          </p>
          <br />
          <p>
            Maecenas euismod lectus at eros hendrerit tincidunt. Nam malesuada
            commodo arcu at ultrices. Praesent dictum lectus erat, sed vulputate
            leo gravida sit amet. Nam ut nunc sed lacus viverra bibendum quis a
            est. Sed enim est, consectetur eget tempus eget, venenatis ac sem.
          </p>
          <br />
          <p>
            Sed efficitur, ante mollis porttitor viverra, purus orci accumsan
            erat, in mattis enim justo ultrices mi. Morbi porttitor lectus
            metus. Nunc blandit sit amet libero nec tristique. Curabitur feugiat
            malesuada tellus, eget tristique nibh molestie a. Praesent risus
            odio, sodales non porta et, pretium nec tortor.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} fullWidth>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

/**
 * Modal with an input select.
 */
export const WithInput: StoryFn = () => {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <div>
      <Button onClick={handleShow}>Open modal</Button>
      <Modal size="large" show={show} onClose={handleClose}>
        <Modal.Header>Choose an option</Modal.Header>
        <Modal.Body>
          <InputSelect
            menuPortalTarget={document.body}
            isCreatable
            initialValues={[
              {
                label: "Option 1",
                value: "option1",
              },
              {
                label: "Option 2",
                value: "option2",
              },
              {
                label: "Option 3",
                value: "option3",
              },
              {
                label: "Option 4",
                value: "option4",
              },
            ]}
            onSelect={() => {}}
            placeholder="Select an option"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              alert("Saved!")
              handleClose()
            }}
            fullWidth
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

/**
 * Modal with an input select.
 */
export const WithDatePicker: StoryFn = () => {
  const [show, setShow] = useState(false)
  const modal = useRef<HTMLDivElement | null>(null)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <div>
      <Button onClick={handleShow}>Open modal</Button>
      <Modal ref={modal} size="small" show={show} onClose={handleClose}>
        <Modal.Header>Select dates</Modal.Header>
        <Modal.Body>
          <InputDateRange
            fromLabel="From"
            toLabel="To"
            value={[null, null]}
            onChange={() => {}}
            stacked
            fixedPopper
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              alert("Saved!")
              handleClose()
            }}
            fullWidth
          >
            Apply
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

/**
 * Modal as dialog without header
 */
export const AsDialog: StoryFn = () => {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <div>
      <Button onClick={handleShow}>Open modal</Button>
      <Modal show={show} onClose={handleClose} size="x-small">
        <Modal.Body>
          <Spacer bottom="4">
            <StatusIcon
              name="check"
              background="green"
              gap="x-large"
              align="center"
            />
          </Spacer>
          <Text weight="semibold" align="center" tag="div">
            Your coupons are ready.
          </Text>
          <Spacer top="1">
            <Text align="center" tag="div" size="small" variant="info">
              Download now or find them later in Imports.
            </Text>
          </Spacer>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              alert("Downloaded!")
              handleClose()
            }}
            fullWidth
            alignItems="center"
          >
            <Icon name="fileArrowDown" />
            Download (CSV)
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              handleClose()
            }}
            fullWidth
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
