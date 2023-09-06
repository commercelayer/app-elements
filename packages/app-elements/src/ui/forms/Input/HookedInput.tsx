import { useFormContext } from 'react-hook-form'
import { useValidationFeedback } from '../ReactHookForm'
import { Input, type InputProps } from './Input'

interface Props extends InputProps {
  /**
   * field name to match hook-form state
   */
  name: string
}

/**
 * `Input` component ready to be used with the `react-hook-form` context.
 * @see InputSelect
 */
export function HookedInput({ name, ...props }: Props): JSX.Element {
  const { register } = useFormContext()
  const feedback = useValidationFeedback(name)

  return <Input {...props} {...register(name)} feedback={feedback} />
}

HookedInput.displayName = 'HookedInput'
