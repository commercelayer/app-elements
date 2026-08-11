import type { ListableResourceType } from "@commercelayer/sdk"
import {
  createColumnHelper,
  rowSortingFeature,
  type SortingState,
  tableFeatures,
  useTable,
} from "@tanstack/react-table"
import cn from "classnames"
import { type FC, useCallback, useMemo, useRef, useState } from "react"
import { formatResourceName } from "#helpers/resources"
import { t } from "#providers/I18NProvider"
import { EmptyState } from "#ui/atoms/EmptyState"
import { Icon } from "#ui/atoms/Icon"
import { Section } from "#ui/atoms/Section"
import { SkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Spacer } from "#ui/atoms/Spacer"
import { Table, Td, Th, Tr } from "#ui/atoms/Table"
import { Text } from "#ui/atoms/Text"
import { VisibilityTrigger } from "#ui/atoms/VisibilityTrigger"
import type { Resource } from "../useResourceList/listFetcher"
import {
  type UseResourceListConfig,
  type UseResourceListReturnWithPagination,
  useResourceList,
} from "../useResourceList/useResourceList"
import { computeTitleWithTotalCount } from "../useResourceList/utils"
import type {
  ResourceTableColumn,
  ResourceTableProps,
  ResourceTableSort,
  UseResourceTableConfig,
  UseResourceTableReturn,
} from "./types"

// Static, prop-free feature registry. Only the row-sorting feature is needed:
// sorting is server-side (`manualSorting`), so no sorted row model is registered
// (see docs/adr/0002-server-side-table-operations.md).
const tableFeaturesConfig = tableFeatures({ rowSortingFeature })

// Stable empty-data reference to avoid invalidating the table's models on every
// render while the first page is loading.
const EMPTY_DATA: unknown[] = []

// Minimal row shape used internally for TanStack typing (see note in the hook).
// Every CommerceLayer resource has a string `id`, which is all TanStack needs
// from us (`getRowId`); the real resource is recovered via a cast in each cell.
type TableRow = { id: string }

/** Resolve a stable column id: explicit `id`, then `sortBy`, then positional. */
function getColumnId<T extends ListableResourceType>(
  column: ResourceTableColumn<T>,
  index: number,
): string {
  return column.id ?? column.sortBy ?? `col-${index}`
}

/** Parse an SDK sort expression (`"-created_at"`) into `{ attribute, desc }`. */
function parseSort(
  sort: ResourceTableSort,
): { attribute: string; desc: boolean } | undefined {
  if (sort == null || sort === "") {
    return undefined
  }
  const desc = sort.startsWith("-")
  return { attribute: desc ? sort.slice(1) : sort, desc }
}

function alignClassName(
  align: ResourceTableColumn<ListableResourceType>["align"],
): string | undefined {
  switch (align) {
    case "right":
      return "text-right"
    case "center":
      return "text-center"
    default:
      return undefined
  }
}

// Full literal class strings (not interpolated) so Tailwind v4's source scanner
// keeps them in the compiled stylesheet. Only breakpoints that actually exist in
// `styles/global.css` may be used — that file resets Tailwind's defaults, so a
// variant like `sm:` would produce no CSS and hide the column at every width.
function hideBelowClassName(
  hideBelow: ResourceTableColumn<ListableResourceType>["hideBelow"],
): string | undefined {
  switch (hideBelow) {
    case "md":
      return "hidden md:table-cell"
    case "lg":
      return "hidden lg:table-cell"
    case "xl":
      return "hidden xl:table-cell"
    default:
      return undefined
  }
}

/**
 * `useResourceTable` fetches a CommerceLayer resource type and renders it as a
 * data table driven by a column model, backed by TanStack Table v9.
 *
 * It reuses `useResourceList`'s fetch/pagination layer verbatim and only
 * replaces item rendering with a TanStack-driven table. Sorting, filtering,
 * search and pagination are all resolved server-side.
 */
