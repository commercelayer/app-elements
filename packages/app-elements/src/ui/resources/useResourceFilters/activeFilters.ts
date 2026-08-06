import type { ListableResourceType } from "@commercelayer/sdk"
import castArray from "lodash-es/castArray"
import isDate from "lodash-es/isDate"
import isEmpty from "lodash-es/isEmpty"
import isEqual from "lodash-es/isEqual"
import { formatDateRange } from "#helpers/date"
import { t } from "#providers/I18NProvider"
import {
  formatCentsToCurrency,
  type InputCurrencyProps,
} from "#ui/forms/InputCurrency"
import { makeFilterAdapters } from "./adapters"
import {
  getDefaultBrowserTimezone,
  getTimeRangePresetName,
  isTimeRangeFilterUiName,
} from "./timeUtils"
import {
  type CurrencyRangeFieldValue,
  type FiltersInstructionItem,
  type FiltersInstructions,
  type FormFullValues,
  getInstructionKey,
  isTextSearch,
  type UiFilterValue,
} from "./types"

/**
 * Shared helpers to read the active filters out of a url query string and turn
 * them into human readable labels.
 *
 * Used by both `FiltersNav` (legacy `ButtonFilter` look) and `FiltersBar`
 * (metrics-style pills), so label resolution only ever has one implementation.
 */

export function getInstructionItemByFilterPredicate({
  instructions,
  filterPredicate,
}: {
  instructions: FiltersInstructions
  filterPredicate: string
}): FiltersInstructionItem | undefined {
  if (isTimeRangeFilterUiName(filterPredicate)) {
    return instructions.find(({ type }) => type === "timeRange")
  }
  return instructions.find(
    (item) => getInstructionKey(item) === filterPredicate,
  )
}

/**
 * Get label for user defined ButtonFilter component by reading the `instructionItem` object.
 * If the filter has options and only one value is selected, the label will be the option label.
 * Otherwise, the label will be the filter group label plus the number of selected values.
 */
export function getButtonFilterLabel({
  values,
  instructionItem,
}: {
  values: string | string[]
  instructionItem: FiltersInstructionItem
}): string {
  const isSingleElementArray = Array.isArray(values) && values.length === 1
  const isString = typeof values === "string"
  const optionValue = Array.isArray(values) ? values[0] : values

  if (
    instructionItem.type === "options" &&
    "options" in instructionItem.render.props &&
    instructionItem.render.props.options != null &&
    instructionItem.render.props.options.length > 0 &&
    (isSingleElementArray || isString)
  ) {
    return (
      instructionItem.render.props.options.find(
        ({ value }) => value === optionValue,
      )?.label ?? instructionItem.label
    )
  }

  if (
    instructionItem.type === "groupedPredicates" &&
    (isSingleElementArray || isString)
  ) {
    return (
      instructionItem.render.props.options.find(
        ({ value }) => value === optionValue,
      )?.label ?? instructionItem.label
    )
  }

  if (instructionItem.type === "textSearch") {
    return `${instructionItem.label} · ${optionValue}`
  }

  return `${instructionItem.label} · ${values.length}`
}

export function extractCurrencyRangeFilterValues({
  activeFilters,
  instructions,
}: {
  activeFilters: Array<[string, UiFilterValue]>
  instructions: FiltersInstructions
}): Array<[string, CurrencyRangeFieldValue]> {
  const rangeFilters = activeFilters.filter(([filterPredicate]) => {
    return predicateBelongsToCurrencyRange({
      filterPredicate,
      instructions,
    })
  }) as Array<[string, CurrencyRangeFieldValue]>

  return rangeFilters.filter(
    ([, value]) => value.from != null || value.to != null,
  )
}

/**
 * Checks if a filter predicate belongs to a currency range filter
 * by checking the instructions
 */
export function predicateBelongsToCurrencyRange({
  filterPredicate,
  instructions,
}: {
  filterPredicate: string
  instructions: FiltersInstructions
}): boolean {
  const instructionItem = instructions.find(
    (item) => getInstructionKey(item) === filterPredicate,
  )

  return instructionItem?.type === "currencyRange"
}

