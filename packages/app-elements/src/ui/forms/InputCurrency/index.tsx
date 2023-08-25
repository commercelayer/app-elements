import { type Currency } from '#ui/forms/InputCurrency/currencies'
import {
  InputWrapper,
  getFeedbackStyle,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import { X } from '@phosphor-icons/react'
import cn from 'classnames'
import { forwardRef, useEffect, useMemo, useState } from 'react'
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
  /**
   * hide currency symbol but keep the currency formatting
   */
  hideCurrencySymbol?: boolean
  /**
   * Allow user to enter negative value
   * @default false
   */
  allowNegativeValue?: boolean
  /**
   * show (X) button to clear the input
   */
  isClearable?: boolean
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
      hideCurrencySymbol,
      allowNegativeValue = false,
      isClearable,
      ...rest
    },
    ref
  ): JSX.Element => {
    const currency = useMemo(() => getCurrency(currencyCode), [currencyCode])

    const [_value, setValue] = useState<string | number | undefined>(
      makeInitialValue({ cents, currency })
    )

    const decimalLength = useMemo(
      () => (currency != null ? getDecimalLength(currency) : 0),
      [currency]
    )

    useEffect(() => {
      setValue(makeInitialValue({ cents, currency }))
    }, [cents, currency])

    if (currency == null) {
      return <div>{currencyCode} is not a valid currencyCode</div>
    }

    if (cents != null && cents > 0 && cents % 1 !== 0) {
      return <div>`cents` ({cents}) is not an integer value</div>
    }

    return (
      <InputWrapper
        label={label}
        hint={hint}
        feedback={feedback}
        name={rest.id ?? rest.name}
      >
        <div className='relative'>
          {hideCurrencySymbol === true ? null : (
            <div
              data-test-id='inputCurrency-symbol'
              className='absolute left-4 top-1/2 transform -translate-y-1/2 font-bold'
            >
              {currency.symbol}
            </div>
          )}
          <CurrencyInput
            ref={ref}
            data-test-id='inputCurrency-input'
            id={rest.id ?? rest.name}
            className={cn(
              className,
              'block w-full pr-4 py-2.5 font-medium',
              {
                'pl-4': hideCurrencySymbol === true,
                'pl-12': hideCurrencySymbol !== true
              },
              'rounded outline-0',
              getFeedbackStyle(feedback)
            )}
            disableAbbreviations
            allowNegativeValue={allowNegativeValue}
            allowDecimals={decimalLength > 0}
            decimalsLimit={decimalLength}
            decimalSeparator={currency.decimal_mark}
            groupSeparator={currency.thousands_separator}
            placeholder={placeholder ?? makePlaceholder(currency)}
            value={_value ?? ''}
            onValueChange={(val, __, values) => {
              setValue(val)
              if (values == null || values.float == null) {
                onChange(null, '')
                return
              }
              const newValue = Math.round(
                values.float * currency.subunit_to_unit
              )
              const newFormatted = formatCentsToCurrency(newValue, currencyCode)
              onChange(newValue, newFormatted)
            }}
            {...rest}
          />
          {isClearable === true && _value != null ? (
            <button
              type='button'
              onClick={() => {
                setValue('')
                onChange(null, '')
              }}
              className='bg-gray-100 text-gray-400 rounded-full p-1.5 absolute right-4 top-1/2 transform -translate-y-1/2'
            >
              <X size={12} />
            </button>
          ) : null}
        </div>
      </InputWrapper>
    )
  }
)

InputCurrency.displayName = 'InputCurrency'

/**
 * Format cents to currency.
 * Useful to display the returned value from `<InputCurrency>` component.
 *
 * Example: formatCentsToCurrency(100, 'EUR') -> €1,00
 * Example: formatCentsToCurrency(100000, 'USD') -> $1,000.00
 * Example: formatCentsToCurrency(100, 'JPY') -> ¥100
 **/
function formatCentsToCurrency(
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

  const formattedValue = formatValueFn({
    value,
    decimalSeparator: currency.decimal_mark,
    groupSeparator: currency.thousands_separator
  })

  return addCurrencySymbol({ formattedValue, currency })
}

/**
 * Prepare the initial value for the component internal state.
 **/
function makeInitialValue({
  cents,
  currency
}: {
  cents?: number | null
  currency?: Currency
}): number | undefined {
  if (cents == null || currency == null) {
    return
  }

  return cents / currency.subunit_to_unit
}

export { InputCurrency, formatCentsToCurrency }
