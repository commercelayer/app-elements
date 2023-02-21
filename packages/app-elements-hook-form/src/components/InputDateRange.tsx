import { InputDateRange as InputDateRangeUi } from '@commercelayer/app-elements'
import { InputDateRangeProps } from '@commercelayer/app-elements/dist/ui/forms/InputDateRange'

import { Controller, useFormContext } from 'react-hook-form'
import { useValidationFeedback } from '#components/useValidationFeedback'

interface Props extends Omit<InputDateRangeProps, 'onChange' | 'value'> {
  /**
   * field name to match hook-form state
   */
  name: string
}

function InputDateRange({ name, ...props }: Props): JSX.Element {
  const { control } = useFormContext()
  const feedback = useValidationFeedback(name)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ref } }) => (
        <InputDateRangeUi
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

InputDateRange.displayName = 'InputDateRange'
export { InputDateRange }
