import { Grid } from '#ui/atoms/Grid'
import { InputDate } from '#ui/forms/InputDate'
import { type Meta, type StoryFn } from '@storybook/react'
import { useState } from 'react'

const setup: Meta<typeof InputDate> = {
  title: 'Forms/ui/InputDate',
  component: InputDate,
  parameters: {
    layout: 'padded'
  },
  decorators: [
    (Story) => (
      <div
        style={{
          paddingBottom: '300px'
        }}
      >
        <Story />
      </div>
    )
  ]
}
export default setup

const Template: StoryFn<typeof InputDate> = (args) => {
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
  minDate: new Date(),
  showTimeSelect: true
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

export const WithTimeSelect = Template.bind({})
WithTimeSelect.args = {
  label: 'Starts on',
  showTimeSelect: true
}

export const With2TimeSelects: StoryFn<typeof InputDate> = (args) => {
  const [startsOn, setStartsOn] = useState<Date | null>(null)
  const [expiresOn, setExpiresOn] = useState<Date | null>(null)
  return (
    <Grid columns='2'>
      <InputDate
        value={startsOn}
        onChange={setStartsOn}
        label='Starts on'
        showTimeSelect
      />
      <InputDate
        value={expiresOn}
        onChange={setExpiresOn}
        label='Expires on'
        showTimeSelect
      />
    </Grid>
  )
}

export const WithError = Template.bind({})
WithError.args = {
  label: 'Your name',
  feedback: {
    variant: 'danger',
    message: 'Required field'
  }
}
