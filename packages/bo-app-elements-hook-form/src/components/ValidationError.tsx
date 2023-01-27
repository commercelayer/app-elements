import { useFormContext } from 'react-hook-form'
import { Text } from '@commercelayer/core-app-elements'

interface Props {
  name: string
}

function ValidationError({ name }: Props): JSX.Element | null {
  const {
    formState: { errors, touchedFields }
  } = useFormContext()
  const errorMessage = errors[name]?.message
  const hasErrorMessage =
    errorMessage != null && typeof errorMessage === 'string'
  const isTouched = touchedFields[name] != null

  return hasErrorMessage && isTouched ? (
    <Text variant='danger'>{errorMessage}</Text>
  ) : null
}

export default ValidationError
