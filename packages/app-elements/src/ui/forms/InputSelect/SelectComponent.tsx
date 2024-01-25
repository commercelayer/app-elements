import { forwardRef } from 'react'
import Select, {
  type GroupBase,
  type SelectInstance,
  type StylesConfig
} from 'react-select'
import { type InputSelectProps, type InputSelectValue } from './InputSelect'
import components from './overrides'

interface SelectComponentProps
  extends Omit<InputSelectProps, 'loadAsyncValues' | 'label' | 'hint'> {
  styles: StylesConfig<InputSelectValue>
}

export const SelectComponent = forwardRef<
  SelectInstance<InputSelectValue, boolean, GroupBase<InputSelectValue>>,
  SelectComponentProps
>(
  (
    { onSelect, noOptionsMessage, isOptionDisabled, initialValues, ...rest },
    ref
  ) => {
    return (
      <Select
        {...rest}
        ref={ref}
        isOptionDisabled={isOptionDisabled}
        options={initialValues}
        onChange={onSelect}
        closeMenuOnSelect={rest.isMulti !== true}
        noOptionsMessage={() => noOptionsMessage}
        components={components}
      />
    )
  }
)

SelectComponent.displayName = 'SelectComponent'
