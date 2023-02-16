import { InputToggleListBox as InputToggleListBoxUi } from '@commercelayer/core-app-elements'
import { InputToggleListBoxProps } from '@commercelayer/core-app-elements/dist/ui/forms/InputToggleListBox'
import { useFormContext } from 'react-hook-form'
import { ValidationError } from '#components/ValidationError'

interface Props extends InputToggleListBoxProps {
  /**
   * field name to match hook-form state
   */
  name: string
  /**
   * show validation error message underneath
   */
  showValidation: boolean
}

function InputToggleListBox({
  name,
  showValidation,
  ...props
}: Props): JSX.Element {
  const { register } = useFormContext()

  return (
    <>
      <InputToggleListBoxUi {...props} {...register(name)} />
      {showValidation && <ValidationError name={name} />}
    </>
  )
}

InputToggleListBox.displayName = 'InputToggleListBox'
export { InputToggleListBox }
