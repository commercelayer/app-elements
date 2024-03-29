import { InputFeedback } from '#ui/forms/InputFeedback'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof InputFeedback> = {
  title: 'Forms/ui/InputFeedback',
  component: InputFeedback
}
export default setup

const Template: StoryFn<typeof InputFeedback> = (args) => (
  <InputFeedback {...args} />
)

export const Default = Template.bind({})
Default.args = {
  message: `Name can't be blank`
}

export const Success = Template.bind({})
Success.args = {
  variant: 'success',
  message: `Valid data found`
}

export const Warning = Template.bind({})
Warning.args = {
  variant: 'warning',
  message: `Please check your app configuration`
}
