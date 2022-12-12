import { FocusEventHandler, lazy, Suspense } from 'react'
import { MultiValue, SingleValue } from 'react-select'
import { SkeletonItem } from '../Skeleton'
import selectStyles from './styles'

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

type PossibileSelectValue = MultiValue<SelectValue> | SingleValue<SelectValue>

export interface InputSelectProps {
  initialValues: GroupedSelectValues | SelectValue[]
  defaultValue?: SelectValue | SelectValue[]
  placeholder?: string
  isLoading?: boolean
  loadingText?: string
  isClearable?: boolean
  isDisabled?: boolean
  isSearchable?: boolean
  isMulti?: boolean
  onSelect: (value: PossibileSelectValue) => void
  loadOptions?: (
    inputValue: string
  ) => Promise<GroupedSelectValues | SelectValue[]>
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
    </div>
  )
}

export function isSingleValueSelected(
  value: PossibileSelectValue
): value is SelectValue {
  return value != null && !Array.isArray(value)
}
