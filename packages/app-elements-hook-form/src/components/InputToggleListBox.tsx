import { InputToggleListBox as InputToggleListBoxUi } from '@commercelayer/core-app-elements'
import { InputToggleListBoxProps } from '@commercelayer/core-app-elements/dist/ui/forms/InputToggleListBox'
import { useFormContext } from 'react-hook-form'
import ValidationError from '#components/ValidationError'

interface Props extends InputToggleListBoxProps {
  name: string
}

function InputToggleListBox({ name, ...props }: Props): JSX.Element {
  const { register } = useFormContext()

  return (
    <div>
      <InputToggleListBoxUi {...props} {...register(name)} />
      <ValidationError name={name} />
    </div>
  )
}

export default InputToggleListBox
