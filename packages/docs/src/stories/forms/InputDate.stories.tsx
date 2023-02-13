import { InputDate } from '#core-app-elements/forms/InputDate'
import { Container } from '#core-app-elements/atoms/Container'
import { ComponentStory, ComponentMeta } from '@storybook/react'
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
  return (
    <Container minHeight={false}>
      <InputDate {...args} value={date} onChange={setDate} />
    </Container>
  )
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
