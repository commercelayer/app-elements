import type { JSX } from "react"
import type {
  ApiFlavour,
  ListableResourceTypeFor,
} from "#ui/resources/useResourceList/apiFlavour"
import type { ResourceTableColumn } from "#ui/resources/useResourceTable/types"
import { TableSettingsMenus } from "./TableSettingsMenus"
import {
  type TableSettingsConfig,
  useTableSettingsStore,
} from "./tableSettings"
import {
  type TableSettingsProps,
  useTableSettingsProps,
} from "./useTableSettingsProps"

/**
 * Table settings — the sort and columns menus — for a table rendered with
 * `useResourceTable` alone, outside `useResourceFilters`: a Provisioning list,
 * which the filters do not drive. The same menus and stored preference as a
 * `FilteredTable` with `tableSettings`.
 *
 * Spread `tableProps` into `useResourceTable`'s config, in place of its own
 * `columns` and sort, and render `menus` where the list's toolbar is.
 *
 * @example
 * ```tsx
 * const { tableProps, menus } = useTableSettings({ config, columns })
 * const { ResourceTable } = useResourceTable({ type, query, ...tableProps })
 * ```
 */
export function useTableSettings<
  TResource extends ListableResourceTypeFor<TApi>,
  TApi extends ApiFlavour = "core",
>({
  config,
  columns,
}: {
  config: TableSettingsConfig
  columns: Array<ResourceTableColumn<TResource, TApi>>
}): {
  tableProps: TableSettingsProps<TResource, TApi>
  menus: JSX.Element | null
} {
  const store = useTableSettingsStore(config)
  const settingsProps = useTableSettingsProps({
    tableSettings: store == null ? undefined : { store, config },
    columns,
  })

  return {
    // until the store has a snapshot the table renders with every column and
    // its own default sort, as it would without settings
    tableProps: settingsProps ?? { columns },
    menus:
      store == null ? null : (
        <TableSettingsMenus store={store} config={config} />
      ),
  }
}
