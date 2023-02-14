import { InputDate as InputDateUi } from '@commercelayer/core-app-elements'
import { InputDateProps } from '@commercelayer/core-app-elements/dist/ui/forms/InputDate/InputDateComponent'

import { Controller, useFormContext } from 'react-hook-form'
import { ValidationError } from '#components/ValidationError'

interface Props extends Omit<InputDateProps, 'onChange'> {
  /**
   * field name to match hook-form state
   */
  name: string
}

function InputDate({ name, ...props }: Props): JSX.Element {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div>
          <InputDateUi {...props} {...field} />
          <ValidationError name={name} />
        </div>
      )}
    />
  )
}

InputDate.displayName = 'InputDate'
export { InputDate }
