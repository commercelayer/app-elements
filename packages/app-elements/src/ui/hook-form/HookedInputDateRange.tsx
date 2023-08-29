import {
  InputDateRange,
  type InputDateRangeProps
} from '#ui/forms/InputDateRange'
import { Controller, useFormContext } from 'react-hook-form'
import { useValidationFeedback } from './useValidationFeedback'

interface Props extends Omit<InputDateRangeProps, 'onChange' | 'value'> {
  /**
   * field name to match hook-form state
   */
  name: string
}

function HookedInputDateRange({ name, ...props }: Props): JSX.Element {
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
export { HookedInputDateRange }