export function makeCurrencyRangeFilterButtonLabel(
  value: CurrencyRangeFieldValue,
): string {
  const currencyCode = value.currencyCode as InputCurrencyProps["currencyCode"]
  if (value.from == null && value.to == null) {
    return ""
  }

  const formattedFrom = formatCentsToCurrency(
    value.from ?? 0,
    currencyCode,
    true,
  )

  const formattedTo =
    value.to != null
      ? formatCentsToCurrency(value.to, currencyCode, true)
      : "Max"

  return `${formattedFrom} - ${formattedTo}`
}

/**
 * Resolves every selected value to its option label and joins them.
 *
 * Unlike {@link getButtonFilterLabel}, which collapses multiple values into a
 * counter (`Markets · 2`), this spells them all out (`Europe, Italy`) because a
 * pill already shows the filter name separately.
 */
export function formatPillFilterValue({
  values,
  instructionItem,
}: {
  values: string | string[]
  instructionItem: FiltersInstructionItem
}): string {
  const options =
    (instructionItem.type === "options" ||
      instructionItem.type === "groupedPredicates") &&
    "options" in instructionItem.render.props &&
    instructionItem.render.props.options != null
      ? instructionItem.render.props.options
      : undefined

  return castArray(values)
    .map((value) => {
      const asString = String(value)
      return (
        options?.find((option) => option.value === asString)?.label ?? asString
      )
    })
    .join(", ")
}

/**
 * Compares two filter values ignoring array wrapping and ordering, so that
 * `"placed"`, `["placed"]` and `["placed"]` in a different order all match.
 * Range values (objects) are compared as-is.
 */
export function isSameFilterValue(a: unknown, b: unknown): boolean {
  if (isEqual(a, b)) {
    return true
  }

  const isRange = (value: unknown): boolean =>
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !isDate(value)

  if (isRange(a) || isRange(b)) {
    return false
  }

  const normalize = (value: unknown): string[] =>
    castArray(value ?? [])
      .map((item) => String(item))
      .sort()

  return isEqual(normalize(a), normalize(b))
}

export interface PillFilter {
  /**
   * Predicate of the filter, or `timePreset` for the time range.
   * Used as react key and to know what to reset when removing the pill.
   */
  id: string
  /** Filter group label, e.g. `Payment status`. */
  label: string
  /**
   * Formatted value(s), e.g. `Paid, Authorized`.
   * `undefined` when it has to be resolved by fetching the resource, see `fetch`.
   */
  value?: string
  /**
   * Set for `inputResourceGroup` filters with a single selected value, whose
   * label lives on the resource itself and has to be retrieved.
   */
  fetch?: {
    resource: ListableResourceType
    id: string
    fieldForLabel: string
  }
  /** Which reset strategy the remove button has to apply. */
  kind: "group" | "timeRange"
}

/**
 * Reads the url query string and returns one descriptor per active filter, ready
 * to be rendered as a pill.
 *
 * Filters matching `defaultValues` are omitted: on a page where the current view
 * (e.g. a tab) already implies a set of filters, only the user's additions are
 * worth showing as removable pills.
 *
 * The free text filter is always omitted, since it is already visible in the
 * search bar, and so are hidden filters and `viewTitle`.
 */
