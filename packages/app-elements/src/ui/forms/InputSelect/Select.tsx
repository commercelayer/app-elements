import Select, { type StylesConfig } from 'react-select'
import { type InputSelectProps, type SelectValue } from './'
import components from './overrides'

interface SelectComponentProps
  extends Omit<InputSelectProps, 'loadAsyncValues' | 'label' | 'hint'> {
  styles: StylesConfig<SelectValue>
}

export function SelectComponent({
  onSelect,
  noOptionsMessage,
  isOptionDisabled,
  initialValues,
  ...rest
}: SelectComponentProps): JSX.Element {
  return (
    <Select
      {...rest}
      isOptionDisabled={isOptionDisabled}
      options={initialValues}
      onChange={onSelect}
      noOptionsMessage={() => noOptionsMessage}
      components={components}
    />
  )
}

SelectComponent.displayName = 'SelectComponent'
