import { InputFeedback } from '#ui/forms/InputFeedback'
import { type JSX } from 'react'
import { useValidationFeedback } from './useValidationFeedback'

interface Props {
  /**
   * field name to match hook-form state
   */
  name: string
}

export function HookedValidationError({ name }: Props): JSX.Element | null {
  const feedback = useValidationFeedback(name)
  return feedback != null ? <InputFeedback {...feedback} /> : null
}

HookedValidationError.displayName = 'HookedValidationError'
