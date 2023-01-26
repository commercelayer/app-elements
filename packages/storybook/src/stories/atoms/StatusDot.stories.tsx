import { StatusDot } from '#core-app-elements/atoms/StatusDot'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof StatusDot> = {
  title: 'Atoms/StatusDot',
  component: StatusDot
}
export default setup

const Template: ComponentStory<typeof StatusDot> = (args) => (
  <StatusDot {...args} />
)

export const Default = Template.bind({})
Default.args = {
  variant: 'success'
}
