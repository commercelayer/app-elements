import { Toolbar } from '#ui/composite/Toolbar'
import { type Meta, type StoryFn } from '@storybook/react'

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
  actions: [
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
