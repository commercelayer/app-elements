import { InputSelectProps, SelectValue } from './'
import AsyncSelect from 'react-select/async'
import { StylesConfig } from 'react-select'
import components from './overrides'

interface AsyncSelectComponentProps
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
    | 'onBlur'
    | 'name'
    | 'loadAsyncValues'
    | 'noOptionsMessage'
  > {
  styles: StylesConfig<SelectValue>
}

function AsyncSelectComponent({
  onSelect,
  noOptionsMessage,
  initialValues,
  loadAsyncValues,
  ...rest
}: AsyncSelectComponentProps): JSX.Element {
  return (
    <AsyncSelect
      {...rest}
      defaultOptions={initialValues}
      onChange={onSelect}
      noOptionsMessage={() => noOptionsMessage}
      loadOptions={loadAsyncValues}
      components={components}
    />
  )
}

export default AsyncSelectComponent