export function getPillFilters({
  instructions,
  queryString,
  predicateWhitelist,
  defaultValues = {},
  timezone,
  locale,
}: {
  instructions: FiltersInstructions
  queryString: string
  predicateWhitelist: string[]
  defaultValues?: FormFullValues
  timezone?: string
  locale?: Parameters<typeof formatDateRange>[0]["locale"]
}): PillFilter[] {
  const { adaptUrlQueryToFormValues } = makeFilterAdapters({
    instructions,
    predicateWhitelist,
  })

  const filters = adaptUrlQueryToFormValues({ queryString })

  if (filters == null) {
    return []
  }

  const hiddenFilters = instructions
    .filter((item) => item.hidden === true)
    .map((item) => getInstructionKey(item))

  const textPredicate = instructions.find(isTextSearch)?.sdk.predicate

  const activeFilters: Array<[string, UiFilterValue]> = Object.entries(filters)
    .filter(([, value]) => isDate(value) || !isEmpty(value))
    .filter(([filterName]) => !hiddenFilters.includes(filterName))
    .filter(([filterName]) => filterName !== "viewTitle")
    // the free text filter is already rendered by the search bar
    .filter(([filterName]) => filterName !== textPredicate)

  const pills: PillFilter[] = []

  const userDefinedFilters = activeFilters.filter(
    ([filterPredicate]) =>
      !isTimeRangeFilterUiName(filterPredicate) &&
      !predicateBelongsToCurrencyRange({ filterPredicate, instructions }),
  ) as Array<[string, string | string[]]>

  for (const [filterPredicate, value] of userDefinedFilters) {
    if (isSameFilterValue(value, defaultValues[filterPredicate])) {
      continue
    }

    const instructionItem = getInstructionItemByFilterPredicate({
      instructions,
      filterPredicate,
    })

    if (instructionItem == null) {
      continue
    }

    const arrValue = castArray(value)

    // the label of a single selected resource has to be retrieved
    if (
      instructionItem.render.component === "inputResourceGroup" &&
      arrValue[0] !== undefined &&
      arrValue.length === 1
    ) {
      pills.push({
        id: filterPredicate,
        label: instructionItem.label,
        kind: "group",
        fetch: {
          resource: instructionItem.render.props.resource,
          id: arrValue[0],
          fieldForLabel: instructionItem.render.props.fieldForLabel,
        },
      })
      continue
    }

    pills.push({
      id: filterPredicate,
      label: instructionItem.label,
      value: formatPillFilterValue({ values: value, instructionItem }),
      kind: "group",
    })
  }

  for (const [filterPredicate, rangeValue] of extractCurrencyRangeFilterValues({
    activeFilters,
    instructions,
  })) {
    if (isSameFilterValue(rangeValue, defaultValues[filterPredicate])) {
      continue
    }

    const instructionItem = getInstructionItemByFilterPredicate({
      instructions,
      filterPredicate,
    })

    if (instructionItem == null) {
      continue
    }

    pills.push({
      id: filterPredicate,
      label: instructionItem.label,
      value: makeCurrencyRangeFilterButtonLabel(rangeValue),
      kind: "group",
    })
  }

  const selectedTimePreset = filters.timePreset
  const selectedTimeFrom = filters.timeFrom
  const selectedTimeTo = filters.timeTo

  if (
    selectedTimePreset != null &&
    !isSameFilterValue(selectedTimePreset, defaultValues.timePreset)
  ) {
    const instructionItem = instructions.find(
      ({ type }) => type === "timeRange",
    )

    if (instructionItem != null) {
      if (selectedTimePreset === "custom") {
        if (selectedTimeFrom != null && selectedTimeTo != null) {
          pills.push({
            id: "timePreset",
            label: instructionItem.label,
            kind: "timeRange",
            value: formatDateRange({
              rangeFrom: selectedTimeFrom.toString(),
              rangeTo: selectedTimeTo.toString(),
              timezone: timezone ?? getDefaultBrowserTimezone(),
              locale,
            }),
          })
        }
      } else {
        pills.push({
          id: "timePreset",
          label: instructionItem.label,
          kind: "timeRange",
          value: getTimeRangePresetName(selectedTimePreset, t),
        })
      }
    }
  }

  return pills
}

/**
 * Form values to apply when clearing all the filters at once.
 *
 * Hidden filters, `viewTitle` and the free text search are preserved — they are
 * not represented as pills, so wiping them would be an invisible side effect.
 * Everything else goes back to `defaultValues` (empty when not provided).
 */
export function getClearedFormValues({
  instructions,
  queryString,
  predicateWhitelist,
  defaultValues = {},
}: {
  instructions: FiltersInstructions
  queryString: string
  predicateWhitelist: string[]
  defaultValues?: FormFullValues
}): FormFullValues {
  const { adaptUrlQueryToFormValues } = makeFilterAdapters({
    instructions,
    predicateWhitelist,
  })

  const emptyFilters = adaptUrlQueryToFormValues({ queryString: "" })
  const currentFilters = adaptUrlQueryToFormValues({ queryString })

  const hiddenFilters = instructions
    .filter((item) => item.hidden === true)
    .map((item) => getInstructionKey(item))
  const textPredicate = instructions.find(isTextSearch)?.sdk.predicate

  const filtersToKeep = Object.entries(currentFilters).reduce<FormFullValues>(
    (toKeep, [filterName, value]) => {
      const isToKeep =
        hiddenFilters.includes(filterName) ||
        filterName === "viewTitle" ||
        filterName === textPredicate

      return isToKeep ? { ...toKeep, [filterName]: value } : toKeep
    },
    {},
  )

  return { ...emptyFilters, ...defaultValues, ...filtersToKeep }
}
