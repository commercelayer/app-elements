import { InputCurrencyRange } from '#ui/forms/InputCurrencyRange'
import { type Meta, type StoryFn } from '@storybook/react-vite'

const setup: Meta<typeof InputCurrencyRange> = {
  title: 'Forms/ui/InputCurrencyRange',
  component: InputCurrencyRange,
  parameters: {
    layout: 'padded'
  }
}

export default setup

const Template: StoryFn<typeof InputCurrencyRange> = (args) => {
  return (
    <div style={{ paddingBottom: '12rem' }}>
      <InputCurrencyRange {...args} />
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Amount',
  currencyList: ['EUR', 'USD', 'HUF', 'JPY'],
  defaultCurrency: 'EUR',
  onChange: (from, to, currency) => {
    console.log({ from, to, currency })
  }
}
