import { SearchBar } from '#ui/composite/SearchBar'
import castArray from 'lodash/castArray'
import isEmpty from 'lodash/isEmpty'
import { makeFilterAdapters } from './adapters'
import { type FiltersInstructions } from './types'

export interface FilterSearchBarProps {
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
   * Input placeholder
   */
  placeholder?: string
}

function FiltersSearchBar({
  instructions,
  placeholder,
  onUpdate,
  queryString
}: FilterSearchBarProps): JSX.Element {
  const { adaptUrlQueryToFormValues, adaptFormValuesToUrlQuery } =
    makeFilterAdapters({
      instructions
    })

  const textPredicate = instructions.find(
    (item) =>
      item.type === 'textSearch' && item.render.component === 'searchBar'
  )?.sdk.predicate

  const updateTextFilter = (hint?: string): void => {
    if (textPredicate == null) {
      return
    }

    const currentFilters = adaptUrlQueryToFormValues({
      queryString
    })

    const newQueryString = adaptFormValuesToUrlQuery({
      formValues: {
        ...currentFilters,
        [textPredicate]: isEmpty(hint?.trim()) ? undefined : hint
      }
    })

    onUpdate(newQueryString)
  }

  if (textPredicate == null) {
    return <div>No textSearch filter set</div>
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
    />
  )
}

FiltersSearchBar.displayName = 'FiltersSearchBar'
export { FiltersSearchBar }
