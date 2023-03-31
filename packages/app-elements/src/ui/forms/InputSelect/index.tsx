import { FocusEventHandler, lazy, Suspense } from 'react'
import { MultiValue, SingleValue } from 'react-select'
import { SkeletonItem } from '#ui/atoms/Skeleton'
import { getSelectStyles } from './styles'
import { InputWrapper } from '../InputWrapper'
import { InputWrapperBaseProps } from '#ui/forms/InputWrapper'
import get from 'lodash/get'

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
  onSelect: (value: PossibleSelectValue) => void
  onBlur?: FocusEventHandler<HTMLInputElement>
  name?: string
  menuIsOpen?: boolean
  noOptionsMessage?: string
  className?: string
  loadAsyncValues?: (
    inputValue: string
  ) => Promise<GroupedSelectValues | SelectValue[]>
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
  isSearchable,
  onSelect,
  isMulti,
  onBlur,
  name,
  className,
  loadAsyncValues,
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
 * Helper function to extract only a specific property from the `SelectValue`
 * @param selectedValue possible value returned from select component
 * @param path path.to.property. Default is `value`
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

InputSelect.displayName = 'InputSelect'
export { InputSelect }
