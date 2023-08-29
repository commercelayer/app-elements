import {
  InputToggleListBox,
  type InputToggleListBoxProps
} from '#ui/forms/InputToggleListBox'
import { useFormContext } from 'react-hook-form'
import { HookedValidationError } from './HookedValidationError'

interface Props extends InputToggleListBoxProps {
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
 * @see InputToggleListBox
 */
function HookedInputToggleListBox({
  name,
  showValidation,
  ...props
}: Props): JSX.Element {
  const { register } = useFormContext()

  return (
    <>
      <InputToggleListBox {...props} {...register(name)} />
      {showValidation === true && <HookedValidationError name={name} />}
    </>
  )
}

HookedInputToggleListBox.displayName = 'HookedInputToggleListBox'
export { HookedInputToggleListBox }
