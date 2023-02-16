import { Input } from '#ui/forms/Input'
import { Container } from '#ui/atoms/Container'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { useState } from 'react'

const setup: ComponentMeta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof Input> = (args) => {
  return (
    <Container minHeight={false}>
      <Input {...args} value={args.value} type={args.type} />
    </Container>
  )
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

const TemplateValidation: ComponentStory<typeof Input> = () => {
  const [value, setValue] = useState('')

  return (
    <Container minHeight={false}>
      <Input
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
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
    </Container>
  )
}
export const ValidationSample = TemplateValidation.bind({})
