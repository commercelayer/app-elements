import { InputDate as InputDateUi } from '@commercelayer/app-elements'
import { type InputDateProps } from '@commercelayer/app-elements/dist/ui/forms/InputDate/InputDateComponent'

import { Controller, useFormContext } from 'react-hook-form'
import { useValidationFeedback } from '#components/useValidationFeedback'

interface Props extends Omit<InputDateProps, 'onChange'> {
  /**
   * field name to match hook-form state
   */
  name: string
}

function InputDate({ name, ...props }: Props): JSX.Element {
  const { control } = useFormContext()
  const feedback = useValidationFeedback(name)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <InputDateUi {...props} {...field} feedback={feedback} />
      )}
    />
  )
}

InputDate.displayName = 'InputDate'
export { InputDate }
