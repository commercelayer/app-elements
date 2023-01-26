import { InputSelectProps, SelectValue } from './'
import AsyncSelect from 'react-select/async'
import { StylesConfig } from 'react-select'
import components from './overrides'

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

interface AsyncSelectComponentProps
  extends Omit<
    WithRequired<InputSelectProps, 'loadAsyncValues'>,
    'label' | 'helperText'
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
