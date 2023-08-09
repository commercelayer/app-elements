import { RadialProgress } from '#ui/atoms/RadialProgress'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof RadialProgress> = {
  title: 'Atoms/RadialProgress',
  component: RadialProgress,
  argTypes: {
    percentage: {
      control: { type: 'range', min: 0, max: 100, step: 1 }
    }
  }
}
export default setup

const Template: StoryFn<typeof RadialProgress> = (args) => (
  <RadialProgress {...args} />
)

export const Pending = Template.bind({})
Pending.args = {}

export const Percentage = Template.bind({})
Percentage.args = {
  percentage: 42
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  percentage: undefined,
  icon: 'shoppingBag'
}

export const PendingSmall = Template.bind({})
PendingSmall.args = {
  percentage: undefined,
  size: 'small'
}
