import InputDateRange from '#core-app-elements/forms/InputDateRange'
import Container from '#core-app-elements/atoms/Container'
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
        fromDate={fromDate}
        toDate={toDate}
        onFromChange={setFromDate}
        onToChange={setToDate}
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
