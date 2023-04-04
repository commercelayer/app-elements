import { InputFeedback } from '#ui/forms/InputFeedback'
import { type ComponentStory, type ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof InputFeedback> = {
  title: 'Forms/InputFeedback',
  component: InputFeedback
}
export default setup

const Template: ComponentStory<typeof InputFeedback> = (args) => (
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