export function useResourceTable<TResource extends ListableResourceType>(
  config: UseResourceTableConfig<TResource>,
): UseResourceTableReturn<TResource> {
  const {
    type,
    columns,
    query,
    metricsQuery,
    preProcess,
    paginationType = "pagination",
    paginationScrollTo,
    onRowClick,
    getRowHref,
    sort: controlledSort,
    onSortChange,
    defaultSort,
  } = config

  // Sort state: controlled when `onSortChange` is provided, otherwise internal.
  const isControlled = onSortChange != null
  const [internalSort, setInternalSort] = useState<ResourceTableSort>(
    () => defaultSort,
  )
  const sort = isControlled ? controlledSort : internalSort
  const setSort = useCallback(
    (next: ResourceTableSort) => {
      if (isControlled) {
        onSortChange?.(next)
      } else {
        setInternalSort(next)
      }
    },
    [isControlled, onSortChange],
  )

  const isMetrics = metricsQuery != null

  // Merge the active sort into the query that drives the fetch. Changing it makes
  // useResourceList refetch from page 1.
  // Core API: the SDK types `sort` against known resource fields, while our
  // `sortBy` is a free ransack attribute string, hence the cast.
  // Metrics API: `query` is not sent at all, so the sort goes to the metrics
  // `search.sort_by`/`sort` instead.
  const mergedQuery = useMemo(
    () =>
      ({
        ...query,
        ...(!isMetrics && sort != null && sort !== "" ? { sort: [sort] } : {}),
      }) as NonNullable<UseResourceListConfig<TResource>["query"]>,
    [query, sort, isMetrics],
  )

  const mergedMetricsQuery = useMemo(() => {
    if (metricsQuery == null) {
      return undefined
    }
    const parsed = parseSort(sort)
    return {
      ...metricsQuery,
      filter: metricsQuery.filter ?? {},
      search: {
        ...metricsQuery.search,
        ...(parsed != null
          ? {
              sort_by: parsed.attribute,
              sort: parsed.desc ? ("desc" as const) : ("asc" as const),
            }
          : {}),
      },
    } as NonNullable<UseResourceListConfig<TResource>["metricsQuery"]>
  }, [metricsQuery, sort])

  const result = useResourceList<TResource>({
    type,
    query: mergedQuery,
    metricsQuery: mergedMetricsQuery,
    preProcess,
    paginationType,
    paginationScrollTo,
  })

  const {
    list,
    meta,
    isLoading,
    isFirstLoading,
    error,
    removeItem,
    refresh,
    fetchMore,
    hasMorePages,
  } = result

  const Pagination =
    paginationType === "pagination"
      ? (result as UseResourceListReturnWithPagination<TResource>).Pagination
      : NullComponent

  // Map the active sort onto TanStack's controlled sorting state.
  const sorting = useMemo<SortingState>(() => {
    const parsed = parseSort(sort)
    if (parsed == null) {
      return []
    }
    const index = columns.findIndex(
      (column) => column.sortBy === parsed.attribute,
    )
    const column = columns[index]
    if (column == null) {
      return []
    }
    return [{ id: getColumnId(column, index), desc: parsed.desc }]
  }, [sort, columns])

  const onSortingChange = useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      const next = typeof updater === "function" ? updater(sorting) : updater
      const first = next[0]
      if (first == null) {
        setSort(undefined)
        return
      }
      const index = columns.findIndex(
        (column, i) => getColumnId(column, i) === first.id,
      )
      const attribute = columns[index]?.sortBy
      if (attribute == null) {
        return
      }
      setSort(`${first.desc ? "-" : ""}${attribute}`)
    },
    [sorting, columns, setSort],
  )

  const tableColumns = useMemo(() => {
    // Type the column helper/table with a minimal row shape rather than the full
    // `Resource<TResource>` SDK union: pushing that large conditional type
    // through TanStack's generics while `TResource` is unresolved triggers
    // "excessively deep" (TS2589). The real row type is preserved by the
    // `ResourceTableColumn` public API and the cast in `cell`.
    const helper = createColumnHelper<typeof tableFeaturesConfig, TableRow>()
    return helper.columns(
      columns.map((column, index) =>
        // Accessor (not display) columns: TanStack's `getCanSort` requires an
        // `accessorFn`, so a display column can never be sortable. The accessor
        // value itself is unused — sorting is server-side (`manualSorting`) — so
        // it returns a trivial `null`. The cell renders from `row.original`.
        helper.accessor(() => null, {
          id: getColumnId(column, index),
          header: () => column.header,
          cell: ({ row }) =>
            column.cell({ resource: row.original as Resource<TResource> }),
          enableSorting: column.sortBy != null,
        }),
      ),
    )
  }, [columns])

  const table = useTable<typeof tableFeaturesConfig, TableRow>({
    features: tableFeaturesConfig,
    columns: tableColumns,
    data: (list ?? EMPTY_DATA) as TableRow[],
    getRowId: (row) => row.id,
    manualSorting: true,
    enableMultiSort: false,
    enableSortingRemoval: true,
    state: { sorting },
    onSortingChange,
  })

  const columnCount = columns.length
  const isEmpty = !isFirstLoading && (list?.length ?? 0) === 0
  const isApiError = error != null && list == null

  /**
   * Everything the table body reads is funnelled through a ref so that
   * `ResourceTable` can be created **once** (empty dependency list) and keep a
   * stable component type.
   *
   * With these values as dependencies instead, the identity changed on almost
   * every render — callers pass row handlers inline, and `fetchMore` itself is
   * rebuilt whenever swr returns a new data object. A new component type makes
   * React unmount the whole table and build it again, which re-creates every cell
   * and visibly re-loads the row images.
   *
   * Reading from the ref is safe because the component that owns this hook
   * re-renders on each of these changes, which re-runs the body below.
   */
  const renderRef = useRef({
    table,
    columns,
    columnCount,
    type,
    meta,
    isApiError,
    isEmpty,
    isFirstLoading,
    isLoading,
    hasMorePages,
    paginationType,
    fetchMore,
    onRowClick,
    getRowHref,
  })
  renderRef.current = {
    table,
    columns,
    columnCount,
    type,
    meta,
    isApiError,
    isEmpty,
    isFirstLoading,
    isLoading,
    hasMorePages,
    paginationType,
    fetchMore,
    onRowClick,
    getRowHref,
  }

  const ResourceTable = useCallback<FC<ResourceTableProps>>(
    ({
      title,
      actionButton,
      emptyState,
      titleSize,
      variant,
      layout = "fit",
    }) => {
      const {
        table,
        columns,
        columnCount,
        type,
        meta,
        isApiError,
        isEmpty,
        isFirstLoading,
        isLoading,
        hasMorePages,
        paginationType,
        fetchMore,
        onRowClick,
        getRowHref,
      } = renderRef.current

      const recordCount = meta?.recordCount
      const computedTitle =
        typeof title === "function"
          ? title(recordCount)
          : computeTitleWithTotalCount({ title, recordCount })

      if (isApiError) {
        return (
          <EmptyState
            title={`Could not retrieve ${type}`}
            description={t("common.try_to_refresh_page")}
          />
        )
      }

      const defaultEmptyState = (
        <Text variant="info">
          No {formatResourceName({ resource: type, count: "plural" })}.
        </Text>
      )

      const thead = (
        <Tr>
          {table.getHeaderGroups()[0]?.headers.map((header, index) => {
            const definition = columns[index]
            const canSort = header.column.getCanSort()
            const sorted = header.column.getIsSorted()
            const label = <table.FlexRender header={header} />
            return (
              <Th
                key={header.id}
                align={definition?.align}
                className={cn(
                  definition?.width,
                  hideBelowClassName(definition?.hideBelow),
                )}
              >
                {canSort ? (
                  <button
                    type="button"
                    onClick={header.column.getToggleSortingHandler()}
                    className="inline-flex items-center gap-1 uppercase hover:text-gray-500"
                  >
                    {label}
                    <Icon
                      name={
                        sorted === "asc"
                          ? "caretUp"
                          : sorted === "desc"
                            ? "caretDown"
                            : "arrowsDownUp"
                      }
                    />
                  </button>
                ) : (
                  label
                )}
              </Th>
            )
          })}
        </Tr>
      )

      const renderSkeletonRows = (count: number, keyPrefix: string) =>
        Array.from({ length: count }).map((_, rowIndex) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows never reorder
          <Tr key={`${keyPrefix}-${rowIndex}`}>
            {columns.map((column, colIndex) => (
              <Td
                key={getColumnId(column, colIndex)}
                isLoading
                delayMs={0}
                className={cn(
                  alignClassName(column.align),
                  hideBelowClassName(column.hideBelow),
                )}
              >
                &nbsp;
              </Td>
            ))}
          </Tr>
        ))

      const tbody = (
        <>
          {isFirstLoading
            ? renderSkeletonRows(8, "skeleton")
            : table.getRowModel().rows.map((row) => {
                const resource = row.original as Resource<TResource>
                const href = getRowHref?.(resource)
                const clickable = href != null || onRowClick != null
                return (
                  <Tr
                    key={row.id}
                    // Row-level click is used only when there is no href; with an
                    // href the (stretched) anchor on the first cell owns the click
                    // so modified/middle clicks open a new tab.
                    onClick={
                      href == null && onRowClick != null
                        ? (event) => {
                            onRowClick(resource, event)
                          }
                        : undefined
                    }
                    role={
                      href == null && onRowClick != null ? "button" : undefined
                    }
                    className={cn(
                      // the hover has to be painted on the cells, not on the row:
                      // `Td` is opaque (`bg-white`) and a `tr` background renders
                      // behind its cells, so a `hover:bg-*` here would be covered
                      clickable && "cursor-pointer [&:hover>td]:bg-gray-50",
                      // positioning context for the stretched-link `::after`
                      href != null && "relative",
                    )}
                  >
                    {row.getAllCells().map((cell, colIndex) => {
                      const content = <table.FlexRender cell={cell} />
                      return (
                        <Td
                          key={cell.id}
                          className={cn(
                            alignClassName(columns[colIndex]?.align),
                            hideBelowClassName(columns[colIndex]?.hideBelow),
                          )}
                        >
                          {href != null && colIndex === 0 ? (
                            // Stretched link: a real anchor on the first cell's
                            // content whose `::after` covers the whole row. Gives
                            // new-tab / cmd-click semantics; plain clicks are
                            // handled client-side via onRowClick when provided.
                            <a
                              href={href}
                              onClick={(event) => {
                                if (
                                  event.metaKey ||
                                  event.ctrlKey ||
                                  event.shiftKey ||
                                  event.altKey
                                ) {
                                  return
                                }
                                if (onRowClick != null) {
                                  event.preventDefault()
                                  onRowClick(resource, event)
                                }
                              }}
                              className="text-inherit no-underline after:absolute after:inset-0"
                            >
                              {content}
                            </a>
                          ) : (
                            content
                          )}
                        </Td>
                      )
                    })}
                  </Tr>
                )
              })}
          {paginationType === "infinite" && !isFirstLoading ? (
            isLoading ? (
              renderSkeletonRows(2, "skeleton-more")
            ) : (
              <Tr>
                <Td colSpan={columnCount} className="!p-0 !border-0">
                  <VisibilityTrigger
                    enabled={hasMorePages ?? false}
                    callback={(entry) => {
                      if (entry.isIntersecting) {
                        void fetchMore()
                      }
                    }}
                  />
                </Td>
              </Tr>
            )
          ) : null}
        </>
      )

      if (isEmpty) {
        return (
          <Section
            actionButton={actionButton}
            title={computedTitle}
            titleSize={titleSize ?? "normal"}
            border="none"
          >
            <Spacer top="4">{emptyState ?? defaultEmptyState}</Spacer>
          </Section>
        )
      }

      return (
        <Section
          isLoading={isFirstLoading}
          delayMs={0}
          data-testid="resource-table"
          actionButton={actionButton}
          title={computedTitle}
          titleSize={titleSize ?? "normal"}
          border="none"
        >
          <SkeletonTemplate isLoading={false}>
            {layout === "scroll" ? (
              <div className="overflow-x-auto">
                <Table
                  variant={variant === "boxed" ? "boxed" : undefined}
                  className="min-w-max"
                  thead={thead}
                  tbody={tbody}
                />
              </div>
            ) : (
              <Table
                variant={variant === "boxed" ? "boxed" : undefined}
                thead={thead}
                tbody={tbody}
              />
            )}
          </SkeletonTemplate>
        </Section>
      )
    },
    // created once: every value it reads comes from `renderRef`
    [],
  )

  return {
    ResourceTable,
    Pagination,
    list,
    meta,
    isLoading,
    isFirstLoading,
    error,
    removeItem,
    refresh,
    hasMorePages,
    sort,
  }
}

const NullComponent: FC = () => null
