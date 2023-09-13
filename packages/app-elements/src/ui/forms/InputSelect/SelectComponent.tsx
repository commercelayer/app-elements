import Select, { type StylesConfig } from 'react-select'
import { type InputSelectProps, type SelectValue } from './InputSelect'
import components from './overrides'

interface SelectComponentProps
  extends Omit<InputSelectProps, 'loadAsyncValues' | 'label' | 'hint'> {
  styles: StylesConfig<SelectValue>
}

export const SelectComponent: React.FC<SelectComponentProps> = ({
  onSelect,
  noOptionsMessage,
  isOptionDisabled,
  initialValues,
  ...rest
}) => {
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