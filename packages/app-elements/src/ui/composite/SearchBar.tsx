import cn from "classnames"
import debounce from "lodash-es/debounce"
import isEmpty from "lodash-es/isEmpty"
import { forwardRef, useCallback, useEffect, useState } from "react"
import { t } from "#providers/I18NProvider"
import {
  SkeletonTemplate,
  type SkeletonTemplateProps,
} from "#ui/atoms/SkeletonTemplate"
import { StatusIcon } from "#ui/atoms/StatusIcon"

export interface SearchBarProps
  extends Pick<SkeletonTemplateProps, "isLoading" | "delayMs"> {
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
  /**
   * Enable auto focus on the input element
   */
  autoFocus?: boolean
}

/**
 * This component renders a search bar with a clear button with debounced `onSearch` callback.
 * <span type='info'>In this way the `onSearch` callback will be triggered only when the user stops typing
 * for the specified value of `debounceMs` (default 500ms).</span>
 */
export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      initialValue = "",
      onSearch,
      onClear,
      debounceMs = 500,
      className,
      placeholder,
      autoFocus,
      isLoading,
      delayMs,
      ...rest
    },
    ref,
  ) => {
    const [searchValue, setSearchValue] = useState("")

    const debouncedOnSearch = useCallback(debounce(onSearch, debounceMs), [
      onSearch,
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
      [debouncedOnSearch],
    )

    return (
      <SkeletonTemplate isLoading={isLoading} delayMs={delayMs}>
        <div
          data-testid="SearchBar"
          className={cn("relative w-full", className)}
          {...rest}
        >
          <StatusIcon
            name="magnifyingGlass"
            className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 pointer-events-none select-none text-[20px]"
          />
          <input
            className={cn(
              "rounded px-11 py-2 bg-gray-100 font-medium w-full transition placeholder:text-gray-400",
              "shadow-none ring-0 outline-0 border-0",
              "focus:caret-primary focus:bg-white",
              {
                "animate-pulse bg-gray-50! placeholder:text-gray-50":
                  isLoading === true,
              },
            )}
            data-testid="SearchBar-input"
            placeholder={placeholder}
            value={searchValue}
            onChange={({ currentTarget: { value } }) => {
              setSearchValue(value)
              debouncedOnSearch(value)
            }}
            ref={ref}
            // biome-ignore lint/a11y/noAutofocus: Autofocus is necessary for the search bar to be user-friendly.
            autoFocus={autoFocus}
          />

          {onClear != null && !isEmpty(searchValue) ? (
            <button
              type="button"
              data-testid="SearchBar-clear"
              className={cn(
                "flex items-center absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400",
                "rounded outline-hidden ring-0 border-0",
                "focus-within:shadow-focus focus:text-black",
              )}
              aria-label={t("common.clear_text")}
              onClick={() => {
                setSearchValue("")
                onClear()
              }}
            >
              <StatusIcon name="x" className="text-[20px]" />
            </button>
          ) : null}
        </div>
      </SkeletonTemplate>
    )
  },
)

SearchBar.displayName = "SearchBar"
