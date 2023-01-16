import Container from '#core-app-elements/atoms/Container'
import A from '#core-app-elements/atoms/A'
import PageHeading from '#core-app-elements/atoms/PageHeading'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof PageHeading> = {
  title: 'Atoms/PageHeading',
  component: PageHeading,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof PageHeading> = (args) => (
  <Container>
    <PageHeading {...args} actionButton={<A>Edit</A>} />
  </Container>
)

export const Default = Template.bind({})
Default.args = {
  title: 'Resources',
  description: 'Lorem ipsum dolor sit'
}

export const WithGoBack = Template.bind({})
WithGoBack.args = {
  title: 'SKUs',
  description: 'Lorem ipsum dolor sit',
  onGoBack: () => historyGoBack()
}

export const WithBadge = Template.bind({})
WithBadge.args = {
  title: 'SKUs',
  badgeLabel: 'TEST DATA',
  onGoBack: () => historyGoBack()
}

function historyGoBack(): undefined {
  return undefined
}
