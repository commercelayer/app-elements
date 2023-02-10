import { InputDateRange as InputDateRangeUi } from '@commercelayer/core-app-elements'
import { InputDateRangeProps } from '@commercelayer/core-app-elements/dist/ui/forms/InputDateRange'

import { Controller, useFormContext } from 'react-hook-form'
import ValidationError from '#components/ValidationError'

interface Props extends Omit<InputDateRangeProps, 'onChange' | 'value'> {
  /**
   * field name to match hook-form state
   */
  name: string
}

function InputDateRange({ name, ...props }: Props): JSX.Element {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ref } }) => (
        <div>
          <InputDateRangeUi
            {...props}
            onChange={onChange}
            value={value}
            ref={ref}
          />
          <ValidationError name={name} />
        </div>
      )}
    />
  )
}

export default InputDateRange
