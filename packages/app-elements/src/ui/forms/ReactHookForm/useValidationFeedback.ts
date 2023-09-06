import { type InputFeedbackProps } from '#ui/forms/InputFeedback'
import get from 'lodash/get'
import { useFormContext } from 'react-hook-form'

type MaybeFeedback = Omit<InputFeedbackProps, 'className'> | undefined

export function useValidationFeedback(name: string): MaybeFeedback {
  const {
    formState: { errors }
  } = useFormContext()
  const message = get(errors, name)?.message
  const hasErrorMessage = message != null && typeof message === 'string'

  if (hasErrorMessage) {
    return {
      message,
      variant: 'danger'
    }
  }
}
