import { type JSX, useSyncExternalStore } from "react"
import { t } from "#providers/I18NProvider"
import { Button } from "#ui/atoms/Button"
import { Icon, type IconProps } from "#ui/atoms/Icon"
import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
} from "#ui/composite/Dropdown"
import {
  isColumnVisible,
  resolveTableSort,
  type TableSettingsConfig,
  type TableSettingsStore,
  type TableSortDirection,
  type TableSortOption,
} from "./tableSettings"

interface TableSettingsMenusProps {
  store: TableSettingsStore
  config: TableSettingsConfig
}

/**
 * The sort and columns buttons of the filters bar, each opening its menu.
 *
 * Both menus stay open while the user picks, since changing field and direction,
 * or toggling several columns, is one gesture; they close on click-away or Escape.
 */
export function TableSettingsMenus({
  store,
  config,
}: TableSettingsMenusProps): JSX.Element {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot)
  const activeSort = resolveTableSort(config, state.sort)

  return (
    <>
      {activeSort != null && (
        <Dropdown
          closeOnItemClick={false}
          dropdownLabel={menuButton(
            "arrowsDownUp",
            t("common.table_settings.sort"),
          )}
          dropdownItems={
            <>
              <DropdownLabel label={t("common.table_settings.sort_by")} />
              {config.sortOptions.map((option) => (
                <DropdownItem
                  key={option.id}
                  role="menuitemradio"
                  label={option.label}
                  checked={option.id === activeSort.option.id}
                  onClick={() => {
                    // the direction carries over, and its words follow the new
                    // option's kind
                    store.setSort({
                      id: option.id,
                      direction: activeSort.value.direction,
                    })
                  }}
                />
              ))}
              <DropdownDivider />
              <DropdownLabel
                label={t("common.table_settings.sort_direction")}
              />
              {sortDirections(activeSort.option.kind).map((direction) => (
                <DropdownItem
                  key={direction}
                  role="menuitemradio"
                  label={sortDirectionLabel(activeSort.option.kind, direction)}
                  checked={direction === activeSort.value.direction}
                  onClick={() => {
                    store.setSort({ id: activeSort.option.id, direction })
                  }}
                />
              ))}
            </>
          }
        />
      )}
      {state.columnEntries.length > 0 && (
        <Dropdown
          closeOnItemClick={false}
          // below `md` the table shows only its primary column, so there is
          // nothing for this menu to change
          className="hidden md:block"
          dropdownLabel={menuButton("gear", t("common.table_settings.columns"))}
          dropdownItems={
            <>
              <DropdownLabel label={t("common.table_settings.edit_columns")} />
              {state.columnEntries.map((column) => {
                const visible = isColumnVisible(column, state.columns)
                return (
                  <DropdownItem
                    key={column.id}
                    label={column.label}
                    checked={visible}
                    onClick={() => {
                      store.setColumnVisible(column, !visible)
                    }}
                  />
                )
              })}
            </>
          }
        />
      )}
    </>
  )
}

/**
 * The trigger of a menu. Returned as a `Button` element rather than wrapped in a
 * component of its own: `Dropdown` only adopts a trigger it recognizes as a
 * `Button`, and wraps anything else in a button of its own.
 */
function menuButton(icon: IconProps["name"], label: string): JSX.Element {
  return (
    <Button
      type="button"
      alignItems="center"
      size="small"
      variant="secondary"
      aria-label={label}
      // the browser's own tooltip, so the button carries its name itself
      title={label}
    >
      <Icon name={icon} size={16} />
    </Button>
  )
}

/** The two directions, in the order that reads naturally for the kind. */
function sortDirections(
  kind: TableSortOption["kind"],
): [TableSortDirection, TableSortDirection] {
  return kind === "text" || kind === "schedule"
    ? ["asc", "desc"]
    : ["desc", "asc"]
}

function sortDirectionLabel(
  kind: TableSortOption["kind"],
  direction: TableSortDirection,
): string {
  switch (kind) {
    case "date":
      return direction === "desc"
        ? t("common.table_settings.newest_first")
        : t("common.table_settings.oldest_first")
    case "schedule":
      return direction === "asc"
        ? t("common.table_settings.soonest_first")
        : t("common.table_settings.latest_first")
    case "text":
      return direction === "asc"
        ? t("common.table_settings.a_to_z")
        : t("common.table_settings.z_to_a")
    case "number":
      return direction === "desc"
        ? t("common.table_settings.highest_first")
        : t("common.table_settings.lowest_first")
  }
}
