import { formatValue } from 'react-currency-input-field'
import { currencies, type Currency, type CurrencyCode } from './currencies'

/**
 *  Returns a currency object for a given currency code
 */
export function getCurrency(
  currencyCode: Uppercase<CurrencyCode> | CurrencyCode
): Currency | undefined {
  return currencies[currencyCode.toLowerCase() as CurrencyCode]
}

/**
 *  Returns the number of decimals for a given currency
 */
export function getDecimalLength(currency: Currency): number {
  return Math.log10(currency.subunit_to_unit)
  // return currency.subunit_to_unit.toString().split('0').length - 1
}

/**
 * Add currency symbol to formatted value based on currency.symbol_first.
 * Some currencies have symbol as prefix, some as suffix.
 * Example: EUR -> € 1.000,00
 * Example: LRD -> 1,000.00 $  (:iberian dollar)
 */
export function addCurrencySymbol({
  formattedValue,
  currency
}: {
  formattedValue: string
  currency: Currency
}): string {
  if (formattedValue == null) {
    return ''
  }

  if (currency.symbol_first) {
    return `${currency.symbol}${formattedValue}`
  }
  return `${formattedValue}${currency.symbol}`
}

/**
 * Create a placeholder based on the currency decimal length.
 * Example: EUR -> 0,00
 * Example: JPY -> 0
 * Example: CLF -> 0,0000
 */
export function makePlaceholder(currency: Currency): string {
  const decimalLength = getDecimalLength(currency)
  if (decimalLength === 0) {
    return '0'
  }
  const decimals = ''.padEnd(decimalLength, '0')
  return `0${currency.decimal_mark}${decimals}`
}

/**
 * Format cents to currency.
 * Useful to display the returned value from `<InputCurrency>` component.
 *
 * @example
 * formatCentsToCurrency(100, 'EUR') //= €1,00
 * formatCentsToCurrency(100000, 'USD') //= $1,000.00
 * formatCentsToCurrency(100, 'JPY') //= ¥100
 **/
export function formatCentsToCurrency(
  cents: number,
  currencyCode: Uppercase<CurrencyCode>,
  stripZeroDecimals = false
): string {
  const currency = getCurrency(currencyCode)
  if (currency == null) {
    return `${cents}`
  }

  const decimalLength = getDecimalLength(currency)
  const unit = cents / currency.subunit_to_unit
  const fixedDecimals =
    stripZeroDecimals && unit % 1 === 0
      ? unit.toFixed(0)
      : unit.toFixed(decimalLength)
  const value = `${fixedDecimals}`.replace('.', currency.decimal_mark)

  const formattedValue = formatValue({
    value,
    decimalSeparator: currency.decimal_mark,
    groupSeparator: currency.thousands_separator
  })

  return addCurrencySymbol({ formattedValue, currency })
}
