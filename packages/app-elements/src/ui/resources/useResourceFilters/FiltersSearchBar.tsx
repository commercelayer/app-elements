import castArray from "lodash-es/castArray"
import isEmpty from "lodash-es/isEmpty"
import type { JSX } from "react"
import { t } from "#providers/I18NProvider"
import { SearchBar, type SearchBarProps } from "#ui/composite/SearchBar"
import { makeFilterAdapters } from "./adapters"
import type { FiltersInstructions } from "./types"

export interface FilterSearchBarProps
  extends Pick<SearchBarProps, "placeholder" | "debounceMs"> {
  /**
   * Array of instruction items to build the filters behaviors
   */
  instructions: FiltersInstructions
  /**
   * Callback function triggered when user interacts with the search input.
   * Implemented function should update the url query string / search params,
   * based on the new queryString received as argument.
   */
  onUpdate: (queryString: string) => void
  /**
   * Url query string to be parsed.
   * It must be "reactive", so most of the time it should come for router.
   */
  queryString: string
  /**
   * By default, we strip out all filters that are not part of the `instructions` array.
   * The option `predicateWhitelist` is used to whitelist a set of predicates that you want to use as filters.
   *
   * @example
   * ```jsx
   * useResourceFilters({
   *   instructions,
   *   predicateWhitelist: [ 'starts_at_lteq', 'expires_at_gteq', 'starts_at_gt', 'expires_at_lt' ]
   * })
   * ```
   */
  predicateWhitelist: string[]
}

function FiltersSearchBar({
  instructions,
  placeholder,
  onUpdate,
  queryString,
  predicateWhitelist,
  debounceMs,
}: FilterSearchBarProps): JSX.Element {
  const { adaptUrlQueryToFormValues, adaptFormValuesToUrlQuery } =
    makeFilterAdapters({
      instructions,
      predicateWhitelist,
    })

  const textPredicate = instructions.find(
    (item) =>
      item.type === "textSearch" && item.render.component === "searchBar",
  )?.sdk.predicate

  const updateTextFilter = (hint?: string): void => {
    if (textPredicate == null) {
      return
    }

    const currentFilters = adaptUrlQueryToFormValues({
      queryString,
    })

    const newQueryString = adaptFormValuesToUrlQuery({
      formValues: {
        ...currentFilters,
        [textPredicate]: isEmpty(hint?.trim()) ? undefined : hint,
      },
    })

    onUpdate(newQueryString)
  }

  if (textPredicate == null) {
    return <div>{t("common.no_textsearch_filter_set")}</div>
  }

  const textPredicateValue = adaptUrlQueryToFormValues({ queryString })[
    textPredicate
  ]
  const safeInitialValue = castArray(textPredicateValue)[0]?.toString()

  return (
    <SearchBar
      placeholder={placeholder}
      initialValue={safeInitialValue}
      onClear={updateTextFilter}
      onSearch={updateTextFilter}
      autoFocus={safeInitialValue !== undefined && safeInitialValue.length > 0}
      debounceMs={debounceMs}
    />
  )
}

FiltersSearchBar.displayName = "FiltersSearchBar"
export { FiltersSearchBar }
