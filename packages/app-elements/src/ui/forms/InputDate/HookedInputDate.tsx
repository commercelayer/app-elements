import { type JSX } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useValidationFeedback } from '../ReactHookForm'
import { InputDate } from './InputDate'
import { type InputDateProps } from './InputDateComponent'

export interface HookedInputDateProps extends Omit<InputDateProps, 'onChange'> {
  /**
   * field name to match hook-form state
   */
  name: string
}

/**
 * `InputDate` component ready to be used with the `react-hook-form` context.
 * Value is stored in form state as iso date string (example: `"2023-08-01T22:00:00.000Z"` ).
 * @see InputDate
 */
export function HookedInputDate({
  name,
  ...props
}: HookedInputDateProps): JSX.Element {
  const { control } = useFormContext()
  const feedback = useValidationFeedback(name)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <InputDate
          {...props}
          {...field}
          feedback={feedback}
          ref={(ref) => {
            field.ref({
              focus: ref?.setFocus
            })
          }}
        />
      )}
    />
  )
}

HookedInputDate.displayName = 'HookedInputDate'
