import {
  InputWrapper,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import { type FocusEventHandler } from 'react'
import { type MultiValue, type Options, type SingleValue } from 'react-select'
import { AsyncSelectComponent } from './AsyncComponent'
import { SelectComponent } from './SelectComponent'
import { getSelectStyles } from './styles'

export type GroupedSelectValues = Array<{
  label: string
  options: SelectValue[]
}>

export interface SelectValue {
  value: string | number
  label: string
  meta?: Record<string, any>
}

export type PossibleSelectValue =
  | MultiValue<SelectValue>
  | SingleValue<SelectValue>

export interface InputSelectProps extends InputWrapperBaseProps {
  /**
   * Initial values to populate the select options. It can be a flat array of values or a grouped array.
   */
  initialValues: GroupedSelectValues | SelectValue[]
  /**
   * Selected value or values, in case of `isMulti`
   */
  defaultValue?: SelectValue | SelectValue[]
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
    option: SelectValue,
    selectValue: Options<SelectValue>
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
  ) => Promise<GroupedSelectValues | SelectValue[]>
  /**
   * Debounce time in milliseconds for async search.
   * It only works when `loadAsyncValues` is provided
   */
  debounceMs?: number
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
export const InputSelect: React.FC<InputSelectProps> = ({
  label,
  hint,
  feedback,
  menuIsOpen,
  initialValues,
  defaultValue,
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
  ...rest
}) => {
  return (
    <InputWrapper
      className={className}
      label={label}
      hint={hint}
      feedback={feedback}
      name={name}
      {...rest}
    >
      {loadAsyncValues != null ? (
        <AsyncSelectComponent
          menuIsOpen={menuIsOpen}
          initialValues={initialValues}
          defaultValue={defaultValue}
          isClearable={isClearable}
          placeholder={isLoading === true ? loadingText : placeholder}
          isDisabled={isLoading === true || isDisabled === true}
          onSelect={onSelect}
          isMulti={isMulti}
          onBlur={onBlur}
          name={name}
          noOptionsMessage={noOptionsMessage}
          loadAsyncValues={loadAsyncValues}
          styles={getSelectStyles(feedback?.variant)}
          debounceMs={debounceMs}
          isOptionDisabled={isOptionDisabled}
        />
      ) : (
        <SelectComponent
          menuIsOpen={menuIsOpen}
          initialValues={initialValues}
          defaultValue={defaultValue}
          isClearable={isClearable}
          placeholder={isLoading === true ? loadingText : placeholder}
          isDisabled={isLoading === true || isDisabled === true}
          isSearchable={isSearchable}
          onSelect={onSelect}
          isMulti={isMulti}
          isOptionDisabled={isOptionDisabled}
          onBlur={onBlur}
          name={name}
          styles={getSelectStyles(feedback?.variant)}
        />
      )}
    </InputWrapper>
  )
}

InputSelect.displayName = 'InputSelect'
