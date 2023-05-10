import { A } from '#ui/atoms/A'
import { Legend } from '#ui/atoms/Legend'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Legend> = {
  title: 'Atoms/Legend',
  component: Legend,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof Legend> = (args) => <Legend {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'Addresses'
}

export const Small = Template.bind({})
Small.args = {
  title: 'All SKUs',
  titleSize: 'small',
  actionButton: <A> New export</A>
}
