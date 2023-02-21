import { InputToggleBox as InputToggleBoxUI } from '@commercelayer/app-elements'
import { InputToggleBoxProps } from '@commercelayer/app-elements/dist/ui/forms/InputToggleBox'
import { useFormContext } from 'react-hook-form'
import { ValidationError } from '#components/ValidationError'

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

function InputToggleBox({
  name,
  showValidation,
  ...props
}: Props): JSX.Element {
  const { register } = useFormContext()

  return (
    <>
      <InputToggleBoxUI {...props} {...register(name)} />
      {showValidation === true && <ValidationError name={name} />}
    </>
  )
}

InputToggleBox.displayName = 'InputToggleBox'
export { InputToggleBox }
