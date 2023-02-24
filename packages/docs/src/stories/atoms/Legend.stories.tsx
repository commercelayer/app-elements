import { A } from '#ui/atoms/A'
import { Legend } from '#ui/atoms/Legend'
import { ComponentMeta, ComponentStory } from '@storybook/react'

const setup: ComponentMeta<typeof Legend> = {
  title: 'Atoms/Legend',
  component: Legend,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof Legend> = (args) => (
  <Legend {...args} actionButton={<A>New export</A>} />
)

export const Default = Template.bind({})
Default.args = {
  title: 'All SKUs'
}
