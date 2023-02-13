import { A } from '#core-app-elements/atoms/A'
import { PageLayout } from '#core-app-elements/composite/PageLayout'
import { Container } from '#core-app-elements/atoms/Container'

import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof PageLayout> = {
  title: 'Composite/PageLayout',
  component: PageLayout,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof PageLayout> = (args) => (
  <Container>
    <PageLayout {...args}>Page content here...</PageLayout>
  </Container>
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
