import { Controller, useFormContext } from 'react-hook-form'
import { useValidationFeedback } from '../ReactHookForm'
import { InputCurrency, type InputCurrencyProps } from './InputCurrency'

export interface HookedInputCurrencyProps
  extends Omit<InputCurrencyProps, 'onChange' | 'onBlur' | 'cents'> {
  /**
   * field name to match hook-form state
   */
  name: string
}

/**
 * `InputCurrency` component ready to be used with the `react-hook-form` context.
 * Value is stored in form state as cents.
 * @see InputCurrency
 */
export function HookedInputCurrency({
  name,
  ...props
}: HookedInputCurrencyProps): JSX.Element {
  const { control } = useFormContext()
  const feedback = useValidationFeedback(name)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, onBlur } }) => (
        <InputCurrency
          {...props}
          onBlur={onBlur}
          cents={value}
          onChange={(newCents) => {
            onChange(newCents)
          }}
          feedback={feedback}
        />
      )}
    />
  )
}

HookedInputCurrency.displayName = 'HookedInputCurrency'
