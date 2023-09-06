import { useFormContext } from 'react-hook-form'
import { HookedValidationError } from '../ReactHookForm'
import { InputToggleBox, type InputToggleBoxProps } from './InputToggleBox'

interface Props extends InputToggleBoxProps {
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
 * `InputToggleBox` component ready to be used with the `react-hook-form` context.
 * @see InputToggleBox
 */
export function HookedInputToggleBox({
  name,
  showValidation,
  ...props
}: Props): JSX.Element {
  const { register } = useFormContext()

  return (
    <>
      <InputToggleBox {...props} {...register(name)} />
      {showValidation === true && <HookedValidationError name={name} />}
    </>
  )
}

HookedInputToggleBox.displayName = 'HookedInputToggleBox'
