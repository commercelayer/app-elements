import { Icon } from '#ui/atoms/Icon'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon
}
export default setup

const Template: ComponentStory<typeof Icon> = (args) => <Icon {...args} />

export const Default = Template.bind({})
Default.args = {
  name: 'check'
}

export const OrderWaiting = Template.bind({})
OrderWaiting.args = {
  name: 'arrowDown',
  background: 'orange',
  gap: 'large',
  title: 'Waiting approval'
}

export const FilterView = Template.bind({})
FilterView.args = {
  name: 'eye',
  background: 'teal',
  gap: 'small'
}

export const CustomSize = Template.bind({})
CustomSize.args = {
  name: 'arrowClockwise',
  background: 'none',
  size: '5rem'
}
