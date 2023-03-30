import { InputCheckbox as InputCheckboxUI } from '@commercelayer/app-elements'
import { InputCheckboxProps } from '@commercelayer/app-elements/dist/ui/forms/InputCheckbox'
import { useFormContext } from 'react-hook-form'

interface Props extends InputCheckboxProps {
  /**
   * field name to match hook-form state
   */
  name: string
}

function InputCheckbox({ name, ...props }: Props): JSX.Element {
  const { register } = useFormContext()

  return <InputCheckboxUI {...props} {...register(name)} />
}

InputCheckbox.displayName = 'InputCheckbox'
export { InputCheckbox }
