import { type CurrencyCode } from '#helpers/currencies'
import { formatCentsToCurrency } from '#ui/forms/InputCurrency'
import { type CodeSampleProps } from 'src/components/CodeSample'

export const currencyCodeTypeExamples: CodeSampleProps[] = [
  {
    fn: () => {
      // This is to avoid name mangling.
      // eslint-disable-next-line no-eval
      eval('')

      const currencyCode: CurrencyCode = 'USD'

      return currencyCode
    },
    code: `
      const currencyCode: CurrencyCode = 'USD';

      return currencyCode;
    `
  }
]

export const formatCentsToCurrencyExamples: CodeSampleProps[] = [
  {
    fn: () => {
      return formatCentsToCurrency(10250, 'EUR')
    }
  },
  {
    fn: () => {
      return formatCentsToCurrency(10250, 'USD')
    }
  },
  {
    fn: () => {
      return formatCentsToCurrency(10250, 'JPY')
    }
  }
]
