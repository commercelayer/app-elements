import { useFormContext } from 'react-hook-form'
import { Text } from '@commercelayer/core-app-elements'

interface Props {
  /**
   * field name to match hook-form state
   */
  name: string
}

function ValidationError({ name }: Props): JSX.Element | null {
  const {
    formState: { errors }
  } = useFormContext()
  const errorMessage = errors[name]?.message
  const hasErrorMessage =
    errorMessage != null && typeof errorMessage === 'string'

  return hasErrorMessage ? <Text variant='danger'>{errorMessage}</Text> : null
}

export default ValidationError
