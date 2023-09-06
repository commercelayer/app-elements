import { InputTextArea } from '#ui/forms/InputTextArea'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof InputTextArea> = {
  title: 'Forms/ui/InputTextArea',
  component: InputTextArea,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof InputTextArea> = (args) => {
  return <InputTextArea {...args} value={args.value} />
}

export const Default = Template.bind({})
Default.args = {
  label: 'Your name',
  name: 'fullname',
  value: 'I love Commerce Layer'
}

export const WithHint = Template.bind({})
WithHint.args = {
  label: 'Your name',
  hint: {
    text: 'Please enter a valid name'
  }
}

export const WithError = Template.bind({})
WithError.args = {
  label: 'Your name',
  feedback: {
    variant: 'danger',
    message: 'Required field'
  }
}
