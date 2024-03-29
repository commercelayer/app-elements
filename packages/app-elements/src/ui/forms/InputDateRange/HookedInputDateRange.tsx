import { Controller, useFormContext } from 'react-hook-form'
import { useValidationFeedback } from '../ReactHookForm'
import { InputDateRange, type InputDateRangeProps } from './InputDateRange'

export interface HookedInputDateRangeProps
  extends Omit<InputDateRangeProps, 'onChange' | 'value'> {
  /**
   * field name to match hook-form state
   */
  name: string
}

/**
 * `InputDateRange` component ready to be used with the `react-hook-form` context.
 * Value is stored in form state as tuple of two iso date strings
 * (example: `["2023-08-01T22:00:00.000Z", "2023-08-14T22:00:00.000Z"]` ).
 * @see InputDateRange
 */
export function HookedInputDateRange({
  name,
  ...props
}: HookedInputDateRangeProps): JSX.Element {
  const { control } = useFormContext()
  const feedback = useValidationFeedback(name)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ref } }) => (
        <InputDateRange
          {...props}
          onChange={onChange}
          value={value}
          ref={ref}
          feedback={feedback}
        />
      )}
    />
  )
}

HookedInputDateRange.displayName = 'HookedInputDateRange'
