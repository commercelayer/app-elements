import { type InputSelectProps, type SelectValue } from './'
import AsyncSelect from 'react-select/async'
import { type StylesConfig } from 'react-select'
import components from './overrides'
import { type SetRequired } from 'type-fest'

interface AsyncSelectComponentProps
  extends Omit<
    SetRequired<InputSelectProps, 'loadAsyncValues'>,
    'label' | 'hint'
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

AsyncSelectComponent.displayName = 'AsyncSelectComponent'
export { AsyncSelectComponent }
