import type { CodeSampleProps } from "src/components/CodeSample"
import type { CurrencyCode } from "#helpers/currencies"
import { formatCentsToCurrency } from "#ui/forms/InputCurrency"

export const currencyCodeTypeExamples: CodeSampleProps[] = [
  {
    fn: () => {
      // This is to avoid name mangling.
      // biome-ignore lint/security/noGlobalEval: This is a controlled example.
      eval("")

      const currencyCode: CurrencyCode = "USD"

      return currencyCode
    },
    code: `
      const currencyCode: CurrencyCode = 'USD';

      return currencyCode;
    `,
  },
]

export const formatCentsToCurrencyExamples: CodeSampleProps[] = [
  {
    fn: () => {
      return formatCentsToCurrency(10250, "EUR")
    },
  },
  {
    fn: () => {
      return formatCentsToCurrency(10250, "USD")
    },
  },
  {
    fn: () => {
      return formatCentsToCurrency(10250, "JPY")
    },
  },
]
