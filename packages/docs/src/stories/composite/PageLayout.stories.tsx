import { PageLayout } from '#ui/composite/PageLayout'

import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof PageLayout> = {
  title: 'Composite/PageLayout',
  component: PageLayout,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof PageLayout> = (args) => (
  <PageLayout {...args}>Page content here...</PageLayout>
)

export const Default = Template.bind({})
Default.args = {
  title: 'Resources',
  description: 'View all resources',
  navigationButton: {
    label: 'Back to dashboard',
    onClick: () => undefined
  },
  mode: 'test'
}

export const WithToolbar = Template.bind({})
WithToolbar.args = {
  title: 'Resources',
  description: 'View all resources',
  navigationButton: {
    label: 'Close',
    onClick: () => undefined,
    icon: 'x'
  },
  mode: 'live',
  toolbar: {
    buttons: [
      {
        label: 'Add new',
        icon: 'plus',
        size: 'small',
        onClick: () => {
          alert('Add new clicked!')
        }
      },
      {
        label: 'Secondary',
        icon: 'pulse',
        variant: 'secondary',
        size: 'small',
        onClick: () => {
          alert('Secondary clicked!')
        }
      }
    ],
    dropdownItems: [
      [
        {
          label: 'Edit',
          onClick: () => {
            alert('Edit clicked!')
          }
        },
        {
          label: 'Set metadata',
          onClick: () => {
            alert('Set metadata clicked!')
          }
        }
      ],
      [
        {
          label: 'Delete',
          onClick: () => {
            alert('Delete clicked!')
          }
        }
      ]
    ]
  }
}

export const MobileWidthWithLongTitle = Template.bind({})
MobileWidthWithLongTitle.args = {
  title: 'welcome@commercelayer.io',
  description: 'This long title should break thanks to `break-words` className',
  navigationButton: {
    label: 'Close',
    onClick: () => undefined,
    icon: 'x'
  },
  mode: 'live',
  toolbar: {
    buttons: [
      {
        label: 'Edit',
        size: 'small'
      }
    ]
  }
}
MobileWidthWithLongTitle.decorators = [
  (Story) => (
    <div
      style={{
        maxWidth: '320px'
      }}
    >
      <Story />
    </div>
  )
]
