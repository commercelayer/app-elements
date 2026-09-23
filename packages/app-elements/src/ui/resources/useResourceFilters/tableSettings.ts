import { useState } from "react"
import { useTokenProvider } from "#providers/TokenProvider"
import { readWebStorage, writeWebStorage } from "#utils/webStorage"

export type TableSortDirection = "asc" | "desc"

/**
 * One entry of the sort menu.
 *
 * Options are declared apart from the columns because the two do not line up: a
 * list can sort by something it never shows as a column ("Updated"), and most
 * columns are not sortable at all.
 */
export interface TableSortOption {
  /**
   * Stable id, independent from the API attribute. It is what the user's choice
   * is stored under, so the same option can map to a different `sortBy` in
   * another view of the list (an order is sorted by `placed_at`, a cart by
   * `created_at`) and the choice still carries over.
   */
  id: string
  /** Menu label, already translated. */
  label: string
  /**
   * The attribute the API sorts by: a Core attribute (`"updated_at"`) or a
   * Metrics one (`"order.placed_at"`). A column whose `sortBy` is the same value
   * shows the sort arrow in its header.
   */
  sortBy: string
  /**
   * What the attribute holds, which picks the words for the two directions:
   * "Newest first" for a date, "A → Z" for a text, "Lowest first" for a number.
   */
  kind: "date" | "text" | "number"
}

export interface TableSortValue {
  /** The `id` of a `TableSortOption`. */
  id: string
  direction: TableSortDirection
}

export interface TableSettingsConfig {
  /**
   * Identifies the list among the others of the same app, and scopes the stored
   * preference together with organization, app and mode. Every view (tab) of a
   * list shares it, so a choice made in one view holds in the others.
   */
  listId: string
  /** The sort menu entries, in display order. */
  sortOptions: TableSortOption[]
  /**
   * The sort applied until the user picks one, and whenever the stored choice
   * does not apply to the current view.
   */
  defaultSort: TableSortValue
}

/** What the columns menu needs to know about a hideable column. */
export interface TableColumnEntry {
  id: string
  label: string
  defaultHidden: boolean
}

export interface TableSettingsState {
  /** The user's sort choice, as stored. `undefined` until they pick one. */
  sort: TableSortValue | undefined
  /**
   * Visibility overrides, by column id: only the columns the user moved away
   * from their default. A column added later follows its own default instead of
   * inheriting a stale "everything else is hidden".
   */
  columns: Record<string, boolean>
  /** The hideable columns of the table currently rendered, for the menu. */
  columnEntries: TableColumnEntry[]
}

export interface TableSettingsStore {
  getSnapshot: () => TableSettingsState
  subscribe: (listener: () => void) => () => void
  setSort: (sort: TableSortValue) => void
  setColumnVisible: (column: TableColumnEntry, visible: boolean) => void
  setColumnEntries: (entries: TableColumnEntry[]) => void
}

const storageVersion = 1

interface StoredTableSettings {
  version: number
  sort?: TableSortValue
  columns?: Record<string, boolean>
}

export function makeTableSettingsStorageKey({
  mode,
  organizationSlug,
  appSlug,
  listId,
}: {
  mode: string
  organizationSlug: string
  appSlug: string
  listId: string
}): string {
  return `cl.table.${mode}.${organizationSlug}.${appSlug}.${listId}`
}

/**
 * Read the stored preference, keeping only what is well formed.
 *
 * Lenient on purpose: an entry written by an older release, or edited by hand,
 * loses the parts that do not parse and keeps the rest, rather than failing the
 * list. A different `version` discards the whole entry, since its shape can no
 * longer be trusted.
 */
export function parseStoredTableSettings(
  raw: unknown,
): Pick<TableSettingsState, "sort" | "columns"> {
  const empty = { sort: undefined, columns: {} }
  if (raw == null || typeof raw !== "object") {
    return empty
  }

  const stored = raw as Partial<StoredTableSettings>
  if (stored.version !== storageVersion) {
    return empty
  }

  const sort =
    stored.sort != null &&
    typeof stored.sort.id === "string" &&
    (stored.sort.direction === "asc" || stored.sort.direction === "desc")
      ? { id: stored.sort.id, direction: stored.sort.direction }
      : undefined

  const columns =
    stored.columns != null && typeof stored.columns === "object"
      ? Object.fromEntries(
          Object.entries(stored.columns).filter(
            (entry): entry is [string, boolean] =>
              typeof entry[1] === "boolean",
          ),
        )
      : {}

  return { sort, columns }
}

/**
 * The sort to apply in the current view, with the option it resolves to.
 *
 * The stored choice wins when the view has an option with that id; otherwise
 * the view falls back to its own default, and the stored choice is left alone
 * for the views where it does apply.
 */
export function resolveTableSort(
  config: Pick<TableSettingsConfig, "sortOptions" | "defaultSort">,
  stored: TableSortValue | undefined,
): { value: TableSortValue; option: TableSortOption } | undefined {
  for (const candidate of [stored, config.defaultSort]) {
    const option = config.sortOptions.find(({ id }) => id === candidate?.id)
    if (candidate != null && option != null) {
      return { value: candidate, option }
    }
  }
  return undefined
}

/** The SDK sort expression for an option and a direction (`"-updated_at"`). */
export function toSortKey(
  option: Pick<TableSortOption, "sortBy">,
  direction: TableSortDirection,
): string {
  return direction === "desc" ? `-${option.sortBy}` : option.sortBy
}

export function isColumnVisible(
  column: Pick<TableColumnEntry, "id" | "defaultHidden">,
  overrides: Record<string, boolean>,
): boolean {
  return overrides[column.id] ?? !column.defaultHidden
}

export function makeTableSettingsStore(storageKey: string): TableSettingsStore {
  let state: TableSettingsState = {
    // Read synchronously, before the first render, so the first fetch already
    // carries the user's sort: nothing flickers and nothing is fetched twice.
    ...parseStoredTableSettings(readWebStorage("localStorage", storageKey)),
    columnEntries: [],
  }
  const listeners = new Set<() => void>()

  const update = (
    next: Partial<TableSettingsState>,
    persist: boolean,
  ): void => {
    state = { ...state, ...next }
    if (persist) {
      writeWebStorage("localStorage", storageKey, {
        version: storageVersion,
        sort: state.sort,
        columns: state.columns,
      } satisfies StoredTableSettings)
    }
    for (const listener of listeners) {
      listener()
    }
  }

  return {
    getSnapshot: () => state,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    setSort: (sort) => {
      update({ sort }, true)
    },
    setColumnVisible: (column, visible) => {
      const { [column.id]: _previous, ...columns } = state.columns
      update(
        {
          // back to the default means no override at all
          columns:
            visible === !column.defaultHidden
              ? columns
              : { ...columns, [column.id]: visible },
        },
        true,
      )
    },
    setColumnEntries: (columnEntries) => {
      update({ columnEntries }, false)
    },
  }
}

/**
 * The table settings store of a list, created once per mount. `undefined` when
 * the list is rendered without `tableSettings`.
 */
export function useTableSettingsStore(
  config: TableSettingsConfig | undefined,
): TableSettingsStore | undefined {
  const {
    settings: { mode, organizationSlug, appSlug },
  } = useTokenProvider()

  const [store] = useState(() =>
    config == null
      ? undefined
      : makeTableSettingsStore(
          makeTableSettingsStorageKey({
            mode,
            organizationSlug,
            appSlug,
            listId: config.listId,
          }),
        ),
  )

  return store
}
