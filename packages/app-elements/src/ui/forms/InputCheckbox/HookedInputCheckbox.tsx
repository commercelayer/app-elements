import { useFormContext } from 'react-hook-form'
import { InputCheckbox, type InputCheckboxProps } from './InputCheckbox'

export interface HookedInputCheckboxProps extends InputCheckboxProps {
  /**
   * field name to match hook-form state
   */
  name: string
}

/**
 * `InputCheckbox` component ready to be used with the `react-hook-form` context.
 * @see InputCheckbox
 */
export function HookedInputCheckbox({
  name,
  ...props
}: HookedInputCheckboxProps): JSX.Element {
  const { register } = useFormContext()

  return <InputCheckbox {...props} {...register(name)} />
}

HookedInputCheckbox.displayName = 'HookedInputCheckbox'
