import { InputDateRange } from '#ui/forms/InputDateRange'
import { type Meta, type StoryFn } from '@storybook/react'
import { useState } from 'react'

const setup: Meta<typeof InputDateRange> = {
  title: 'Forms/InputDateRange',
  component: InputDateRange,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof InputDateRange> = (args) => {
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)

  return (
    <InputDateRange
      {...args}
      value={[fromDate, toDate]}
      onChange={([from, to]) => {
        setFromDate(from)
        setToDate(to)
      }}
    />
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Date range',
  fromPlaceholder: 'Start date...',
  toPlaceholder: 'End date...'
}

export const WithHint = Template.bind({})
WithHint.args = {
  label: 'Date range',
  fromPlaceholder: 'Start date...',
  hint: { text: 'Please enter a valid date range' }
}
