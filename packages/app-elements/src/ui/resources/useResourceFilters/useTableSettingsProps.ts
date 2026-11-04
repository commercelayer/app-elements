import { useLayoutEffect, useSyncExternalStore } from "react"
import type {
  ApiFlavour,
  ListableResourceTypeFor,
} from "#ui/resources/useResourceList/apiFlavour"
import type {
  ResourceTableColumn,
  ResourceTableSort,
  UseResourceTableConfig,
} from "#ui/resources/useResourceTable/types"
import {
  applyColumnOrder,
  isColumnVisible,
  resolveTableSort,
  type TableColumnEntry,
  type TableSettingsConfig,
  type TableSettingsStore,
  toSortKey,
} from "./tableSettings"

/** A list's table settings: its store, and the config the store was made for. */
export interface TableSettingsContext {
  store: TableSettingsStore
  config: TableSettingsConfig
}

/** The table props the settings decide. */
export type TableSettingsProps<
  TResource extends ListableResourceTypeFor<TApi>,
  TApi extends ApiFlavour = "core",
> = Pick<
  UseResourceTableConfig<TResource, TApi>,
  "columns" | "sort" | "onSortChange" | "defaultSort" | "showSortIndicator"
>

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
export function useTableSettingsProps<
  TResource extends ListableResourceTypeFor<TApi>,
  TApi extends ApiFlavour = "core",
>({
  tableSettings,
  columns,
}: {
  tableSettings: TableSettingsContext | undefined
  columns: Array<ResourceTableColumn<TResource, TApi>>
}): TableSettingsProps<TResource, TApi> | undefined {
  const store = tableSettings?.store
  const state = useSyncExternalStore(
    store?.subscribe ?? noTableSettings.subscribe,
    store?.getSnapshot ?? noTableSettings.getSnapshot,
  )

  const columnEntries = columns.flatMap((column, index): TableColumnEntry[] => {
    if (column.hideable === true) {
      return [
        {
          id: column.id,
          // the menu holds text only: a header that is a node falls back to
          // the id, and the column should get a string header instead
          label: typeof column.header === "string" ? column.header : column.id,
          defaultHidden: column.defaultHidden === true,
          locked: false,
        },
      ]
    }
    // A fixed column is listed locked, but only when it has a name to show:
    // an `actions` column has an empty header, and a node would have no label.
    return typeof column.header === "string" && column.header !== ""
      ? [
          {
            id: column.id ?? `col-${index}`,
            label: column.header,
            defaultHidden: false,
            locked: true,
          },
        ]
      : []
  })
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
  ) as ResourceTableSort<TResource, TApi>

  return {
    // the user's order first, over every column, then visibility: a column
    // turned on shows up where it was dragged to while hidden
    columns: applyColumnOrder(columns, {
      getId: (column) => column.id ?? "",
      isMovable: (column) => column.hideable === true,
      order: state.order,
    }).filter(
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
