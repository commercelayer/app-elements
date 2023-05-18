import {
  InputWrapper,
  getFeedbackStyle,
  type InputWrapperBaseProps
} from '#ui/forms/InputWrapper'
import cn from 'classnames'
import { forwardRef, useMemo } from 'react'
import CurrencyInput, {
  formatValue as formatValueFn,
  type CurrencyInputProps
} from 'react-currency-input-field'
import { type CurrencyCode } from './currencies'
import {
  addCurrencySymbol,
  getCurrency,
  getDecimalLength,
  makePlaceholder
} from './utils'

export interface InputCurrencyProps
  extends InputWrapperBaseProps,
    Pick<CurrencyInputProps, 'onBlur' | 'onClick' | 'disabled'> {
  /**
   * HTML input id
   */
  id?: string
  /**
   * Field name
   */
  name?: string
  /**
   * Input placeholder
   */
  placeholder?: string
  /**
   * optional css class names used for the input element
   */
  className?: string
  /**
   * Valid 3-digit iso currency code (eg: EUR, USD, GBP)
   */
  currencyCode: Uppercase<CurrencyCode>
  /**
   * Value in cents
   */
  cents?: number | null
  /**
   * onChange callback triggered when during typing
   */
  onChange: (cents: number | null, formatted: string) => void
}

const InputCurrency = forwardRef<HTMLInputElement, InputCurrencyProps>(
  (
    {
      className,
      label,
      hint,
      feedback,
      cents,
      onChange,
      currencyCode,
      placeholder,
      ...rest
    },
    ref
  ): JSX.Element => {
    const currency = useMemo(() => getCurrency(currencyCode), [currencyCode])

    if (cents != null && cents > 0 && cents % 1 !== 0) {
      return <div>`cents` ({cents}) is not an integer value</div>
    }
    if (currency == null) {
      return <div>{currencyCode} is not a valid currencyCode</div>
    }

    const defaultValue = useMemo(
      () => (cents != null ? cents / currency.subunit_to_unit : undefined),
      [cents]
    )

    const decimalLength = useMemo(() => getDecimalLength(currency), [currency])

    return (
      <InputWrapper
        label={label}
        hint={hint}
        feedback={feedback}
        name={rest.id ?? rest.name}
      >
        <div className='relative'>
          <div
            data-test-id='inputCurrency-symbol'
            className='absolute left-4 top-1/2 transform -translate-y-1/2 font-bold'
          >
            {currency.symbol}
          </div>
          <CurrencyInput
            ref={ref}
            data-test-id='inputCurrency-input'
            id={rest.id ?? rest.name}
            className={cn(
              className,
              'block w-full pl-12 pr-4 py-2.5 font-medium',
              'rounded outline-0',
              getFeedbackStyle(feedback)
            )}
            disableAbbreviations
            allowNegativeValue={false}
            allowDecimals={decimalLength > 0}
            decimalsLimit={decimalLength}
            decimalSeparator={currency.decimal_mark}
            groupSeparator={currency.thousands_separator}
            placeholder={placeholder ?? makePlaceholder(currency)}
            defaultValue={defaultValue}
            onValueChange={(_, __, values) => {
              if (values == null || values.float == null) {
                onChange(null, '')
                return
              }

              const newValue = values.float * currency.subunit_to_unit
              const newFormatted = formatCentsToCurrency(newValue, currencyCode)
              onChange(newValue, newFormatted)
            }}
            {...rest}
          />
        </div>
      </InputWrapper>
    )
  }
)

InputCurrency.displayName = 'InputCurrency'
export { InputCurrency }

/**
 * Format cents to currency.
 * Useful to display the returned value from `<InputCurrency>` component.
 *
 * Example: formatCentsToCurrency(100, 'EUR') -> €1,00
 * Example: formatCentsToCurrency(100000, 'USD') -> $1,000.00
 * Example: formatCentsToCurrency(100, 'JPY') -> ¥100
 **/
export function formatCentsToCurrency(
  cents: number,
  currencyCode: Uppercase<CurrencyCode>
): string {
  const currency = getCurrency(currencyCode)
  if (currency == null) {
    return `${cents}`
  }

  const decimalLength = getDecimalLength(currency)
  const unit = cents / currency.subunit_to_unit
  const value = `${unit.toFixed(decimalLength)}`.replace(
    '.',
    currency.decimal_mark
  )

  const formattedValue = formatValueFn({
    value,
    decimalSeparator: currency.decimal_mark,
    groupSeparator: currency.thousands_separator
  })

  return addCurrencySymbol({ formattedValue, currency })
}
