import { formatResourceName } from '#helpers/resources'
import { useTokenProvider } from '#providers/TokenProvider'
import { Spacer } from '#ui/atoms/Spacer'
import {
  ResourceList,
  type ResourceListProps
} from '#ui/resources/ResourceList'
import { type ResourceListItemTemplate } from '#ui/resources/ResourceList/ResourceList'
import { type ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import { type QueryFilter } from '@commercelayer/sdk/lib/cjs/query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  FiltersForm as FiltersFormComponent,
  type FiltersFormProps
} from './FiltersForm'
import { FiltersNav, type FiltersNavProps } from './FiltersNav'
import { FiltersSearchBar } from './FiltersSearchBar'
import { makeFilterAdapters } from './adapters'
import { type FiltersInstructions } from './types'
import { getActiveFilterCountFromUrl } from './utils'

interface UseResourceFiltersConfig {
  /**
   * Array of instruction items to build the filters behaviors
   */
  instructions: FiltersInstructions
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
  predicateWhitelist?: string[]
}

interface UseResourceFiltersHook {
  /**
   * Helper methods to transform filters from/to url query string, sdk and form values
   */
  adapters: ReturnType<typeof makeFilterAdapters>
  /**
   * Search bar component with filters navigation buttons
   */
  SearchWithNav: (
    props: Pick<FiltersNavProps, 'onFilterClick' | 'queryString'> & {
      /**
       * Callback triggered when user interact with search bar or remove a filter from the buttons
       */
      onUpdate: (newQueryString: string) => void
      hideSearchBar?: boolean
      hideFiltersNav?: boolean
      /**
       * Placeholder text for the search bar
       * @default 'Search...'
       */
      searchBarPlaceholder?: string
    }
  ) => JSX.Element
  /**
   * Form component with filters fields based on provided instructions
   */
  FiltersForm: (props: Pick<FiltersFormProps, 'onSubmit'>) => JSX.Element
  /**
   * Filtered ResourceList component based on current active filters
   */
  FilteredList: <TResource extends ListableResourceType>(
    props: Pick<
      ResourceListProps<TResource>,
      'type' | 'query' | 'emptyState' | 'actionButton'
    > &
      ResourceListItemTemplate<TResource> & {
        hideTitle?: boolean
      }
  ) => JSX.Element
  /**
   * SDK filters object to be used in the sdk query
   */
  sdkFilters: QueryFilter | undefined
  /**
   * Returns `true` if there is at least one filter activated by the user.
   * This does not include the text filter or presets, but only ones manually set by the user.
   */
  hasActiveFilter: boolean
  /**
   * view title to be used in the page
   */
  viewTitle?: string
}

export function useResourceFilters({
  instructions,
  predicateWhitelist = []
}: UseResourceFiltersConfig): UseResourceFiltersHook {
  const { user } = useTokenProvider()
  const [sdkFilters, setSdkFilters] = useState<QueryFilter>()
  const queryString = window.location.search

  const adapters = makeFilterAdapters({
    instructions,
    predicateWhitelist
  })
  const { validInstructions } = adapters

  // url query string can contain a viewTitle to be used in the page
  const viewTitle = useMemo<string | undefined>(() => {
    return adapters.adaptUrlQueryToFormValues({
      queryString
    }).viewTitle
  }, [queryString])

  const hasActiveFilter = useMemo(
    () =>
      getActiveFilterCountFromUrl({
        includeTextSearch: true,
        instructions: validInstructions,
        queryString
      }) > 0,
    [validInstructions, queryString]
  )

  const FilteredList: UseResourceFiltersHook['FilteredList'] = useCallback(
    ({ hideTitle, ...listProps }) => {
      if (listProps == null) {
        return <div>listProps not defined</div>
      }
      if (sdkFilters == null) {
        return <></>
      }
      return (
        <ResourceList
          {...listProps}
          title={
            hideTitle === true
              ? undefined
              : hasActiveFilter
                ? 'Results'
                : `All ${formatResourceName({
                    resource: listProps.type,
                    count: 'plural'
                  })}`
          }
          query={{
            ...listProps.query,
            filters: { ...sdkFilters, ...listProps.query?.filters }
          }}
        />
      )
    },
    [sdkFilters]
  )

  const SearchWithNav: UseResourceFiltersHook['SearchWithNav'] = useCallback(
    ({
      onFilterClick,
      onUpdate,
      searchBarPlaceholder,
      // we need this value as prop to avoid re-rendering the component and losing the focus on searchbar
      // so we can't reuse the `queryString` variable we have in the hook scope
      queryString: queryStringProp,
      hideSearchBar,
      hideFiltersNav
    }): JSX.Element => {
      if (hideSearchBar === true && hideFiltersNav === true) {
        return <></>
      }

      return (
        <Spacer top='4' bottom='14'>
          {hideSearchBar === true ? null : (
            <Spacer bottom='2'>
              <FiltersSearchBar
                placeholder={searchBarPlaceholder ?? 'Search...'}
                instructions={validInstructions}
                onUpdate={onUpdate}
                queryString={queryStringProp}
                predicateWhitelist={predicateWhitelist}
              />
            </Spacer>
          )}

          {hideFiltersNav === true ? null : (
            <FiltersNav
              instructions={validInstructions}
              onFilterClick={onFilterClick}
              onUpdate={onUpdate}
              queryString={queryStringProp}
              predicateWhitelist={predicateWhitelist}
            />
          )}
        </Spacer>
      )
    },
    [instructions]
  )

  const FiltersForm: UseResourceFiltersHook['FiltersForm'] = useCallback(
    ({ onSubmit }): JSX.Element => {
      return (
        <FiltersFormComponent
          instructions={validInstructions}
          predicateWhitelist={predicateWhitelist}
          onSubmit={onSubmit}
        />
      )
    },
    [instructions]
  )

  useEffect(
    function updateSdkQueryFilterOnSearchChange() {
      setSdkFilters(
        adapters.adaptUrlQueryToSdk({
          queryString,
          timezone: user?.timezone
        })
      )
    },
    [queryString]
  )

  return {
    adapters,
    sdkFilters,
    hasActiveFilter,
    SearchWithNav,
    FiltersForm,
    FilteredList,
    viewTitle
  }
}
