import { InputFeedback } from '@commercelayer/app-elements'
import { useValidationFeedback } from '#components/useValidationFeedback'

interface Props {
  /**
   * field name to match hook-form state
   */
  name: string
}

function ValidationError({ name }: Props): JSX.Element | null {
  const feedback = useValidationFeedback(name)
  return feedback != null ? <InputFeedback {...feedback} /> : null
}

ValidationError.displayName = 'ValidationError'
export { ValidationError }
