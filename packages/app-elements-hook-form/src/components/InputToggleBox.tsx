import { InputToggleBox as InputToggleBoxUI } from '@commercelayer/core-app-elements'
import { InputToggleBoxProps } from '@commercelayer/core-app-elements/dist/ui/forms/InputToggleBox'
import { useFormContext } from 'react-hook-form'
import { ValidationError } from '#components/ValidationError'

interface Props extends InputToggleBoxProps {
  /**
   * field name to match hook-form state
   */
  name: string
}

function InputToggleBox({ name, ...props }: Props): JSX.Element {
  const { register } = useFormContext()

  return (
    <div>
      <InputToggleBoxUI {...props} {...register(name)} />
      <ValidationError name={name} />
    </div>
  )
}

InputToggleBox.displayName = 'InputToggleBox'
export { InputToggleBox }
