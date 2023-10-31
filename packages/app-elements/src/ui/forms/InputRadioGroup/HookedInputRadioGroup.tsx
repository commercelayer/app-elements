import { useValidationFeedback } from '#ui/forms/ReactHookForm'
import { Controller, useFormContext } from 'react-hook-form'
import { InputRadioGroup, type InputRadioGroupProps } from './InputRadioGroup'

export interface HookedInputRadioGroupProps
  extends Omit<InputRadioGroupProps, 'onChange' | 'defaultValues'> {
  /**
   * field name to match hook-form state
   */
  name: string
}

/**
 * `InputRadioGroup` component ready to be used with the `react-hook-form` context.
 * @see InputCheckboxGroupProps
 */
export const HookedInputRadioGroup: React.FC<HookedInputRadioGroupProps> = ({
  name,
  ...props
}) => {
  const { control } = useFormContext()
  const feedback = useValidationFeedback(name)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <InputRadioGroup
          {...props}
          name={name}
          feedback={feedback}
          defaultValue={field.value}
          onChange={(values) => {
            field.onChange(values)
          }}
        />
      )}
    />
  )
}

HookedInputRadioGroup.displayName = 'HookedInputRadioGroup'
