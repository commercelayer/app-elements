import { InputDateRange } from '#ui/forms/InputDateRange'
import { Container } from '#ui/atoms/Container'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { useState } from 'react'

const setup: ComponentMeta<typeof InputDateRange> = {
  title: 'Forms/InputDateRange',
  component: InputDateRange,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof InputDateRange> = (args) => {
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)

  return (
    <Container minHeight={false}>
      <InputDateRange
        {...args}
        value={[fromDate, toDate]}
        onChange={([from, to]) => {
          setFromDate(from)
          setToDate(to)
        }}
      />
    </Container>
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
