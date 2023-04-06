import { useFormContext } from 'react-hook-form'
import { type InputFeedbackProps } from '@commercelayer/app-elements/dist/ui/forms/InputFeedback'
import get from 'lodash/get'

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
