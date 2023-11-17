import { useFormContext } from 'react-hook-form'
import { useValidationFeedback } from '../ReactHookForm'
import { InputTextArea, type InputTextAreaProps } from './InputTextArea'

export interface HookedInputTextAreaProps extends InputTextAreaProps {
  /**
   * field name to match hook-form state
   */
  name: string
}

/**
 * `InputTextArea` component ready to be used with the `react-hook-form` context.
 * @see InputSelect
 */
export function HookedInputTextArea({
  name,
  ...props
}: HookedInputTextAreaProps): JSX.Element {
  const { register } = useFormContext()
  const feedback = useValidationFeedback(name)

  return <InputTextArea {...props} {...register(name)} feedback={feedback} />
}

HookedInputTextArea.displayName = 'HookedInputTextArea'
