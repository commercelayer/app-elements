import get from 'lodash-es/get'
import { type JSX } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { type InputFeedbackProps } from '../InputFeedback'
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
  const { control, formState } = useFormContext()

  const errors = get(formState.errors, name)
  const feedbackVariant: InputFeedbackProps['variant'] = 'danger'

  // Since the component value is a tuple, you could end up to receive an array of validation errors.
  // Especially when only one of the two dates is invalid.
  const errorMessageFrom =
    Array.isArray(errors) && typeof errors[0]?.message === 'string'
      ? {
          message: errors[0]?.message as string,
          variant: feedbackVariant
        }
      : undefined
  const errorMessageTo =
    Array.isArray(errors) && typeof errors[1]?.message === 'string'
      ? {
          message: errors[1]?.message as string,
          variant: feedbackVariant
        }
      : undefined

  // When the value is nullish, the error is single object and not an array.
  // In this case we handle it as single error message shared between the two inputs and displayed at the bottom.
  const errorMessageGeneric =
    typeof errors?.message === 'string'
      ? {
          message: errors.message,
          variant: feedbackVariant
        }
      : undefined

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
          fromFeedback={errorMessageFrom}
          toFeedback={errorMessageTo}
          feedback={errorMessageGeneric}
        />
      )}
    />
  )
}

HookedInputDateRange.displayName = 'HookedInputDateRange'
