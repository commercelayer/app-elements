import { InputCurrency } from '#ui/forms/InputCurrency'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof InputCurrency> = {
  title: 'Forms/ui/InputCurrency',
  component: InputCurrency,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof InputCurrency> = (args) => {
  return <InputCurrency {...args} />
}

export const EUR = Template.bind({})
EUR.args = {
  label: 'Enter an amount',
  name: 'input-eur',
  currencyCode: 'EUR'
}

export const USD = Template.bind({})
USD.args = {
  label: 'Enter an amount',
  name: 'input-eur',
  currencyCode: 'USD'
}

export const NoDecimals = Template.bind({})
NoDecimals.args = {
  name: 'input-jpy',
  currencyCode: 'JPY',
  cents: 1000
}

export const WithError = Template.bind({})
WithError.args = {
  label: 'Your name',
  name: 'input-error',
  currencyCode: 'GBP',
  placeholder: 'Enter an amount',
  feedback: {
    variant: 'danger',
    message: 'Required field'
  }
}
