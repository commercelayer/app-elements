import { InputDate } from '#ui/forms/InputDate'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'

const setup: ComponentMeta<typeof InputDate> = {
  title: 'Forms/InputDate',
  component: InputDate,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof InputDate> = (args) => {
  const [date, setDate] = useState<Date | null>(null)
  return <InputDate {...args} value={date} onChange={setDate} />
}

export const Default = Template.bind({})
Default.args = {
  label: 'Shipping date'
}

export const WithMinValue = Template.bind({})
WithMinValue.args = {
  placeholder: 'select a future date',
  minDate: new Date()
}

export const AutoPlaceholder = Template.bind({})
AutoPlaceholder.args = {
  autoPlaceholder: true
}

export const WithHint = Template.bind({})
WithHint.args = {
  label: 'Shipping date',
  hint: { text: 'Please enter a valid date ' }
}

export const WithError = Template.bind({})
WithError.args = {
  label: 'Your name',
  feedback: {
    variant: 'danger',
    message: 'Required field'
  }
}
