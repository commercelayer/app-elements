import { Input } from '#ui/forms/Input'
import { type Meta, type StoryFn } from '@storybook/react'
import { useState } from 'react'

const setup: Meta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof Input> = (args) => {
  return <Input {...args} value={args.value} type={args.type} />
}

export const Default = Template.bind({})
Default.args = {
  value: 'I love Commerce Layer',
  type: 'text'
}

export const WithLabel = Template.bind({})
WithLabel.args = {
  label: 'Your name',
  name: 'fullname'
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

const TemplateValidation: StoryFn<typeof Input> = () => {
  const [value, setValue] = useState('')

  return (
    <Input
      value={value}
      onChange={(e) => {
        setValue(e.currentTarget.value)
      }}
      hint={{
        text: `try to type 'error', 'success' or 'warning'`
      }}
      feedback={
        value === 'error'
          ? {
              variant: 'danger',
              message: 'Required field'
            }
          : value === 'success'
          ? {
              variant: 'success',
              message: 'All good'
            }
          : value === 'warning'
          ? {
              variant: 'warning',
              message: 'Check something'
            }
          : undefined
      }
    />
  )
}
export const ValidationSample = TemplateValidation.bind({})
