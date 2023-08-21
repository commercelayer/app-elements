import { Icon } from '#ui/atoms/Icon'
import cn from 'classnames'
import debounce from 'lodash/debounce'
import isEmpty from 'lodash/isEmpty'
import { useCallback, useEffect, useState } from 'react'

interface SearchBarProps {
  /**
   * Initial value of the search bar. When changed, the search bar will be updated.
   */
  initialValue?: string
  /**
   * Callback triggered when the user types in the search bar, it returns the current value of the search bar.
   * By default, this callback is debounced by 500ms.
   */
  onSearch: (hint: string) => void
  /**
   * Callback triggered when the user clicks on the clear button.
   */
  onClear?: () => void
  /**
   * Debounce time in ms for the onSearch callback. Set to 0 to disable debounce.
   * @default 500
   */
  debounceMs?: number
  /**
   * CSS classes
   */
  className?: string
  /**
   * Placeholder text for the input element
   */
  placeholder?: string
}

function SearchBar({
  initialValue = '',
  onSearch,
  onClear,
  debounceMs = 500,
  className,
  placeholder,
  ...rest
}: SearchBarProps): JSX.Element {
  const [searchValue, setSearchValue] = useState('')

  const debouncedOnSearch = useCallback(debounce(onSearch, debounceMs), [
    onSearch
  ])

  useEffect(() => {
    setSearchValue(initialValue)
  }, [initialValue])

  useEffect(
    function unmountDebounce() {
      return () => {
        debouncedOnSearch?.cancel()
      }
    },
    [debouncedOnSearch]
  )

  return (
    <div
      data-test-id='SearchBar'
      className={cn('relative w-full', className)}
      {...rest}
    >
      <Icon
        name='magnifyingGlass'
        className='absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 pointer-events-none select-none text-[20px]'
      />
      <input
        className={cn(
          'rounded px-11 py-2 bg-gray-100 font-medium w-full transition placeholder:text-gray-400',
          'shadow-none !outline-0 !border-0 !ring-0',
          '!focus:shadow-none !active:shadow-none focus:caret-primary'
        )}
        data-test-id='SearchBar-input'
        placeholder={placeholder}
        value={searchValue}
        onChange={({ currentTarget: { value } }) => {
          setSearchValue(value)
          debouncedOnSearch(value)
        }}
      />

      {onClear != null && !isEmpty(searchValue) ? (
        <button
          data-test-id='SearchBar-clear'
          className={cn(
            'flex items-center absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400',
            'rounded outline-none ring-0 border-0',
            'focus-within:shadow-focus focus:text-black'
          )}
          aria-label='Clear text'
          onClick={() => {
            setSearchValue('')
            onClear()
          }}
        >
          <Icon name='x' className='text-[20px]' />
        </button>
      ) : null}
    </div>
  )
}

SearchBar.displayName = 'SearchBar'
export { SearchBar }
