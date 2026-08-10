import type { ListableResourceType } from "@commercelayer/sdk"
import type { JSX, ReactNode } from "react"
import { useCoreApi } from "#providers/CoreSdkProvider"
import { t } from "#providers/I18NProvider"
import { useTokenProvider } from "#providers/TokenProvider"
import { Button } from "#ui/atoms/Button"
import { ButtonFilter } from "#ui/atoms/ButtonFilter"
import { Icon } from "#ui/atoms/Icon"
import { SkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Tooltip } from "#ui/atoms/Tooltip"
import {
  getClearedFormValues,
  getPillFilters,
  type PillFilter,
} from "./activeFilters"
import { makeFilterAdapters } from "./adapters"
import { FiltersSearchBar } from "./FiltersSearchBar"
import type { FiltersInstructions, FormFullValues } from "./types"

export interface FiltersBarProps {
  /**
   * Url query string to be parsed.
   * It must be "reactive", so most of the time it should come from the router.
   */
  queryString: string
  /**
   * Callback triggered when the user interacts with the search bar or removes a
   * filter. The implementation should update the url query string.
   */
  onUpdate: (newQueryString: string) => void
  /**
   * Filters that are already implied by the current view, typically the ones
   * defining the active tab.
   *
   * They are not rendered as pills, removing a pill reverts that single filter
   * back to the value defined here, and "clear all" reverts to this set rather
   * than to no filters at all.
   */
  defaultValues?: FormFullValues
  /**
   * Overrides the filters button behavior. When set, the built-in drawer is not
   * opened and the app is responsible for rendering the filters form — for
   * example by navigating to a dedicated filters page.
   */
  onFilterClick?: () => void
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
  /**
   * Hide the search bar, keeping the filters button and the pills.
   * @default false
   */
  hideSearchBar?: boolean
  /**
   * Rendered to the right of the filters button, for page level actions such as
   * an export button.
   */
  actions?: ReactNode
}

interface InternalProps {
  instructions: FiltersInstructions
  predicateWhitelist: string[]
  /** Opens the drawer rendered by `FiltersDrawer`. */
  openDrawer: () => void
}

/**
 * Search bar with the filters button on the right and the applied filters
 * rendered as removable pills below.
 */
