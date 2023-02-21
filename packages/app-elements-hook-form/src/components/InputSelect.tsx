import { InputSelect as InputSelectUi } from '@commercelayer/app-elements'
import { InputSelectProps } from '@commercelayer/app-elements/dist/ui/forms/InputSelect'

import { Controller, useFormContext } from 'react-hook-form'
import { useValidationFeedback } from '#components/useValidationFeedback'

interface Props extends Omit<InputSelectProps, 'onSelect' | 'defaultValue'> {
  /**
   * field name to match hook-form state
   */
  name: string
}

function InputSelect({ name, ...props }: Props): JSX.Element {
  const { control } = useFormContext()
  const feedback = useValidationFeedback(name)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, onBlur } }) => (
        <InputSelectUi
          {...props}
          onBlur={onBlur}
          defaultValue={value}
          onSelect={(values) => {
            onChange(values)
          }}
          feedback={feedback}
        />
      )}
    />
  )
}

InputSelect.displayName = 'InputSelect'
export { InputSelect }
