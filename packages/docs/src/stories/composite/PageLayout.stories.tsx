import { A } from '#ui/atoms/A'
import { PageLayout } from '#ui/composite/PageLayout'

import { type ComponentMeta, type ComponentStory } from '@storybook/react'

const setup: ComponentMeta<typeof PageLayout> = {
  title: 'Composite/PageLayout',
  component: PageLayout,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof PageLayout> = (args) => (
  <PageLayout {...args}>Page content here...</PageLayout>
)

export const Default = Template.bind({})
Default.args = {
  title: 'Resources',
  description: 'View all resources',
  onGoBack: () => undefined,
  mode: 'test'
}

export const WithActionButton = Template.bind({})
WithActionButton.args = {
  title: 'Resources',
  description: 'View all resources',
  onGoBack: () => undefined,
  mode: 'live',
  actionButton: <A>Add new</A>
}
