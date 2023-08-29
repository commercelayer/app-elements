import { Input, type InputProps } from '#ui/forms/Input'
import { useFormContext } from 'react-hook-form'
import { useValidationFeedback } from './useValidationFeedback'

interface Props extends InputProps {
  /**
   * field name to match hook-form state
   */
  name: string
}

function HookedInput({ name, ...props }: Props): JSX.Element {
  const { register } = useFormContext()
  const feedback = useValidationFeedback(name)

  return <Input {...props} {...register(name)} feedback={feedback} />
}

HookedInput.displayName = 'HookedInput'
export { HookedInput }
