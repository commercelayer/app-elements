import { Badge } from '#core-app-elements/atoms/Badge'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge
}
export default setup

const Template: ComponentStory<typeof Badge> = (args) => <Badge {...args} />

export const Primary = Template.bind({})
Primary.args = {
  variant: 'success',
  label: 'completed'
}

export const Warning = Template.bind({})
Warning.args = {
  variant: 'warning',
  label: 'TEST DATA'
}
export const WarningSolid = Template.bind({})
WarningSolid.args = {
  variant: 'warning-solid',
  label: 'TEST DATA'
}
