import { InputSelectProps, SelectValue } from './'
import Select, { StylesConfig } from 'react-select'
import components from './overrides'

interface SelectComponentProps
  extends Omit<InputSelectProps, 'loadAsyncValues' | 'label' | 'hint'> {
  styles: StylesConfig<SelectValue>
}

function SelectComponent({
  onSelect,
  noOptionsMessage,
  initialValues,
  ...rest
}: SelectComponentProps): JSX.Element {
  return (
    <Select
      {...rest}
      options={initialValues}
      onChange={onSelect}
      noOptionsMessage={() => noOptionsMessage}
      components={components}
    />
  )
}

SelectComponent.displayName = 'SelectComponent'
export { SelectComponent }
