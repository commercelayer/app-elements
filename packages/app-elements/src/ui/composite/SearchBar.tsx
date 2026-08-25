import cn from "classnames"
import debounce from "lodash-es/debounce"
import isEmpty from "lodash-es/isEmpty"
import { forwardRef, useCallback, useEffect, useRef, useState } from "react"
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
  /**
   * Variant of the search bar
   */
  variant?: "outline"
  /**
   * Number of characters the user has to type before a search is triggered.
   *
   * Leading and trailing `*` are not counted: where they act as wildcards they
   * stand in for the rest of the term rather than being part of it, so `fo*` is
   * two characters and does not reach a threshold of three.
   *
   * Below the threshold the search reads as empty, so the list shows unfiltered
   * results instead of the ones from the last term long enough to run.
   *
   * A single character matches most of any collection, so the request it costs
   * buys nothing. Pass `0` to search on every keystroke anyway.
   * @default 2
   */
  minSearchLength?: number
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
      variant,
      minSearchLength = 2,
      ...rest
    },
    ref,
  ) => {
    const [searchValue, setSearchValue] = useState("")
    // what the consumer was last told, so a term that stays below the threshold
    // does not ask for the same unfiltered list on every keystroke
    const lastSearchedRef = useRef<string | null>(null)

    const search = useCallback(
      (value: string) => {
        const searchable =
          countSearchableCharacters(value) >= minSearchLength ? value : ""

        if (lastSearchedRef.current === searchable) {
          return
        }

        lastSearchedRef.current = searchable
        onSearch(searchable)
      },
      [minSearchLength, onSearch],
    )

    const debouncedOnSearch = useCallback(debounce(search, debounceMs), [
      search,
    ])

    useEffect(() => {
      setSearchValue(initialValue)
      lastSearchedRef.current = initialValue
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
            className={cn(
              "absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 pointer-events-none select-none",
              {
                "text-xl": variant !== "outline",
                "text-base": variant !== "outline",
              },
            )}
          />
          <input
            className={cn(
              "rounded-[8px] font-medium w-full px-11 transition placeholder:text-gray-400",
              "ring-0 outline-0",
              "focus:caret-primary focus:bg-white",
              {
                "bg-gray-100 border-0 shadow-none py-2": variant !== "outline", // default variant
                "bg-white text-sm py-1.5 shadow-[inset_0_0_0_1px_rgb(229,229,229)]":
                  variant === "outline", // outline variant with explicit inset box-shadow border
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
                lastSearchedRef.current = ""
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

/**
 * How many characters of a search term count towards `minSearchLength`.
 *
 * Wildcards at either end are stripped: in the apps that support them a
 * trailing `*` is what makes the term a prefix search, so counting it would let
 * `fo*` pass a threshold that `fo` does not.
 */
function countSearchableCharacters(value: string): number {
  return value
    .trim()
    .replace(/^\*+|\*+$/g, "")
    .trim().length
}
