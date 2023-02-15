import { InputFeedback } from '#core-app-elements/forms/InputFeedback'
import { ComponentStory, ComponentMeta } from '@storybook/react'

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
