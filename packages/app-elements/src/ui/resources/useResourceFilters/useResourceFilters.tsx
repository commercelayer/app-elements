import type { ListableResourceType, QueryFilter } from "@commercelayer/sdk"
import isEqual from "lodash-es/isEqual"
import {
  type JSX,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import { useTranslation } from "react-i18next"
import { useOverlay } from "#hooks/useOverlay"
import { useTokenProvider } from "#providers/TokenProvider"
import { Spacer } from "#ui/atoms/Spacer"
import type { SearchBarProps } from "#ui/composite/SearchBar"
import {
  type UseResourceListConfig,
  useResourceList,
} from "#ui/resources/useResourceList"
import type {
  ResourceListProps,
  UseResourceListReturnWithPagination,
} from "#ui/resources/useResourceList/useResourceList"
import { useResourceTable } from "#ui/resources/useResourceTable"
import type {
  ResourceTableColumn,
  ResourceTableProps,
  ResourceTableSort,
  UseResourceTableConfig,
} from "#ui/resources/useResourceTable/types"
import { makeFilterAdapters } from "./adapters"
import { FiltersBar, type FiltersBarProps } from "./FiltersBar"
import { FiltersDrawer, type FiltersDrawerProps } from "./FiltersDrawer"
import {
  FiltersForm as FiltersFormComponent,
  type FiltersFormProps,
} from "./FiltersForm"
import { FiltersNav, type FiltersNavProps } from "./FiltersNav"
import { FiltersSearchBar } from "./FiltersSearchBar"
import {
  isColumnVisible,
  resolveTableSort,
  type TableColumnEntry,
  type TableSettingsConfig,
  type TableSettingsStore,
  toSortKey,
  useTableSettingsStore,
} from "./tableSettings"
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
  /**
   * Lets the user pick the table sort and the visible columns, from two menus
   * `FiltersBar` renders next to the filters button. The choice is kept in
   * `localStorage`, per organization, app, mode and `listId`, and restored
   * before the first fetch.
   *
   * With this set, `FilteredTable` owns its sort: its `sort`, `onSortChange`
   * and `defaultSort` props are ignored. Columns join the columns menu with
   * `hideable: true`.
   *
   * @example
   * ```jsx
   * useResourceFilters({
   *   instructions,
   *   tableSettings: {
   *     listId: 'orders',
   *     sortOptions: [
   *       { id: 'updated', label: 'Updated', sortBy: 'updated_at', kind: 'date' },
   *     ],
   *     defaultSort: { id: 'updated', direction: 'desc' },
   *   },
   * })
   * ```
   */
  tableSettings?: TableSettingsConfig
}

/** What the hook hands its components when `tableSettings` is set. */
interface TableSettingsContext {
  store: TableSettingsStore
  config: TableSettingsConfig
}

