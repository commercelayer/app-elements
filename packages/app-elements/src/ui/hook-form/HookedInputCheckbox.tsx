import { InputCheckbox, type InputCheckboxProps } from '#ui/forms/InputCheckbox'
import { useFormContext } from 'react-hook-form'

interface Props extends InputCheckboxProps {
  /**
   * field name to match hook-form state
   */
  name: string
}

function HookedInputCheckbox({ name, ...props }: Props): JSX.Element {
  const { register } = useFormContext()

  return <InputCheckbox {...props} {...register(name)} />
}

HookedInputCheckbox.displayName = 'HookedInputCheckbox'
export { HookedInputCheckbox }
