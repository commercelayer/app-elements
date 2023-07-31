import { SkeletonItem } from '#ui/atoms/Skeleton'
import { type InputWrapperBaseProps } from '#ui/internals/InputWrapper'
import get from 'lodash/get'
import { Suspense, lazy, type FocusEventHandler } from 'react'
import { type MultiValue, type SingleValue } from 'react-select'
import { InputWrapper } from '../../internals/InputWrapper'
import { getSelectStyles } from './styles'

const LazyAsyncSelect = lazy(
  async () =>
    await import('./Async').then((module) => ({
      default: module.AsyncSelectComponent
    }))
)
const LazySelectComponent = lazy(
  async () =>
    await import('./Select').then((module) => ({
      default: module.SelectComponent
    }))
)

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
  initialValues: GroupedSelectValues | SelectValue[]
  defaultValue?: SelectValue | SelectValue[]
  placeholder?: string
  isLoading?: boolean
  loadingText?: string
  isClearable?: boolean
  isDisabled?: boolean
  isSearchable?: boolean
  isMulti?: boolean
  isOptionDisabled?: () => boolean
  onSelect: (value: PossibleSelectValue) => void
  onBlur?: FocusEventHandler<HTMLInputElement>
  name?: string
  menuIsOpen?: boolean
  noOptionsMessage?: string
  className?: string
  /**
   * Function to load async values on search
   */
  loadAsyncValues?: (
    inputValue: string
  ) => Promise<GroupedSelectValues | SelectValue[]>
  /**
   * Debounce time in milliseconds for async search
   * Only works when `loadAsyncValues` is provided
   */
  debounceMs?: number
}

function InputSelect({
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
}: InputSelectProps): JSX.Element {
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
        <Suspense fallback={<SkeletonItem className='h-11 w-full' />}>
          <LazyAsyncSelect
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
        </Suspense>
      ) : (
        <Suspense fallback={<SkeletonItem className='h-11 w-full' />}>
          <LazySelectComponent
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
        </Suspense>
      )}
    </InputWrapper>
  )
}

/**
 * Helper function to understand and refine type of a single selected value
 * @param selectedValue possible value returned from select component
 * @returns true if selected value is single, from this point TypeScript will treat this as `SelectValue` type
 */
export function isSingleValueSelected(
  selectedValue: PossibleSelectValue
): selectedValue is SelectValue {
  return selectedValue != null && !Array.isArray(selectedValue)
}

/**
 * Type-guard to check if prop `initialValues` is a GroupedSelectValues or SelectValue
 */
export function isGroupedSelectValues(
  initialValues?: GroupedSelectValues | SelectValue[]
): initialValues is GroupedSelectValues {
  if (initialValues == null || initialValues.length === 0) {
    return false
  }
  return (initialValues as []).every((v) => 'options' in v)
}

/**
 * Helper function to extract only a specific property from the `SelectValue`
 * @param selectedValue possible value returned from select component
 * @param pathToValue optional path.to.property. Default is `value`
 * @returns a string or an array of strings.
 * Examples:
 * ```
 * flatSelectValues({value: 'ABCD', label: 'T-Shirt XL'})
 * // returns 'ABCD'
 *
 * flatSelectValues([
 *   {value: 'ABCD', label: 'T-Shirt M'},
 *   {value: '1234', label: 'T-Shirt XL'},
 * ], 'label')
 * // returns ['T-Shirt M', 'T-Shirt XL']
 * ```
 */
export function flatSelectValues(
  selectedValue: PossibleSelectValue,
  pathToValue = 'value'
): null | string | Array<string | number> {
  if (selectedValue == null) {
    return selectedValue
  }

  return isSingleValueSelected(selectedValue)
    ? get(selectedValue, pathToValue)
    : selectedValue.map((item) => get(item, pathToValue))
}

/**
 * To be used when storing the flatten value and there is the need
 * to retrieve the `defaultValue` to pass as <InputSelect> prop
 * @param currentValue the current value that is being stored in app state
 * @param initialValues the array of SelectValue objects that should contain the `currentValue`
 * @param pathToValue optional path.to.property. Default is `value`
 * @returns the matched value or values, otherwise undefined.
 */
export function getDefaultValueFromFlatten({
  currentValue,
  initialValues = [],
  pathToValue = 'value'
}: {
  currentValue?: string | Array<string | number> | null
  initialValues?: GroupedSelectValues | SelectValue[]
  pathToValue?: string
}): SelectValue | SelectValue[] | undefined {
  if (currentValue == null) {
    return undefined
  }

  const options = isGroupedSelectValues(initialValues)
    ? initialValues.flatMap((v) => v.options)
    : initialValues

  if (Array.isArray(currentValue)) {
    return options.filter((v) => {
      const valueToCompare = get(v, pathToValue)
      return currentValue.includes(valueToCompare)
    })
  }

  return options.find((v) => {
    return currentValue === get(v, pathToValue)
  })
}

InputSelect.displayName = 'InputSelect'
export { InputSelect }
