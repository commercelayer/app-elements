import { Input as InputUi } from '@commercelayer/app-elements'
import { InputProps } from '@commercelayer/app-elements/dist/ui/forms/Input'
import { useFormContext } from 'react-hook-form'
import { useValidationFeedback } from './useValidationFeedback'

interface Props extends InputProps {
  /**
   * field name to match hook-form state
   */
  name: string
}

function Input({ name, ...props }: Props): JSX.Element {
  const { register } = useFormContext()
  const feedback = useValidationFeedback(name)

  return <InputUi {...props} {...register(name)} feedback={feedback} />
}

Input.displayName = 'Input'
export { Input }
