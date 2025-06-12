import { type MaybeDate } from '#ui/forms/InputDate/InputDateComponent'
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

  /**
   * Optional callback executed after the date value changes.
   * Useful for running custom logic in response to user interaction, independent of form state updates.
   * Note: This does not update the form state and should not be used to set the value.
   * It is triggered immediately after the form state has been updated.
   */
  onChanged?: (value: MaybeDate) => void
}

/**
 * `InputDate` component ready to be used with the `react-hook-form` context.
 * Value is stored in form state as iso date string (example: `"2023-08-01T22:00:00.000Z"` ).
 * @see InputDate
 */
export function HookedInputDate({
  name,
  onChanged,
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
          onChange={(date) => {
            field.onChange(date)
            onChanged?.(date)
          }}
        />
      )}
    />
  )
}

HookedInputDate.displayName = 'HookedInputDate'
