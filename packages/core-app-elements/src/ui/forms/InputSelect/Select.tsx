import { InputSelectProps, SelectValue } from './'
import Select, { StylesConfig } from 'react-select'
import components from './overrides'

interface SelectComponentProps
  extends Pick<
    InputSelectProps,
    | 'menuIsOpen'
    | 'initialValues'
    | 'defaultValue'
    | 'isClearable'
    | 'isLoading'
    | 'loadingText'
    | 'placeholder'
    | 'isDisabled'
    | 'onSelect'
    | 'isMulti'
    | 'isSearchable'
    | 'onBlur'
    | 'name'
    | 'noOptionsMessage'
  > {
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

export default SelectComponent
