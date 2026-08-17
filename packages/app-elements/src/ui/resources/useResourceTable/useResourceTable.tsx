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
  sort: string | undefined,
): { attribute: string; desc: boolean } | undefined {
  if (sort == null || sort === "") {
    return undefined
  }
  const desc = sort.startsWith("-")
  return { attribute: desc ? sort.slice(1) : sort, desc }
}

/**
 * Whether a sort attribute is a date, by CommerceLayer's naming convention
 * (`created_at`, `updated_at`, `placed_at`, …). Such columns sort descending on
 * the first click, so the newest rows come first.
 */
function isDateAttribute(sortBy: string | undefined): boolean {
  return sortBy?.endsWith("_at") === true
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

type ColumnKind = NonNullable<ResourceTableColumn<ListableResourceType>["kind"]>

/**
 * How much of the table each kind of column wants, as a weight.
 *
 * Relative, not absolute: the weights are normalized to percentages of the actual
 * column set (see `columnWidths`), because the pages are liquid — a percentage
 * holds at any viewport where a pixel width would not — and because one scale has
 * to serve tables of three to six columns.
 *
 * A column with no `kind` weighs `flexibleColumnWeight`: it is the name, email or
 * SKU the row is about, so it gets the largest share.
 */
const columnKindWeight: Record<ColumnKind, number> = {
  text: 2,
  code: 2,
  status: 2,
  datetime: 2,
  amount: 1,
  count: 1,
  // narrow on purpose — it holds one icon button — but still a share rather than
  // a fixed width: `table-layout: fixed` ignores `min-width`, so a `ch` width
  // could not defend itself and the surplus would land on this column anyway,
  // which is what left a third of the table looking empty.
  actions: 1,
}

/** The weight of a column with no `kind`, the one the row is about. */
const flexibleColumnWeight = 3

/**
 * The widths to declare, as percentages summing to 100.
 *
 * Percentages rather than a fraction class per column, because the share depends
 * on the whole set: the same `status` column is a quarter of a four-column table
 * and a sixth of a six-column one. Inline styles rather than classes, because app
 * code is not Tailwind-scanned and these values cannot be enumerated in advance.
 *
 * Declared on the header cells *and* on the body cells, because fixed layout takes
 * its widths from the first rendered row: the header row on desktop, the first body
 * row once the header is hidden on mobile. Measured — with the widths on the header
 * alone, a hidden header leaves the columns evenly split (192/192 instead of
 * 286/98). A `colgroup` looks like the tidier answer but is not: a `col` keeps
 * reserving its share even when its cells are hidden, so the visible columns would
 * fill only part of the table.
 *
 * Every column is declared, including the ones `hideBelow` may hide: hiding is a
 * CSS decision made per viewport, so it cannot be resolved here. That works out —
 * a hidden column takes its percentage out of play and the browser shares the
 * remainder proportionally, which is measurably what we want (a six-column table
 * at 560px with three columns hidden splits 249/249/62 rather than dumping the
 * surplus on the last column).
 */
function columnWidths(
  columns: Array<Pick<ResourceTableColumn<ListableResourceType>, "kind">>,
): number[] {
  const weights = columns.map((column) =>
    column.kind != null ? columnKindWeight[column.kind] : flexibleColumnWeight,
  )
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  return weights.map((weight) => (weight / total) * 100)
}

/**
 * Numbers read right-aligned, so their digits line up down the column.
 *
 * So does the `actions` menu: its share is wider than the icon button it holds, and
 * left-aligned that surplus reads as a gap at the table's right edge.
 */
const columnKindAlign: Partial<Record<ColumnKind, "right">> = {
  amount: "right",
  count: "right",
  actions: "right",
}

/**
 * The alignment a column ends up with: its own `align`, else its kind's.
 *
 * Takes only the two fields it reads, so it accepts a column of any resource: the
 * full `ResourceTableColumn<TResource>` is invariant through its `cell` callback
 * and would not be assignable here.
 */
function resolveAlign(
  column:
    | Pick<ResourceTableColumn<ListableResourceType>, "align" | "kind">
    | undefined,
): ResourceTableColumn<ListableResourceType>["align"] {
  if (column?.align != null) {
    return column.align
  }
  return column?.kind != null ? columnKindAlign[column.kind] : undefined
}

/**
 * A fixed-layout cell cannot grow, so an over-long value is clipped at the column
 * edge instead of spilling over its neighbour.
 *
 * `actions` is excluded: its dropdown menu is absolutely positioned rather than
 * portaled, so clipping the cell would clip the open menu away with it.
 */
function clipClassName(
  kind: ResourceTableColumn<ListableResourceType>["kind"],
): string | undefined {
  return kind === "actions" ? undefined : "overflow-hidden"
}

// Full literal class strings (not interpolated) so Tailwind v4's source scanner
// keeps them in the compiled stylesheet. Only breakpoints that actually exist in
// `styles/global.css` may be used — that file resets Tailwind's defaults, so a
// variant like `sm:` would produce no CSS and hide the column at every width.
function hideBelowClassName(
  hideBelow: Exclude<
    ResourceTableColumn<ListableResourceType>["hideBelow"],
    undefined | "never"
  >,
): string {
  switch (hideBelow) {
    case "md":
      return "hidden md:table-cell"
    case "lg":
      return "hidden lg:table-cell"
    case "xl":
      return "hidden xl:table-cell"
  }
}

/**
 * From which width a column is shown.
 *
 * A phone fits one column, so that is the default: the first one — what the row is
 * about — and nothing else until `md`.
 *
 * Neither status nor the actions menu is exempt. Apps render their status badge
 * next to the name on mobile (`md:hidden`), so keeping the column too would show it
 * twice; and a row's actions are reachable by opening the row itself.
 *
 * A column overrides this with `hideBelow`, including `"never"` to stay visible on
 * mobile — for the one value that is the point of the table.
 */
function visibilityClassName(
  column:
    | Pick<ResourceTableColumn<ListableResourceType>, "hideBelow" | "kind">
    | undefined,
  index: number,
): string | undefined {
  if (column?.hideBelow != null) {
    return column.hideBelow === "never"
      ? undefined
      : hideBelowClassName(column.hideBelow)
  }
  return index === 0 ? undefined : hideBelowClassName("md")
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
  const [internalSort, setInternalSort] = useState<
    ResourceTableSort<TResource>
  >(() => defaultSort)
  const sort = isControlled ? controlledSort : internalSort
  const setSort = useCallback(
    (next: ResourceTableSort<TResource>) => {
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
      // built per branch rather than with an inline conditional inside the
      // template: that way each branch matches the sort expression union exactly
      setSort(first.desc ? `-${attribute}` : attribute)
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
          // the accessor returns `null`, so TanStack cannot infer a direction
          // from the data and would default every column to descending-first
          sortDescFirst: column.sortDescFirst ?? isDateAttribute(column.sortBy),
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
    // the header toggles asc/desc only: removing the sort would silently discard
    // the app's `defaultSort` and leave the rows in the API's own order
    enableSortingRemoval: false,
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

      const widths = columnWidths(columns)

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
                align={resolveAlign(definition)}
                // fixed layout takes its widths from the first row, so declaring
                // them here sizes the whole column. Skipped when the column sets
                // an explicit `width` class, which then owns the width.
                style={
                  definition?.width == null
                    ? { width: `${widths[index]}%` }
                    : undefined
                }
                className={cn(
                  definition?.width,
                  visibilityClassName(definition, index),
                )}
              >
                {canSort ? (
                  <button
                    type="button"
                    onClick={header.column.getToggleSortingHandler()}
                    className="inline-flex items-center gap-1 uppercase hover:text-gray-700"
                  >
                    {label}
                    <Icon
                      name={
                        sorted === "asc"
                          ? "arrowUp"
                          : sorted === "desc"
                            ? "arrowDown"
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
                style={
                  column.width == null
                    ? { width: `${widths[colIndex]}%` }
                    : undefined
                }
                className={cn(
                  alignClassName(resolveAlign(column)),
                  clipClassName(column.kind),
                  visibilityClassName(column, colIndex),
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
                      clickable && "cursor-pointer [&:hover>td]:bg-gray-50/50",
                      // positioning context for the stretched-link `::after`
                      href != null && "relative",
                    )}
                  >
                    {row.getAllCells().map((cell, colIndex) => {
                      const content = <table.FlexRender cell={cell} />
                      return (
                        <Td
                          key={cell.id}
                          style={
                            columns[colIndex]?.width == null
                              ? { width: `${widths[colIndex]}%` }
                              : undefined
                          }
                          className={cn(
                            alignClassName(resolveAlign(columns[colIndex])),
                            clipClassName(columns[colIndex]?.kind),
                            visibilityClassName(columns[colIndex], colIndex),
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
                // Column widths come from the header row and the declared shares,
                // never from the cell content: that is what makes the loading and
                // the loaded table the same size, and keeps them stable from page
                // to page. Not applied in `scroll` mode, where the table is meant
                // to take its natural width.
                className="table-fixed"
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
