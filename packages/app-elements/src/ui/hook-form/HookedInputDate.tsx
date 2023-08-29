import { InputDate } from '#ui/forms/InputDate'
import { type InputDateProps } from '#ui/forms/InputDate/InputDateComponent'
import { Controller, useFormContext } from 'react-hook-form'
import { useValidationFeedback } from './useValidationFeedback'

interface Props extends Omit<InputDateProps, 'onChange'> {
  /**
   * field name to match hook-form state
   */
  name: string
}

function HookedInputDate({ name, ...props }: Props): JSX.Element {
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
        />
      )}
    />
  )
}

HookedInputDate.displayName = 'HookedInputDate'
export { HookedInputDate }
