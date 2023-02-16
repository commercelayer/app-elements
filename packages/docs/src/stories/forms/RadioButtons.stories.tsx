import { RadioButtons, RadioOptionValue } from '#ui/forms/RadioButtons'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { useState } from 'react'

const setup: ComponentMeta<typeof RadioButtons> = {
  title: 'Forms/RadioButtons',
  component: RadioButtons
}
export default setup

const Template: ComponentStory<typeof RadioButtons> = (args) => {
  const [value, setValue] = useState<RadioOptionValue>()

  return (
    <RadioButtons
      {...args}
      value={value}
      onChange={(value) => {
        setValue(value)
      }}
    />
  )
}

export const Default = Template.bind({})
Default.args = {
  id: 'radio-sample',
  options: [
    { label: 'Red', value: '#ff0000' },
    { label: 'Yellow', value: '#ffff00' },
    { label: 'Blue', value: '#0000ff' }
  ]
}

export const Boolean = Template.bind({})
Boolean.args = {
  id: 'radio-boolean',
  options: [
    { label: 'Shippable', value: true },
    { label: 'Not Shippable', value: false }
  ]
}

export const WithHint = Template.bind({})
WithHint.args = {
  label: 'Select Options',
  id: 'radio-boolean',
  options: [
    { label: 'Shippable', value: true },
    { label: 'Not Shippable', value: false }
  ],
  hint: {
    text: 'Please enter a valid name'
  }
}

export const WithError = Template.bind({})
WithError.args = {
  label: 'Select Options',
  id: 'radio-boolean',
  options: [
    { label: 'Shippable', value: true },
    { label: 'Not Shippable', value: false }
  ],
  feedback: {
    variant: 'danger',
    message: 'Required field'
  }
}
