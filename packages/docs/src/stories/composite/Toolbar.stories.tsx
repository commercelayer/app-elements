import { Toolbar } from '#ui/composite/Toolbar'
import { type Meta, type StoryFn } from '@storybook/react-vite'

const setup: Meta<typeof Toolbar> = {
  title: 'Composite/Toolbar',
  component: Toolbar,
  parameters: {
    layout: 'padded'
  }
}
export default setup

export const Simple: StoryFn<typeof Toolbar> = (args) => <Toolbar {...args} />
Simple.args = {
  items: [
    {
      label: 'Primary',
      size: 'small',
      onClick: () => {
        console.log('Primary')
      }
    },
    {
      label: 'Secondary',
      icon: 'pulse',
      variant: 'secondary',
      size: 'small',
      onClick: () => {
        console.log('Secondary')
      }
    },
    {
      label: 'Disabled',
      icon: 'pulse',
      variant: 'secondary',
      size: 'small',
      disabled: true,
      onClick: () => {
        console.log('Cannot click me')
      }
    },
    {
      icon: 'dotsThree',
      size: 'small',
      variant: 'secondary',
      dropdownItems: [
        [
          {
            label: 'Edit',
            onClick: () => {
              console.log('Edit')
            }
          },
          {
            label: 'Set metadata',
            onClick: () => {
              console.log('Set metadata')
            }
          },
          {
            label: 'Disabled item',
            disabled: true,
            onClick: () => {
              console.log('Cannot click me')
            }
          }
        ],
        [
          {
            label: 'Delete',
            onClick: () => {
              console.log('Delete')
            }
          }
        ]
      ]
    }
  ]
}
Simple.decorators = [
  (Story) => (
    <div
      style={{
        paddingBottom: '120px'
      }}
    >
      <Story />
    </div>
  )
]
