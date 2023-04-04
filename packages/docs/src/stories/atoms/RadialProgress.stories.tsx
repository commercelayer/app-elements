import { RadialProgress } from '#ui/atoms/RadialProgress'
import { type ComponentStory, type ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof RadialProgress> = {
  title: 'Atoms/RadialProgress',
  component: RadialProgress,
  argTypes: {
    percentage: {
      control: { type: 'range', min: 0, max: 100, step: 1 }
    }
  }
}
export default setup

const Template: ComponentStory<typeof RadialProgress> = (args) => (
  <RadialProgress {...args} />
)

export const Default = Template.bind({})
Default.args = {
  percentage: 45
}

export const Pending = Template.bind({})
Pending.args = {
  percentage: undefined
}
