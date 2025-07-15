import type { Meta, StoryFn } from "@storybook/react-vite"
import { InputCurrency } from "#ui/forms/InputCurrency"

const setup: Meta<typeof InputCurrency> = {
  title: "Forms/ui/InputCurrency",
  component: InputCurrency,
  parameters: {
    layout: "padded",
  },
}
export default setup

const Template: StoryFn<typeof InputCurrency> = (args) => {
  return <InputCurrency {...args} />
}

export const EUR = Template.bind({})
EUR.args = {
  label: "Enter an amount",
  name: "input-eur",
  currencyCode: "EUR",
}

export const USD = Template.bind({})
USD.args = {
  label: "Enter an amount",
  name: "input-eur",
  currencyCode: "USD",
}

export const NoDecimals = Template.bind({})
NoDecimals.args = {
  name: "input-jpy",
  currencyCode: "JPY",
  cents: 1000,
}

export const WithError = Template.bind({})
WithError.args = {
  label: "Your name",
  name: "input-error",
  currencyCode: "GBP",
  placeholder: "Enter an amount",
  feedback: {
    variant: "danger",
    message: "Required field",
  },
}

export const ForcePositiveValue = Template.bind({})
ForcePositiveValue.args = {
  name: "input-force-positive-value",
  currencyCode: "USD",
  sign: "+",
}

export const PositiveAndNegativeValues = Template.bind({})
PositiveAndNegativeValues.args = {
  name: "input-positive-and-negative-values",
  currencyCode: "USD",
  sign: "+-",
}

export const NegativeAndPositiveValues = Template.bind({})
NegativeAndPositiveValues.args = {
  name: "input-negative-and-positive-values",
  currencyCode: "USD",
  sign: "-+",
}

export const ForceNegativeValue = Template.bind({})
ForceNegativeValue.args = {
  name: "input-force-negative-value",
  currencyCode: "USD",
  sign: "-",
}