export function FiltersBar({
  queryString,
  onUpdate,
  defaultValues,
  onFilterClick,
  searchBarPlaceholder,
  searchBarDebounceMs,
  hideSearchBar = false,
  actions,
  instructions,
  predicateWhitelist,
  openDrawer,
}: FiltersBarProps & InternalProps): JSX.Element {
  const { user } = useTokenProvider()
  const { adaptUrlQueryToFormValues, adaptFormValuesToUrlQuery } =
    makeFilterAdapters({ instructions, predicateWhitelist })

  /**
   * Whether the drawer would have anything to show. A `searchBar` text filter is
   * rendered by this bar and skipped by the form (`FieldTextSearch` returns
   * `null` for it), and hidden instructions render nothing — so an instruction
   * set made only of those would open an empty drawer. The button is dropped
   * instead, which is what an app with search but no filters wants.
   */
  const hasFilterFields = instructions.some(
    (item) =>
      item.hidden !== true &&
      !(item.type === "textSearch" && item.render.component === "searchBar"),
  )

  const pills = getPillFilters({
    instructions,
    queryString,
    predicateWhitelist,
    defaultValues,
    timezone: user?.timezone,
    locale: user?.locale,
  })

  const emit = (formValues: FormFullValues): void => {
    onUpdate(adaptFormValuesToUrlQuery({ formValues }))
  }

  const removePill = (pill: PillFilter): void => {
    const formValues = adaptUrlQueryToFormValues({ queryString })

    if (pill.kind === "timeRange") {
      emit({
        ...formValues,
        timePreset: defaultValues?.timePreset,
        timeFrom: defaultValues?.timeFrom,
        timeTo: defaultValues?.timeTo,
      } as FormFullValues)
      return
    }

    emit({
      ...formValues,
      // reverting to the view's own value, or emptying when it defines none
      [pill.id]: defaultValues?.[pill.id] ?? [],
    } as FormFullValues)
  }

  const clearAll = (): void => {
    emit(
      getClearedFormValues({
        instructions,
        queryString,
        predicateWhitelist,
        defaultValues,
      }),
    )
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        {hideSearchBar ? null : (
          // no width class on purpose: `SearchBar` is `w-full`, so this
          // shrink-to-fit wrapper leaves it at its intrinsic width
          <div>
            <FiltersSearchBar
              queryString={queryString}
              placeholder={searchBarPlaceholder ?? t("common.search")}
              debounceMs={searchBarDebounceMs}
              variant="outline"
              instructions={instructions}
              onUpdate={onUpdate}
              predicateWhitelist={predicateWhitelist}
            />
          </div>
        )}

        <div className="flex gap-2 ml-auto">
          {hasFilterFields && (
            <Tooltip
              direction="bottom-end"
              content={t("common.filters")}
              label={
                <Button
                  type="button"
                  alignItems="center"
                  size="small"
                  variant="secondary"
                  aria-label={t("common.filters")}
                  onClick={onFilterClick ?? openDrawer}
                >
                  <Icon name="funnel" size={16} />
                </Button>
              }
            />
          )}
          {actions}
        </div>
      </div>

      {pills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {pills.map((pill) =>
            pill.fetch != null ? (
              <ResourcePill
                key={pill.id}
                label={pill.label}
                resource={pill.fetch.resource}
                ids={pill.fetch.ids}
                fieldForLabel={pill.fetch.fieldForLabel}
                fieldForValue={pill.fetch.fieldForValue}
                onRemoveRequest={() => {
                  removePill(pill)
                }}
              />
            ) : (
              <ButtonFilter
                key={pill.id}
                variant="pill"
                label={pill.label}
                value={pill.value}
                onRemoveRequest={() => {
                  removePill(pill)
                }}
              />
            ),
          )}
          <Button
            type="button"
            variant="secondary"
            size="mini"
            alignItems="center"
            onClick={clearAll}
          >
            <Icon name="trash" size={16} />
            {t("common.clear_all")}
          </Button>
        </div>
      )}
    </>
  )
}

FiltersBar.displayName = "FiltersBar"

/**
 * Pill for a filter backed by a resource: the labels of the selected values live
 * on the resources themselves, so they are retrieved in a single request and
 * joined. Falls back to the raw ids while loading or when a value no longer
 * resolves (e.g. a deleted record).
 */
function ResourcePill({
  label,
  resource,
  ids,
  fieldForLabel,
  fieldForValue,
  onRemoveRequest,
}: {
  label: string
  resource: ListableResourceType
  ids: string[]
  fieldForLabel: string
  fieldForValue: string
  onRemoveRequest: () => void
}): JSX.Element {
  const { data, isLoading } = useCoreApi(
    resource,
    "list",
    [
      {
        fields: { [resource]: [fieldForValue, fieldForLabel] },
        pageSize: 25,
        filters: { [`${fieldForValue}_in`]: ids.join(",") },
      },
    ],
    { revalidateOnFocus: false },
  )

  const labelsById = new Map(
    (data ?? []).map((item) => {
      const record = item as unknown as Record<string, unknown>
      return [String(record[fieldForValue]), String(record[fieldForLabel])]
    }),
  )

  const value = ids.map((id) => labelsById.get(id) ?? id).join(", ")

  return (
    <SkeletonTemplate isLoading={isLoading} delayMs={0}>
      <ButtonFilter
        variant="pill"
        label={label}
        value={value}
        onRemoveRequest={onRemoveRequest}
      />
    </SkeletonTemplate>
  )
}
