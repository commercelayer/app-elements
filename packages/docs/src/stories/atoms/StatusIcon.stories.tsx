import { StatusIcon } from '#ui/atoms/StatusIcon'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof StatusIcon> = {
  title: 'Atoms/StatusIcon',
  component: StatusIcon,
  argTypes: {
    percentage: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      if: { arg: 'status', eq: 'progress' }
    }
  }
}
export default setup

const Template: ComponentStory<typeof StatusIcon> = (args) => (
  <StatusIcon
    {...args}
    percentage={
      args.status === 'progress' && args.percentage == null
        ? 50
        : args.percentage
    }
  />
)

export const Success = Template.bind({})
Success.args = {
  status: 'success'
}

export const Progress = Template.bind({})
Progress.args = {
  status: 'progress',
  percentage: 50
}
