import { InputSelect as InputSelectUi } from '@commercelayer/core-app-elements'
import { InputSelectProps } from '@commercelayer/core-app-elements/dist/ui/forms/InputSelect'

import { Controller, useFormContext } from 'react-hook-form'
import { ValidationError } from '#components/ValidationError'

interface Props extends Omit<InputSelectProps, 'onSelect' | 'defaultValue'> {
  /**
   * field name to match hook-form state
   */
  name: string
}

function InputSelect({ name, ...props }: Props): JSX.Element {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, onBlur } }) => (
        <div>
          <InputSelectUi
            {...props}
            onBlur={onBlur}
            defaultValue={value}
            onSelect={(values) => {
              onChange(values)
            }}
          />
          <ValidationError name={name} />
        </div>
      )}
    />
  )
}

InputSelect.displayName = 'InputSelect'
export { InputSelect }
