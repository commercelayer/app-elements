import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/forms/Form'
import { HookedMarketWithCurrencySelector } from '#ui/forms/MarketWithCurrencySelector'
import { type Meta, type StoryFn } from '@storybook/react-vite'
import { useForm } from 'react-hook-form'

const setup: Meta<typeof HookedMarketWithCurrencySelector> = {
  title: 'Forms/react-hook-form/HookedMarketWithCurrencySelector',
  component: HookedMarketWithCurrencySelector,
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        type: 'code'
      }
    }
  },
  decorators: [
    (Story) => (
      <div
        style={{
          paddingBottom: '160px'
        }}
      >
        <Story />
      </div>
    )
  ]
}
export default setup

const Template: StoryFn<typeof HookedMarketWithCurrencySelector> = (args) => {
  const methods = useForm({
    defaultValues: {
      market: '',
      currency_code: 'EUR'
    }
  })

  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <HookedForm
          {...methods}
          onSubmit={(values) => {
            alert(JSON.stringify(values))
          }}
        >
          <HookedMarketWithCurrencySelector {...args} />
          <Spacer top='4'>
            <Button type='submit'>Submit</Button>
          </Spacer>
        </HookedForm>
      </CoreSdkProvider>
    </TokenProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Market *',
  fieldNameMarket: 'market',
  fieldNameCurrencyCode: 'currency_code',
  hint: {
    text: 'Choose a market or all markets with a specific currency'
  }
}

export const WithDefaultValues: StoryFn<
  typeof HookedMarketWithCurrencySelector
> = (args) => {
  const methods = useForm({
    defaultValues: {
      market: 'EjDkXhNEoD',
      currency_code: 'USD'
    }
  })

  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <HookedForm
          {...methods}
          onSubmit={(values) => {
            alert(JSON.stringify(values))
          }}
        >
          <HookedMarketWithCurrencySelector {...args} />
          <Spacer top='4'>
            <Button type='submit'>Submit</Button>
          </Spacer>
        </HookedForm>
      </CoreSdkProvider>
    </TokenProvider>
  )
}
WithDefaultValues.args = {
  label: 'Market *',
  fieldNameMarket: 'market',
  fieldNameCurrencyCode: 'currency_code',
  hint: {
    text: 'Choose a market or all markets with a specific currency'
  }
}
