import { currencies, type CurrencyCode } from '#helpers/currencies'
import { Text } from '#ui/atoms/Text'
import { formatCentsToCurrency } from '#ui/forms/InputCurrency'
import { Description, Stories, Subtitle, Title } from '@storybook/addon-docs'
import { type Meta, type StoryFn } from '@storybook/react'
import { CodeSample } from 'src/components/CodeSample'

/** This list of `currency` utilities help to format the currency in a standard and conventional way. */
const setup: Meta = {
  title: 'Utility/Currency',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        code: null
      },
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Stories />
        </>
      )
    }
  },
  argTypes: {
    children: {
      table: {
        disable: true
      }
    }
  }
}
export default setup

/**
 * ```js
 * import { currencies } from '@commercelayer/app-elements'
 * ```
 */

/** You can get the full list of supported currencies by importing `currencies`. */
export const Currencies: StoryFn = () => {
  const currencyCodes = Object.values(currencies).map((c) => c.iso_code)
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
        gridAutoFlow: 'row',
        gap: '1rem'
      }}
    >
      {currencyCodes.map((code) => (
        <div
          key={code}
          className='flex flex-row gap-2 items-center align-middle'
        >
          <Text size='small' variant='info'>
            {code}
          </Text>
        </div>
      ))}
    </div>
  )
}

/**
 * ```js
 * import type { CurrencyCode } from '@commercelayer/app-elements'
 * ```
 */
export const CurrencyCodeType: StoryFn = () => {
  return (
    <>
      <CodeSample
        code={`
          const currencyCode: CurrencyCode = 'USD';

          return currencyCode;
        `}
        fn={() => {
          // This is to avoid name mangling.
          // eslint-disable-next-line no-eval
          eval('')

          const currencyCode: CurrencyCode = 'USD'

          return currencyCode
        }}
      />
    </>
  )
}

/**
 * Format cents to currency.
 * Useful to display the returned value from `<InputCurrency>` component.
 */
export const FormatCentsToCurrency: StoryFn = () => {
  return (
    <>
      <CodeSample
        fn={() => {
          return formatCentsToCurrency(10250, 'EUR')
        }}
      />
      <CodeSample
        fn={() => {
          return formatCentsToCurrency(10250, 'USD')
        }}
      />
      <CodeSample
        fn={() => {
          return formatCentsToCurrency(10250, 'JPY')
        }}
      />
    </>
  )
}
