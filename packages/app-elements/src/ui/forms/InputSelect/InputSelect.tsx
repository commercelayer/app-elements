import {
  InputWrapper,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import { forwardRef, type FocusEventHandler } from 'react'
import {
  type GroupBase,
  type MultiValue,
  type Options,
  type SelectInstance,
  type SingleValue
} from 'react-select'
import { AsyncSelectComponent } from './AsyncComponent'
import { AsyncCreatableSelectComponent } from './AsyncCreatableComponent'
import {
  CreatableComponent,
  type CreatableComponentProps
} from './CreatableComponent'
import { type GenericAsyncSelectComponentProps } from './GenericAsyncComponent'
import { SelectComponent, type SelectComponentProps } from './SelectComponent'
import { getSelectStyles } from './styles'

export type GroupedSelectValues = Array<{
  label?: string
  options: InputSelectValue[]
}>

export interface InputSelectValue {
  value: string | number | boolean
  label: string
  meta?: Record<string, any>
  isDisabled?: boolean
}

export type PossibleSelectValue =
  | MultiValue<InputSelectValue>
  | SingleValue<InputSelectValue>

export interface InputSelectProps extends InputWrapperBaseProps {
  /**
   * Initial values to populate the select options. It can be a flat array of values or a grouped array.
   */
  initialValues: GroupedSelectValues | InputSelectValue[]
  /**
   * Selected value or values, in case of `isMulti`
   */
  defaultValue?: InputSelectValue | InputSelectValue[]
  /**
   * Selected value or values, in case of `isMulti`
   */
  value?: InputSelectValue | InputSelectValue[]
  /**
   * Placeholder text to display when no value is selected
   */
  placeholder?: string
  /**
   * Controls loading UI state
   */
  isLoading?: boolean
  /**
   * Text to display when loading
   */
  loadingText?: string
  /**
   * Add a clear button (x) to the select to empty all selected values
   */
  isClearable?: boolean
  /**
   * Disable the select
   */
  isDisabled?: boolean
  /**
   * When `true` it's possible to type to narrow down the options
   */
  isSearchable?: boolean
  /**
   * Allow to select multiple values
   */
  isMulti?: boolean
  /**
   * Custom rule to disable an option
   */
  isOptionDisabled?: (
    option: InputSelectValue,
    selectValue: Options<InputSelectValue>
  ) => boolean
  /**
   * Callback triggered when a value is selected.
   */
  onSelect: (value: PossibleSelectValue) => void
  /**
   * onBlur event handler
   */
  onBlur?: FocusEventHandler<HTMLInputElement>
  /**
   * HTML name attribute for the input component
   */
  name?: string
  /**
   * The id of the search input
   */
  inputId?: string
  /**
   * When `true` the dropdown menu is always open
   */
  menuIsOpen?: boolean
  /**
   * Message to display when no options are found
   */
  noOptionsMessage?: string
  /**
   * CSS class name
   */
  className?: string
  /**
   * Function to load async values on search
   */
  loadAsyncValues?: (
    inputValue: string
  ) => Promise<GroupedSelectValues | InputSelectValue[]>
  /**
   * Optional text to display at the bottom of the dropdown menu
   */
  menuFooterText?: string
  /**
   * Debounce time in milliseconds for async search.
   * It only works when `loadAsyncValues` is provided
   */
  debounceMs?: number
  /**
   * Allows to create new options on the fly when no option is found.
   * It does not work with `loadAsyncValues`.
   */
  isCreatable?: boolean
}

/**
 * Advanced select component with support for async options loading and multi-select.
 * It's a wrapper around `react-select` with a subset of props exposed.
 *
 * To enable async data fetching for loading options while typing, provide the `loadAsyncValues` prop.
 * This function will be used to fetch new options while typing and the results will be displayed in the options menu.
 *
 * When `isSearchable` is `true`, it's possible to type to narrow down the options. The component will always be searchable when `loadAsyncValues` is provided.
 * On both standard and async mode it can be set to select a single single value or multiple values.
 *
 */
export const InputSelect = forwardRef<
  SelectInstance<InputSelectValue, boolean, GroupBase<InputSelectValue>>,
  InputSelectProps
>(
  (
    {
      label,
      hint,
      feedback,
      menuIsOpen,
      initialValues,
      defaultValue,
      value,
      isClearable,
      isLoading,
      loadingText = 'Loading...',
      placeholder,
      isDisabled,
      isOptionDisabled,
      isSearchable,
      onSelect,
      isMulti,
      onBlur,
      name,
      className,
      loadAsyncValues,
      debounceMs,
      noOptionsMessage = 'No results found',
      menuFooterText,
      isCreatable,
      ...rest
    },
    ref
  ) => {
    const commonProps:
      | GenericAsyncSelectComponentProps
      | CreatableComponentProps
      | SelectComponentProps = {
      menuIsOpen,
      initialValues,
      defaultValue,
      value,
      isClearable,
      placeholder: isLoading === true ? loadingText : placeholder,
      isDisabled: isLoading === true || isDisabled === true,
      onSelect,
      isMulti,
      isOptionDisabled,
      onBlur,
      name,
      styles: getSelectStyles(feedback?.variant),
      menuFooterText
    }

    return (
      <InputWrapper
        className={className}
        label={label}
        hint={hint}
        feedback={feedback}
        name={name}
        {...rest}
      >
        {loadAsyncValues != null && isCreatable === true ? (
          <AsyncCreatableSelectComponent
            {...commonProps}
            ref={ref}
            inputId={name}
            loadAsyncValues={loadAsyncValues}
            debounceMs={debounceMs}
            noOptionsMessage={noOptionsMessage}
          />
        ) : loadAsyncValues != null ? (
          <AsyncSelectComponent
            {...commonProps}
            ref={ref}
            inputId={name}
            loadAsyncValues={loadAsyncValues}
            debounceMs={debounceMs}
            noOptionsMessage={noOptionsMessage}
          />
        ) : isCreatable === true ? (
          <CreatableComponent
            {...commonProps}
            ref={ref}
            inputId={name}
            isSearchable={isSearchable}
          />
        ) : (
          <SelectComponent
            {...commonProps}
            ref={ref}
            inputId={name}
            isSearchable={isSearchable}
          />
        )}
      </InputWrapper>
    )
  }
)

InputSelect.displayName = 'InputSelect'
