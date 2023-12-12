import { Button } from '#ui/atoms/Button'
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

export const WithActionButton = Template.bind({})
WithActionButton.args = {
  title: 'Resources',
  description: 'View all resources',
  navigationButton: {
    label: 'Close',
    onClick: () => undefined,
    icon: 'x'
  },
  mode: 'live',
  actionButton: <Button variant='link'>Add new</Button>
}
