import { useFormContext } from 'react-hook-form'
import { HookedValidationError } from '../ReactHookForm'
import {
  InputSimpleSelect,
  type InputSimpleSelectProps
} from './InputSimpleSelect'

export interface HookedInputSimpleSelectProps extends InputSimpleSelectProps {
  /**
   * field name to match hook-form state
   */
  name: string
  /**
   * show validation error message underneath
   */
  showValidation?: boolean
}

/**
 * `InputToggleListBox` component ready to be used with the `react-hook-form` context.
 * @see InputSimpleSelect
 */
export function HookedInputSimpleSelect({
  name,
  showValidation,
  ...props
}: HookedInputSimpleSelectProps): JSX.Element {
  const { register } = useFormContext()

  return (
    <>
      <InputSimpleSelect {...props} {...register(name)} />
      {showValidation === true && <HookedValidationError name={name} />}
    </>
  )
}

HookedInputSimpleSelect.displayName = 'HookedInputSimpleSelect'
