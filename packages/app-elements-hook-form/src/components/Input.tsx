import { Input as InputUi } from '@commercelayer/core-app-elements'
import { InputProps } from '@commercelayer/core-app-elements/dist/ui/forms/Input'
import { useFormContext } from 'react-hook-form'
import ValidationError from './ValidationError'

interface Props extends InputProps {
  /**
   * field name to match hook-form state
   */
  name: string
}

function Input({ name, ...props }: Props): JSX.Element {
  const { register } = useFormContext()

  return (
    <div>
      <InputUi {...props} {...register(name)} />
      <ValidationError name={name} />
    </div>
  )
}

export default Input
