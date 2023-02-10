import { FocusEventHandler, lazy, Suspense } from 'react'
import { MultiValue, SingleValue } from 'react-select'
import { SkeletonItem } from '#ui/atoms/Skeleton'
import selectStyles from './styles'
import Label from '../Label'
import InputHelperText from '../InputHelperText'

const AsyncSelectComponent = lazy(async () => await import('./Async'))
const SelectComponent = lazy(async () => await import('./Select'))

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

export interface InputSelectProps {
  label?: string
  helperText?: React.ReactNode
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

export function InputSelect({
  label,
  helperText,
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
    <div className={className} {...rest}>
      {label != null && <Label gap>{label}</Label>}
      {loadAsyncValues != null ? (
        <Suspense fallback={<SkeletonItem className='h-11 w-full' />}>
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
            styles={selectStyles}
          />
        </Suspense>
      ) : (
        <Suspense fallback={<SkeletonItem className='h-11 w-full' />}>
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
            onBlur={onBlur}
            name={name}
            styles={selectStyles}
          />
        </Suspense>
      )}
      {helperText != null && (
        <InputHelperText variant='light' className='mt-1'>
          {helperText}
        </InputHelperText>
      )}
    </div>
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
 * Helper function to extract only the `value` from the  `SelectValue`
 * @param selectedValue possible value returned from select component
 * @returns a string or an array of strings.
 * Examples:
 * ```
 * {value: 'ABCD', label: 'T-Shirt XL'}
 * // returns 'ABCD'
 *
 * [
 *   {value: 'ABCD', label: 'T-Shirt M'},
 *   {value: '1234', label: 'T-Shirt XL'},
 * ]
 * // returns ['ABCD', '1234']
 * ```
 */
export function flatSelectValues(
  selectedValue: PossibleSelectValue
): null | string | Array<string | number> {
  if (selectedValue == null) {
    return null
  }

  return isSingleValueSelected(selectedValue)
    ? `${selectedValue.value}`
    : selectedValue.map((o) => o.value)
}

export default InputSelect
