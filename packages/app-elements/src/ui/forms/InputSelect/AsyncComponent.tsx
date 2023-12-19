import debounce from 'lodash/debounce'
import isEmpty from 'lodash/isEmpty'
import { useCallback, useEffect } from 'react'
import { type GroupBase, type StylesConfig } from 'react-select'
import AsyncSelect from 'react-select/async'
import { type AsyncAdditionalProps } from 'react-select/dist/declarations/src/useAsync'
import { type SetRequired } from 'type-fest'
import { type InputSelectProps, type InputSelectValue } from './InputSelect'
import components from './overrides'

interface AsyncSelectComponentProps
  extends Omit<
    SetRequired<InputSelectProps, 'loadAsyncValues'>,
    'label' | 'hint'
  > {
  styles: StylesConfig<InputSelectValue>
}

// extracting loadOptions signature from react-select async types
type ReactSelectLoadOptions = Exclude<
  AsyncAdditionalProps<
    InputSelectValue,
    GroupBase<InputSelectValue>
  >['loadOptions'],
  undefined
>

export const AsyncSelectComponent: React.FC<AsyncSelectComponentProps> = ({
  onSelect,
  noOptionsMessage,
  initialValues,
  isOptionDisabled,
  loadAsyncValues,
  debounceMs = 500,
  ...rest
}) => {
  const loadOptions = useCallback(
    debounce<ReactSelectLoadOptions>((inputText, callback) => {
      void loadAsyncValues(inputText).then((options) => {
        callback(options)
      })
    }, debounceMs),
    [debounceMs]
  )

  useEffect(() => {
    return () => {
      loadOptions.cancel()
    }
  }, [debounceMs])

  return (
    <AsyncSelect
      {...rest}
      defaultOptions={initialValues}
      onChange={onSelect}
      noOptionsMessage={({ inputValue }) =>
        isEmpty(inputValue) &&
        (initialValues === undefined || initialValues.length === 0)
          ? null
          : noOptionsMessage
      }
      loadOptions={loadOptions}
      components={{
        ...components,
        DropdownIndicator: null
      }}
      isOptionDisabled={isOptionDisabled}
    />
  )
}

AsyncSelectComponent.displayName = 'AsyncSelectComponent'
