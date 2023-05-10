import { Icon } from '#ui/atoms/Icon'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof Icon> = (args) => <Icon {...args} />

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
