import { InputCurrency, type InputCurrencyProps } from '#ui/forms/InputCurrency'
import { Controller, useFormContext } from 'react-hook-form'
import { useValidationFeedback } from './useValidationFeedback'

interface Props
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
function HookedInputCurrency({ name, ...props }: Props): JSX.Element {
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
export { HookedInputCurrency }
