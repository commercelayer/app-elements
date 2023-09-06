import { Spacer } from '#ui/atoms/Spacer'
import {
  InputCurrency,
  formatCentsToCurrency,
  type InputCurrencyProps
} from '#ui/forms/InputCurrency/InputCurrency'
import { type CurrencyCode } from '#ui/forms/InputCurrency/currencies'
import { isSingleValueSelected } from '#ui/forms/InputSelect/index'
import {
  InputWrapper,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import { useEffect, useRef, useState } from 'react'
import { InputSelect } from './InputSelect'

type Cents = InputCurrencyProps['cents']

export interface InputCurrencyRangeProps extends InputWrapperBaseProps {
  fromCents?: Cents
  toCents?: Cents
  onChange: (
    from: { cents: Cents; formatted: string },
    to: { cents: Cents; formatted: string },
    currency: Uppercase<CurrencyCode>
  ) => void
  placeholders?: [string, string]
  currencyList: Array<Uppercase<CurrencyCode>>
  defaultCurrency?: Uppercase<CurrencyCode>
  className?: string
}

export function InputCurrencyRange({
  fromCents,
  toCents,
  placeholders = ['Minimum', 'Maximum'],
  onChange,
  label,
  hint,
  currencyList,
  defaultCurrency = currencyList[0],
  className,
  feedback
}: InputCurrencyRangeProps): JSX.Element {
  const [activeCurrency, setActiveCurrency] =
    useState<Uppercase<CurrencyCode>>(defaultCurrency)

  const [internalCents, setInternalCents] = useState<[Cents, Cents]>([
    fromCents,
    toCents
  ])
  const internalFromCents = internalCents[0]
  const internalToCents = internalCents[1]

  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    onChange(
      {
        cents: internalFromCents,
        formatted:
          internalFromCents != null
            ? formatCentsToCurrency(internalFromCents, activeCurrency)
            : ''
      },
      {
        cents: internalToCents,
        formatted:
          internalToCents != null
            ? formatCentsToCurrency(internalToCents, activeCurrency)
            : ''
      },
      activeCurrency
    )
  }, [activeCurrency])

  return (
    <InputWrapper hint={hint} feedback={feedback} className={className}>
      <fieldset>
        {label != null ? (
          <Spacer bottom='4'>
            <legend className='text-gray-500 font-medium'>{label}</legend>
          </Spacer>
        ) : null}
        <div className='flex gap-4'>
          <InputCurrency
            currencyCode={activeCurrency}
            cents={internalFromCents}
            onChange={(newCents, formatted) => {
              setInternalCents([newCents, internalToCents])
              onChange(
                { cents: newCents, formatted },
                {
                  cents: internalToCents,
                  formatted:
                    internalToCents != null
                      ? formatCentsToCurrency(internalToCents, activeCurrency)
                      : ''
                },
                activeCurrency
              )
            }}
            placeholder={placeholders[0]}
            aria-label={placeholders[0]}
            hideCurrencySymbol
            isClearable
          />

          <InputCurrency
            currencyCode={activeCurrency}
            cents={internalToCents}
            onChange={(newCents, formatted) => {
              setInternalCents([internalFromCents, newCents])
              onChange(
                {
                  cents: internalFromCents,
                  formatted:
                    internalFromCents != null
                      ? formatCentsToCurrency(internalFromCents, activeCurrency)
                      : ''
                },
                { cents: newCents, formatted },
                activeCurrency
              )
            }}
            placeholder={placeholders[1]}
            aria-label={placeholders[1]}
            hideCurrencySymbol
            isClearable
          />

          <InputSelect
            initialValues={currencyList.map((currency) => ({
              value: currency,
              label: currency
            }))}
            defaultValue={{ value: defaultCurrency, label: defaultCurrency }}
            onSelect={(currency) => {
              if (currency != null && isSingleValueSelected(currency)) {
                setActiveCurrency(currency.value as Uppercase<CurrencyCode>)
              }
            }}
            className='min-w-max'
            data-testid='currency-select'
            aria-label='currency'
          />
        </div>
      </fieldset>
    </InputWrapper>
  )
}

InputCurrencyRange.displayName = 'InputCurrencyRange'
