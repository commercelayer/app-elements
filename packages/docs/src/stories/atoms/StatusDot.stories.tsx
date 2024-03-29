import { StatusDot } from '#ui/atoms/StatusDot'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof StatusDot> = {
  title: 'Atoms/StatusDot',
  component: StatusDot
}
export default setup

const Template: StoryFn<typeof StatusDot> = (args) => <StatusDot {...args} />

export const Default = Template.bind({})
Default.args = {
  variant: 'success'
}
