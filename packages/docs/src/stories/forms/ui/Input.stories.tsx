import { Icon } from '#ui/atoms/Icon'
import { Input } from '#ui/forms/Input'
import { type Meta, type StoryFn } from '@storybook/react-vite'
import { useState } from 'react'

const setup: Meta<typeof Input> = {
  title: 'Forms/ui/Input',
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
  label: 'Message',
  name: 'message',
  defaultValue: 'I love Commerce Layer',
  type: 'text'
}

export const WithLabel = Template.bind({})
WithLabel.args = {
  label: 'Your name',
  name: 'fullname'
}

export const WithSuffix = Template.bind({})
WithSuffix.args = {
  type: 'number',
  label: 'Percentage',
  name: 'percentage',
  suffix: '%'
}

export const WithActionSuffix = Template.bind({})
WithActionSuffix.args = {
  type: 'number',
  label: 'Weight',
  name: 'weight',
  suffix: (
    <Icon
      name='arrowClockwise'
      style={{ cursor: 'pointer' }}
      size={22}
      onClick={() => {
        alert('Refresh')
      }}
    />
  )
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

export const Email = Template.bind({})
Email.args = {
  label: 'Email',
  name: 'email',
  defaultValue: '',
  autoComplete: 'off',
  type: 'email'
}

export const Password = Template.bind({})
Password.args = {
  label: 'Password',
  name: 'password',
  defaultValue: '',
  autoComplete: 'off',
  type: 'password'
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
