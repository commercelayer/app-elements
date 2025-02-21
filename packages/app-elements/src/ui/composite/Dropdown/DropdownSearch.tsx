import { Icon } from '#ui/atoms/Icon'
import cn from 'classnames'
import debounce from 'lodash-es/debounce'
import { forwardRef, type JSX, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface DropdownSearchProps {
  /**
   * Callback triggered when the user types in the search input.
   * By default, this callback is debounced by 500ms.
   */
  onSearch: (hint: string) => void
  /**
   * Debounce time in ms for the onSearch callback. Set to 0 to disable debounce.
   * @default 500
   */
  debounceMs?: number
  /**
   * Placeholder text for the input element
   */
  placeholder?: string
  /**
   * Enable auto focus on the input element
   */
  autoFocus?: boolean
}

/**
 * This component renders an input as dropdown menu item with debounced `onSearch` callback.
 */
export const DropdownSearch = forwardRef<HTMLInputElement, DropdownSearchProps>(
  (
    { onSearch, debounceMs = 500, placeholder, autoFocus, ...rest },
    ref
  ): JSX.Element => {
    const [searchValue, setSearchValue] = useState('')
    const { t } = useTranslation()

    const debouncedOnSearch = useCallback(debounce(onSearch, debounceMs), [
      onSearch
    ])

    useEffect(
      function unmountDebounce() {
        return () => {
          debouncedOnSearch?.cancel()
        }
      },
      [debouncedOnSearch]
    )

    return (
      <div className='relative w-full' {...rest}>
        <Icon
          name='magnifyingGlass'
          weight='bold'
          className='absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 pointer-events-none select-none text-sm '
        />
        <input
          className={cn(
            'pl-10 pr-8 py-2 bg-transparent min-w-max font-semibold text-sm placeholder:text-gray-400 !ring-0'
          )}
          placeholder={placeholder ?? t('common.search')}
          value={searchValue}
          onChange={({ currentTarget: { value } }) => {
            setSearchValue(value)
            debouncedOnSearch(value)
          }}
          ref={ref}
          autoFocus={autoFocus}
        />
      </div>
    )
  }
)

DropdownSearch.displayName = 'DropdownSearch'