interface UseResourceFiltersHook {
  /**
   * Helper methods to transform filters from/to url query string, sdk and form values
   */
  adapters: ReturnType<typeof makeFilterAdapters>
  /**
   * Search bar with the filters button on the right and the applied filters
   * rendered as removable pills below.
   *
   * Clicking the filters button opens the drawer rendered by `FiltersDrawer`,
   * unless an `onFilterClick` prop is provided.
   *
   * @example
   * ```jsx
   * const { FiltersBar, FiltersDrawer, FilteredTable } = useResourceFilters({ instructions })
   *
   * <FiltersBar queryString={queryString} onUpdate={onUpdate} />
   * <FilteredTable type='orders' columns={columns} />
   * <FiltersDrawer onUpdate={onUpdate} />
   * ```
   */
  FiltersBar: (props: FiltersBarProps) => React.ReactNode
  /**
   * Side drawer with the filters form, opened by the `FiltersBar` filters button.
   * Render it once per page as a sibling of `FiltersBar`.
   */
  FiltersDrawer: (props: FiltersDrawerProps) => React.ReactNode
  /**
   * Search bar component with filters navigation buttons
   *
   * @deprecated Use `FiltersBar` together with `FiltersDrawer` instead, they
   * render the search bar and the filters as pills in the style used by the
   * dashboard. This component will be removed in a future major release.
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
       * Visual variant of the search bar. Use `outline` to match the style used
       * in the dashboard (metrics) pages.
       */
      searchBarVariant?: SearchBarProps["variant"]
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
   * Filtered ResourceTable component based on current active filters.
   * Table sibling of `FilteredList`: renders a column-model data table wired
   * to the active search/filters and pagination.
   */
  FilteredTable: <TResource extends ListableResourceType>(
    props: Omit<UseResourceTableConfig<TResource>, "query" | "metricsQuery"> &
      ResourceTableProps & {
        query?: Omit<
          NonNullable<UseResourceTableConfig<TResource>["query"]>,
          "filters"
        >
        metricsQuery?: Omit<
          NonNullable<UseResourceTableConfig<TResource>["metricsQuery"]>,
          "filter"
        > & {
          /** Filters need to be configured within the `useResourceFilters` options. */
          filter?: never
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
  tableSettings,
}: UseResourceFiltersConfig): UseResourceFiltersHook {
  const { user } = useTokenProvider()
  const tableSettingsStore = useTableSettingsStore(tableSettings)

  // Read at render time by the components below, which keep a stable identity:
  // the config is rebuilt by the caller on every render (and its `sortBy`s can
  // change with the view), the store never is.
  const tableSettingsRef = useRef<TableSettingsContext | undefined>(undefined)
  tableSettingsRef.current =
    tableSettingsStore != null && tableSettings != null
      ? { store: tableSettingsStore, config: tableSettings }
      : undefined
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

  const FilteredTable = useMemo(
    () => makeFilteredTable({ sdkFilters, adapters, tableSettingsRef }),
    [sdkFilters],
  )

  const SearchWithNav = useMemo(() => {
    return makeSearchWithNav({
      validInstructions,
      predicateWhitelist,
    })
  }, [JSON.stringify(validInstructions)])

  const {
    Overlay: FiltersOverlay,
    open: openFiltersDrawer,
    close: closeFiltersDrawer,
  } = useOverlay()

  const FiltersBarComponent = useMemo(
    () =>
      makeFiltersBar({
        validInstructions,
        predicateWhitelist,
        openDrawer: openFiltersDrawer,
        tableSettingsRef,
      }),
    [JSON.stringify(validInstructions), openFiltersDrawer],
  )

  // The overlay component identity flips when the drawer opens and `queryString`
  // changes on every navigation. Reading them from a ref keeps the returned
  // component identity stable, so the drawer content is never remounted while in
  // use, which would discard what the user is filling in.
  const drawerPropsRef = useRef({
    Overlay: FiltersOverlay,
    close: closeFiltersDrawer,
    queryString,
  })
  drawerPropsRef.current = {
    Overlay: FiltersOverlay,
    close: closeFiltersDrawer,
    queryString,
  }

  const FiltersDrawerComponent: UseResourceFiltersHook["FiltersDrawer"] =
    useCallback(
      (props): JSX.Element => (
        <FiltersDrawer
          {...props}
          instructions={validInstructions}
          predicateWhitelist={predicateWhitelist}
          Overlay={drawerPropsRef.current.Overlay}
          close={drawerPropsRef.current.close}
          queryString={drawerPropsRef.current.queryString}
        />
      ),
      [JSON.stringify(validInstructions)],
    )

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
      const nextSdkFilters = adapters.adaptUrlQueryToSdk({
        queryString,
        timezone: user?.timezone,
      })
      // `FilteredList` and `FilteredTable` are memoized on this object, so a new
      // identity is a new component type and React remounts the whole list.
      // The query string carries more than filters (a view title, a page), and
      // those must not blank the rows: keep the previous object whenever the
      // filters it encodes are unchanged, which makes React skip the update.
      setSdkFilters((currentSdkFilters) =>
        isEqual(currentSdkFilters, nextSdkFilters)
          ? currentSdkFilters
          : nextSdkFilters,
      )
    },
    [queryString],
  )

  return {
    adapters,
    sdkFilters,
    hasActiveFilter,
    FiltersBar: FiltersBarComponent,
    FiltersDrawer: FiltersDrawerComponent,
    SearchWithNav,
    FiltersForm,
    FilteredList,
    FilteredTable,
    viewTitle,
  }
}

const makeFiltersBar: (options: {
  validInstructions: FiltersInstructions
  predicateWhitelist: string[]
  openDrawer: () => void
  tableSettingsRef: React.RefObject<TableSettingsContext | undefined>
}) => UseResourceFiltersHook["FiltersBar"] =
  ({ validInstructions, predicateWhitelist, openDrawer, tableSettingsRef }) =>
  (props) => (
    <FiltersBar
      {...props}
      instructions={validInstructions}
      predicateWhitelist={predicateWhitelist}
      openDrawer={openDrawer}
      tableSettings={tableSettingsRef.current}
    />
  )

