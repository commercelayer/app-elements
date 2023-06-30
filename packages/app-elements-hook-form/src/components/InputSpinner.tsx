import { useValidationFeedback } from '#components/useValidationFeedback'
import { InputSpinner as InputSpinnerUi } from '@commercelayer/app-elements'
import { type InputSpinnerProps } from '@commercelayer/app-elements/dist/ui/forms/InputSpinner'
import { Controller, useFormContext } from 'react-hook-form'

interface Props extends Omit<InputSpinnerProps, 'onChange' | 'defaultValues'> {
  /**
   * field name to match hook-form state
   */
  name: string
}

function InputSpinner({ name, ...props }: Props): JSX.Element {
  const { control } = useFormContext()
  const feedback = useValidationFeedback(name)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <InputSpinnerUi
          {...props}
          defaultValue={field.value ?? []}
          onChange={(value) => {
            field.onChange(value)
          }}
          feedback={feedback}
        />
      )}
    />
  )
}

InputSpinner.displayName = 'InputSpinner'
export { InputSpinner }
