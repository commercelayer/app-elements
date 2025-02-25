import { type JSX } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useValidationFeedback } from '../ReactHookForm'
import { InputSpinner, type InputSpinnerProps } from './InputSpinner'

export interface HookedInputSpinnerProps
  extends Omit<InputSpinnerProps, 'onChange' | 'defaultValues'> {
  /**
   * field name to match hook-form state
   */
  name: string
}

/**
 * `InputSpinner` component ready to be used with the `react-hook-form` context.
 * @see InputSpinner
 */
export function HookedInputSpinner({
  name,
  ...props
}: HookedInputSpinnerProps): JSX.Element {
  const { control } = useFormContext()
  const feedback = useValidationFeedback(name)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <InputSpinner
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

HookedInputSpinner.displayName = 'HookedInputSpinner'
