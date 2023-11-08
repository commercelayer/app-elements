import { useValidationFeedback } from '#ui/forms/ReactHookForm'
import { useFormContext } from 'react-hook-form'
import { InputCheckbox, type InputCheckboxProps } from './InputCheckbox'

export interface HookedInputCheckboxProps
  extends Omit<
    InputCheckboxProps,
    'onChange' | 'checked' | 'feedback' | 'defaultValue' | 'defaultChecked'
  > {
  /**
   * field name to match hook-form state
   */
  name: string
}

/**
 * `InputCheckbox` component ready to be used with the `react-hook-form` context.
 * @see InputCheckbox
 */
export function HookedInputCheckbox({
  name,
  ...props
}: HookedInputCheckboxProps): JSX.Element {
  const { register } = useFormContext()
  const feedback = useValidationFeedback(name)

  return <InputCheckbox {...props} {...register(name)} feedback={feedback} />
}

HookedInputCheckbox.displayName = 'HookedInputCheckbox'
