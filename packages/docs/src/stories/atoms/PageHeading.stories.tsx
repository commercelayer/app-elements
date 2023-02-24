import { A } from '#ui/atoms/A'
import { PageHeading } from '#ui/atoms/PageHeading'
import { ComponentMeta, ComponentStory } from '@storybook/react'

const setup: ComponentMeta<typeof PageHeading> = {
  title: 'Atoms/PageHeading',
  component: PageHeading,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof PageHeading> = (args) => (
  <PageHeading {...args} actionButton={<A>Edit</A>} />
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
