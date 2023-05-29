import { Button } from '#ui/atoms/Button'
import { Overlay } from '#ui/atoms/Overlay'
import { type Meta, type StoryFn } from '@storybook/react'
import { useState } from 'react'

const setup: Meta<typeof Overlay> = {
  title: 'Atoms/Overlay',
  component: Overlay,
  parameters: {
    // previewTabs: { canvas: { hidden: true } }
    docs: {
      source: {
        code: `
<Overlay
  button={{
    label: 'Apply',
    onClick: () => {}
  }}
>
  <div>Overlay content</div>
</Overlay>`
      }
    }
  }
}
export default setup

const Template: StoryFn<typeof Overlay> = (args) => {
  const [show, setShow] = useState(false)
  return (
    <div>
      <Button
        onClick={() => {
          setShow(true)
        }}
      >
        click to open
      </Button>

      {show && (
        <Overlay {...args}>
          <Button
            onClick={() => {
              setShow(false)
            }}
          >
            click to close
          </Button>
          <div>{args.children}</div>
        </Overlay>
      )}
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {
  children: 'Overlay content',
  button: {
    label: 'Apply',
    onClick: () => {
      alert('apply clicked')
    }
  }
}