// internal implementation of the ResourceList component exposed from the useResourceList hook
function ResourceListComponent<TResource extends ListableResourceType>({
  metricsQuery,
  type,
  query,
  filters,
  paginationType = "infinite",
  preProcess,
  ...listProps
}: Omit<UseResourceListConfig<TResource>, "query"> & {
  paginationType?: "infinite" | "pagination"
  query?: Omit<
    NonNullable<UseResourceListConfig<TResource>["query"]>,
    "filters"
  >
  /** The filters the bar computed, merged into the query below. */
  filters?: QueryFilter
} & ResourceListProps<TResource>): JSX.Element {
  const result = useResourceList<TResource>({
    type,
    // the cast is nameable here, where the resource type is in scope: a query
    // spread produces a fresh object type that a deferred lookup will not accept
    query: {
      ...query,
      filters,
    } as UseResourceListConfig<TResource>["query"],
    metricsQuery,
    paginationType,
    preProcess,
  })

  const paginationResult =
    paginationType === "pagination"
      ? (result as UseResourceListReturnWithPagination<TResource>)
      : null

  return (
    <>
      <result.ResourceList {...listProps} />
      {paginationResult != null && <paginationResult.Pagination />}
    </>
  )
}

/**
 * Metrics filter for the current `sdkFilters`, computed once per mount.
 *
 * It must not be rebuilt on every render: with no explicit date filter,
 * `adaptSdkToMetrics` falls back to a range anchored to `new Date()` (truncated
 * to the second). `useResourceList` deep-compares `{ query, metricsQuery }` and
 * refetches from page 1 when it differs, so an unmemoized filter turns any
 * re-render landing in a later second — opening the filters drawer, switching
 * tab — into a full reload of the list.
 */
function useMetricsFilter<TResource extends ListableResourceType>({
  adapters,
  sdkFilters,
  type,
}: {
  adapters: ReturnType<typeof makeFilterAdapters>
  sdkFilters: QueryFilter | undefined
  type: TResource
}): ReturnType<ReturnType<typeof makeFilterAdapters>["adaptSdkToMetrics"]> {
  // Both call sites bail out before rendering when `sdkFilters` is undefined, so
  // the value computed for that case is never sent; an empty object keeps the
  // hook unconditional and its return type free of a null nobody has to handle.
  return useMemo(
    () =>
      adapters.adaptSdkToMetrics({
        sdkFilters: sdkFilters ?? {},
        resourceType: type,
      }),
    [sdkFilters, type],
  )
}

const makeFilteredList: (options: {
  sdkFilters: QueryFilter | undefined
  adapters: ReturnType<typeof makeFilterAdapters>
}) => UseResourceFiltersHook["FilteredList"] =
  ({ sdkFilters, adapters }) =>
  ({ type, query, metricsQuery, hideTitle, ...resourceListProps }) => {
    const { t } = useTranslation()
    const metricsFilter = useMetricsFilter({ adapters, sdkFilters, type })

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
        title={
          hideTitle === true
            ? undefined
            : (resourceListProps.title ?? t("common.all"))
        }
        query={query}
        // merged into the query by the component below, where the resource type is
        // in scope and the merge can be typed
        filters={sdkFilters}
        metricsQuery={
          metricsQuery == null
            ? undefined
            : {
                ...metricsQuery,
                filter: metricsFilter,
              }
        }
      />
    )
  }

// internal implementation of the ResourceTable component exposed from the useResourceTable hook
function ResourceTableComponent<TResource extends ListableResourceType>({
  type,
  columns,
  query,
  filters,
  metricsQuery,
  preProcess,
  paginationType = "pagination",
  paginationScrollTo,
  onRowClick,
  getRowHref,
  sort,
  onSortChange,
  defaultSort,
  showSortIndicator,
  ...tableProps
}: Omit<UseResourceTableConfig<TResource>, "query"> & {
  query?: Omit<
    NonNullable<UseResourceTableConfig<TResource>["query"]>,
    "filters"
  >
  /** The filters the bar computed, merged into the query below. */
  filters?: QueryFilter
} & ResourceTableProps): JSX.Element {
  const { ResourceTable, Pagination } = useResourceTable<TResource>({
    type,
    columns,
    // as in `ResourceListComponent`: the merge is typed here, where the resource
    // type is in scope
    query: {
      ...query,
      filters,
    } as UseResourceTableConfig<TResource>["query"],
    metricsQuery,
    preProcess,
    paginationType,
    paginationScrollTo,
    onRowClick,
    getRowHref,
    sort,
    onSortChange,
    defaultSort,
    showSortIndicator,
  })

  return (
    <>
      <ResourceTable {...tableProps} />
      <Pagination />
    </>
  )
}

