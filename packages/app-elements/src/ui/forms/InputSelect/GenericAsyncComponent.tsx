import debounce from 'lodash/debounce'
import isEmpty from 'lodash/isEmpty'
import { type AsyncAdditionalProps } from 'node_modules/react-select/dist/declarations/src/useAsync'
import { forwardRef, useCallback, useEffect } from 'react'
import {
  type GroupBase,
  type SelectInstance,
  type StylesConfig
} from 'react-select'
import type AsyncSelect from 'react-select/async'
import type AsyncCreatableSelect from 'react-select/async-creatable'
import { type SetRequired } from 'type-fest'
import { type InputSelectProps, type InputSelectValue } from './InputSelect'
import components from './overrides'

export interface GenericAsyncSelectComponentProps
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

export const GenericAsyncSelectComponent = forwardRef<
  SelectInstance<InputSelectValue, boolean, GroupBase<InputSelectValue>>,
  GenericAsyncSelectComponentProps & {
    SelectComponent: AsyncSelect | AsyncCreatableSelect
  }
>(
  (
    {
      onSelect,
      noOptionsMessage,
      initialValues,
      isOptionDisabled,
      loadAsyncValues,
      SelectComponent,
      debounceMs = 500,
      ...rest
    },
    ref
  ) => {
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
      <SelectComponent
        {...rest}
        ref={ref}
        defaultOptions={initialValues}
        onChange={onSelect}
        closeMenuOnSelect={rest.isMulti !== true}
        createOptionPosition='first'
        allowCreateWhileLoading
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
        formatCreateLabel={(v) => v} // to override default `Create "${value}"`
      />
    )
  }
)

GenericAsyncSelectComponent.displayName = 'GenericAsyncSelectComponent'
