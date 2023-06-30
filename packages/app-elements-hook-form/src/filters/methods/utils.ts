import isEmpty from 'lodash/isEmpty'
import { adaptUrlQueryToFormValues } from './adaptUrlQueryToFormValues'
import {
  type FilterItemOptions,
  type FiltersInstructions,
  type UiFilterName,
  type UiFilterValue
} from './types'

/**
 * Show the filter label with the counter for selected options
 * or just the total of available options when nothing is selected
 * @param options
 * @returns string
 *
 * @example
 * "Markets · 2 of 4"
 * "Markets · 4"
 */
export function computeFilterLabel({
  label,
  totalCount,
  selectedCount
}: {
  label: string
  totalCount: number
  selectedCount: number
}): string {
  const counter =
    selectedCount > 0 ? `${selectedCount} of ${totalCount}` : totalCount
  return `${label} · ${counter}`
}

/**
 * Get total count of active filter groups from URL query string.
 * @param includeTextSearch if `true` will count `text` filter as active filter group
 * @returns number of active filters
 * Example: if we have 3 markets selected, will still count as `1` active filter group
 * If we have 3 markets and 1 status selected, will count as `2`.
 */
export function getActiveFilterCountFromUrl({
  includeTextSearch = false,
  instructions,
  queryString
}: {
  includeTextSearch?: boolean
  instructions: FiltersInstructions
  queryString: string
}): number {
  const formValues = adaptUrlQueryToFormValues<
    Record<UiFilterName, UiFilterValue>
  >({
    queryString,
    instructions
  })

  return instructions.reduce((total, instructionItem) => {
    const { predicate } = instructionItem.sdk

    if (instructionItem.hidden === true) {
      return total
    }

    // count textSearch only if explicitly asked
    if (
      instructionItem.type === 'textSearch' &&
      predicate in formValues &&
      !isEmpty(formValues[predicate])
    ) {
      return includeTextSearch ? total + 1 : total
    }

    // count user custom defied
    if (
      instructionItem.type !== 'timeRange' &&
      predicate in formValues &&
      !isEmpty(formValues[predicate])
    ) {
      return total + 1
    }

    // count timePreset if set
    if (
      instructionItem.type === 'timeRange' &&
      !isEmpty(formValues.timePreset)
    ) {
      return total + 1
    }

    return total
  }, 0)
}

export function getAllowedValuesFromItemOptions(
  instructionItem: FilterItemOptions
): string[] | undefined {
  return 'options' in instructionItem.render.props &&
    instructionItem.render.props.options != null
    ? instructionItem.render.props.options.map((o) => o.value)
    : undefined
}
