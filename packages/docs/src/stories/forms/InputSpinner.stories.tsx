import { InputSpinner } from '#ui/forms/InputSpinner'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof InputSpinner> = {
  title: 'Forms/InputSpinner',
  component: InputSpinner,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof InputSpinner> = (args) => {
  return <InputSpinner {...args} />
}

export const DefaultMinMax = Template.bind({})
DefaultMinMax.args = {
  label: 'Quantity',
  defaultValue: 3,
  min: 1,
  max: 12
}

export const WithHint = Template.bind({})
WithHint.args = {
  hint: {
    text: 'Please enter a quantity'
  }
}

export const WithError = Template.bind({})
WithError.args = {
  label: 'Number of items',
  feedback: {
    variant: 'danger',
    message: 'Required field'
  }
}