const makeFilteredTable: (options: {
  sdkFilters: QueryFilter | undefined
  adapters: ReturnType<typeof makeFilterAdapters>
  tableSettingsRef: React.RefObject<TableSettingsContext | undefined>
}) => UseResourceFiltersHook["FilteredTable"] =
  ({ sdkFilters, adapters, tableSettingsRef }) =>
  ({ type, query, metricsQuery, hideTitle, ...tableProps }) => {
    const { t } = useTranslation()
    const metricsFilter = useMetricsFilter({ adapters, sdkFilters, type })
    const settingsProps = useTableSettingsProps({
      tableSettings: tableSettingsRef.current,
      columns: tableProps.columns,
    })

    if (sdkFilters == null) {
      return null
    }

    return (
      <ResourceTableComponent
        {...tableProps}
        {...settingsProps}
        type={type}
        title={
          hideTitle === true ? undefined : (tableProps.title ?? t("common.all"))
        }
        query={query}
        // merged into the query by the component below, where the resource type is
        // in scope and the merge can be typed
        filters={sdkFilters}
        metricsQuery={
          metricsQuery == null
            ? undefined
            : {
                ...metricsQuery,
                filter: metricsFilter,
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
    searchBarVariant,
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
              variant={searchBarVariant}
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

const noTableSettings = {
  subscribe: () => () => {},
  getSnapshot: () => undefined,
}

/**
 * The props `tableSettings` overrides on a `FilteredTable`: the columns the user
 * left visible, and the sort they picked, resolved for this view. `undefined`
 * when the hook has no `tableSettings`, leaving the table props untouched.
 *
 * It also tells the store which columns can be hidden, so the columns menu in
 * `FiltersBar` lists them: the columns are handed to the table, not to the hook.
 */
function useTableSettingsProps<TResource extends ListableResourceType>({
  tableSettings,
  columns,
}: {
  tableSettings: TableSettingsContext | undefined
  columns: Array<ResourceTableColumn<TResource>>
}):
  | Pick<
      UseResourceTableConfig<TResource>,
      "columns" | "sort" | "onSortChange" | "defaultSort" | "showSortIndicator"
    >
  | undefined {
  const store = tableSettings?.store
  const state = useSyncExternalStore(
    store?.subscribe ?? noTableSettings.subscribe,
    store?.getSnapshot ?? noTableSettings.getSnapshot,
  )

  const columnEntries = columns.flatMap((column): TableColumnEntry[] =>
    column.hideable === true
      ? [
          {
            id: column.id,
            // the menu holds text only: a header that is a node falls back to
            // the id, and the column should get a string header instead
            label:
              typeof column.header === "string" ? column.header : column.id,
            defaultHidden: column.defaultHidden === true,
          },
        ]
      : [],
  )
  const columnEntriesKey = JSON.stringify(columnEntries)

  // Before paint, so the menu is never shown with an older column set.
  useLayoutEffect(() => {
    store?.setColumnEntries(columnEntries)
  }, [store, columnEntriesKey])

  if (tableSettings == null || state == null) {
    return undefined
  }

  const activeSort = resolveTableSort(tableSettings.config, state.sort)
  const sort = (
    activeSort == null
      ? undefined
      : toSortKey(activeSort.option, activeSort.value.direction)
  ) as ResourceTableSort<TResource>

  return {
    columns: columns.filter(
      (column) =>
        column.hideable !== true ||
        isColumnVisible(
          { id: column.id, defaultHidden: column.defaultHidden === true },
          state.columns,
        ),
    ),
    sort,
    // Headers are inert and nothing else in the table sets the sort, but a
    // controlled table needs the callback: map the key back to its option, so a
    // `setSort` from outside still lands in the store.
    onSortChange: (next) => {
      const key = Array.isArray(next) ? next[0] : next
      if (key == null) {
        return
      }
      const direction = key.startsWith("-") ? "desc" : "asc"
      const attribute = direction === "desc" ? key.slice(1) : key
      const option = tableSettings.config.sortOptions.find(
        ({ sortBy }) => sortBy === attribute,
      )
      if (option != null) {
        store?.setSort({ id: option.id, direction })
      }
    },
    defaultSort: undefined,
    showSortIndicator: true,
  }
}
