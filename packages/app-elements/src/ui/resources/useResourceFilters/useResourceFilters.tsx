import type { ListableResourceType, QueryFilter } from "@commercelayer/sdk"
import { type JSX, useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useTokenProvider } from "#providers/TokenProvider"
import { Spacer } from "#ui/atoms/Spacer"
import {
  type UseResourceListConfig,
  useResourceList,
} from "#ui/resources/useResourceList"
import type { ResourceListProps } from "#ui/resources/useResourceList/useResourceList"
import { makeFilterAdapters } from "./adapters"
import {
  FiltersForm as FiltersFormComponent,
  type FiltersFormProps,
} from "./FiltersForm"
import { FiltersNav, type FiltersNavProps } from "./FiltersNav"
import { FiltersSearchBar } from "./FiltersSearchBar"
import type { FiltersInstructions } from "./types"
import { getActiveFilterCountFromUrl } from "./utils"

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
    props: Pick<FiltersNavProps, "onFilterClick" | "queryString"> & {
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
      /**
       * Milliseconds to wait before triggering the search bar callback
       * @default 500
       */
      searchBarDebounceMs?: number
    },
  ) => React.ReactNode
  /**
   * Form component with filters fields based on provided instructions
   */
  FiltersForm: (props: Pick<FiltersFormProps, "onSubmit">) => React.ReactNode
  /**
   * Filtered ResourceList component based on current active filters
   */
  FilteredList: <TResource extends ListableResourceType>(
    props: Omit<UseResourceListConfig<TResource>, "query" | "metricsQuery"> &
      ResourceListProps<TResource> & {
        query?: Omit<
          NonNullable<UseResourceListConfig<TResource>["query"]>,
          "filters"
        >
        metricsQuery?: Omit<
          NonNullable<UseResourceListConfig<TResource>["metricsQuery"]>,
          "filter"
        > & {
          /** Filters need to be configured within the `useResourceFilters` options. */
          filters?: never
        }
        hideTitle?: boolean
      },
  ) => React.ReactNode
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
  predicateWhitelist = [],
}: UseResourceFiltersConfig): UseResourceFiltersHook {
  const { user } = useTokenProvider()
  const [sdkFilters, setSdkFilters] = useState<QueryFilter>()
  const queryString = window.location.search

  const adapters = makeFilterAdapters({
    instructions,
    predicateWhitelist,
  })
  const { validInstructions } = adapters

  // url query string can contain a viewTitle to be used in the page
  const viewTitle = useMemo<string | undefined>(() => {
    return adapters.adaptUrlQueryToFormValues({
      queryString,
    }).viewTitle
  }, [queryString])

  const hasActiveFilter = useMemo(
    () =>
      getActiveFilterCountFromUrl({
        includeTextSearch: true,
        instructions: validInstructions,
        queryString,
      }) > 0,
    [validInstructions, queryString],
  )

  const FilteredList = useMemo(
    () =>
      makeFilteredList({
        sdkFilters,
        adapters,
      }),
    [sdkFilters],
  )

  const SearchWithNav = useMemo(() => {
    return makeSearchWithNav({
      validInstructions,
      predicateWhitelist,
    })
  }, [JSON.stringify(validInstructions)])

  const FiltersForm: UseResourceFiltersHook["FiltersForm"] = useCallback(
    ({ onSubmit }): JSX.Element => {
      return (
        <FiltersFormComponent
          instructions={validInstructions}
          predicateWhitelist={predicateWhitelist}
          onSubmit={onSubmit}
        />
      )
    },
    [instructions],
  )

  useEffect(
    function updateSdkQueryFilterOnSearchChange() {
      setSdkFilters(
        adapters.adaptUrlQueryToSdk({
          queryString,
          timezone: user?.timezone,
        }),
      )
    },
    [queryString],
  )

  return {
    adapters,
    sdkFilters,
    hasActiveFilter,
    SearchWithNav,
    FiltersForm,
    FilteredList,
    viewTitle,
  }
}

// internal implementation of the ResourceList component exposed from the useResourceList hook
function ResourceListComponent<TResource extends ListableResourceType>({
  metricsQuery,
  type,
  query,
  ...listProps
}: UseResourceListConfig<TResource> &
  ResourceListProps<TResource>): JSX.Element {
  const hookConfig: UseResourceListConfig<TResource> = {
    type,
    query,
    metricsQuery,
  }
  const { ResourceList } = useResourceList(hookConfig)

  return <ResourceList {...listProps} />
}

const makeFilteredList: (options: {
  sdkFilters: QueryFilter | undefined
  adapters: ReturnType<typeof makeFilterAdapters>
}) => UseResourceFiltersHook["FilteredList"] =
  ({ sdkFilters, adapters }) =>
  ({ type, query, metricsQuery, hideTitle, ...resourceListProps }) => {
    const { t } = useTranslation()

    if (resourceListProps == null) {
      return <div>resourceListProps not defined</div>
    }
    if (sdkFilters == null) {
      return null
    }

    return (
      <ResourceListComponent
        {...resourceListProps}
        type={type}
        title={hideTitle === true ? undefined : t("common.all")}
        query={{
          ...query,
          filters: sdkFilters,
        }}
        metricsQuery={
          metricsQuery == null
            ? undefined
            : {
                ...metricsQuery,
                filter: adapters.adaptSdkToMetrics({
                  sdkFilters,
                  resourceType: type,
                }),
              }
        }
      />
    )
  }

const makeSearchWithNav: (_options: {
  validInstructions: FiltersInstructions
  predicateWhitelist: string[]
}) => UseResourceFiltersHook["SearchWithNav"] =
  ({ validInstructions, predicateWhitelist }) =>
  ({
    onFilterClick,
    onUpdate,
    searchBarPlaceholder,
    searchBarDebounceMs,
    hideSearchBar,
    hideFiltersNav,
    // we need this value as prop to avoid re-rendering the component and losing the focus on searchbar
    // so we can't reuse the `queryString` variable we have in the hook scope
    queryString: queryStringProp,
  }) => {
    const { t } = useTranslation()

    if (hideSearchBar === true && hideFiltersNav === true) {
      return null
    }

    return (
      <Spacer top="6" bottom="14">
        {hideSearchBar === true ? null : (
          <Spacer bottom="2">
            <FiltersSearchBar
              queryString={queryStringProp}
              placeholder={searchBarPlaceholder ?? t("common.search")}
              debounceMs={searchBarDebounceMs}
              instructions={validInstructions}
              onUpdate={onUpdate}
              predicateWhitelist={predicateWhitelist}
            />
          </Spacer>
        )}

        {hideFiltersNav === true ? null : (
          <FiltersNav
            queryString={queryStringProp}
            instructions={validInstructions}
            onFilterClick={onFilterClick}
            onUpdate={onUpdate}
            predicateWhitelist={predicateWhitelist}
          />
        )}
      </Spacer>
    )
  }
