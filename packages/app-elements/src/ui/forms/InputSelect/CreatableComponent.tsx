import { forwardRef } from 'react'
import {
  type GroupBase,
  type SelectInstance,
  type StylesConfig
} from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { type InputSelectProps, type InputSelectValue } from './InputSelect'
import components from './overrides'

interface CreatableComponentProps
  extends Omit<InputSelectProps, 'loadAsyncValues' | 'label' | 'hint'> {
  styles: StylesConfig<InputSelectValue>
}

export const CreatableComponent = forwardRef<
  SelectInstance<InputSelectValue, boolean, GroupBase<InputSelectValue>>,
  CreatableComponentProps
>(
  (
    { onSelect, noOptionsMessage, isOptionDisabled, initialValues, ...rest },
    ref
  ) => {
    return (
      <CreatableSelect
        {...rest}
        ref={ref}
        isOptionDisabled={isOptionDisabled}
        options={initialValues}
        onChange={onSelect}
        closeMenuOnSelect={rest.isMulti !== true}
        noOptionsMessage={() => noOptionsMessage}
        components={components}
        formatCreateLabel={(v) => v} // to override default `Create "${value}"`
      />
    )
  }
)

CreatableComponent.displayName = 'CreatableComponent'
