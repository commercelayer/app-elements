import { useValidationFeedback } from '#components/useValidationFeedback'
import { InputCurrency as InputCurrencyUi } from '@commercelayer/app-elements'
import { type InputCurrencyProps } from '@commercelayer/app-elements/dist/ui/forms/InputCurrency'
import { Controller, useFormContext } from 'react-hook-form'

interface Props
  extends Omit<InputCurrencyProps, 'onChange' | 'onBlur' | 'cents'> {
  /**
   * field name to match hook-form state
   */
  name: string
}

function InputCurrency({ name, ...props }: Props): JSX.Element {
  const { control } = useFormContext()
  const feedback = useValidationFeedback(name)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, onBlur } }) => (
        <InputCurrencyUi
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

InputCurrency.displayName = 'InputCurrency'
export { InputCurrency }
