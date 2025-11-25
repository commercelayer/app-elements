import { forwardRef } from "react"
import Select, {
  type GroupBase,
  type SelectInstance,
  type StylesConfig,
} from "react-select"
import type { InputSelectProps, InputSelectValue } from "./InputSelect"
import components from "./overrides"

export interface SelectComponentProps
  extends Omit<InputSelectProps, "loadAsyncValues" | "label" | "hint"> {
  styles: StylesConfig<InputSelectValue>
}

export const SelectComponent = forwardRef<
  SelectInstance<InputSelectValue, boolean, GroupBase<InputSelectValue>>,
  SelectComponentProps
>(
  (
    { onSelect, noOptionsMessage, isOptionDisabled, initialValues, ...rest },
    ref,
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
        /**
         * With this change we ensure that the select control is always on top when focused.
         * Thanks to this it is possible to have tooltips or other elements that open on
         * hover/focus inside the options and they stay on top of the options menu.
         */
        classNames={{
          control: (state) => (state.isFocused ? "z-[101]" : ""),
        }}
      />
    )
  },
)

SelectComponent.displayName = "SelectComponent"
