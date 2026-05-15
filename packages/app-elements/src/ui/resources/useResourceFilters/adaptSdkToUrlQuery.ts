import type { QueryFilter } from "@commercelayer/sdk"
import queryString from "query-string"
import {
  type FiltersInstructions,
  isGroupedPredicates,
} from "#ui/resources/useResourceFilters/types"
import { adaptUrlQueryToUrlQuery } from "./adaptUrlQueryToUrlQuery"

export interface AdaptSdkToUrlQueryParams {
  sdkFilters: QueryFilter
  instructions: FiltersInstructions
  predicateWhitelist?: string[]
}

export function adaptSdkToUrlQuery({
  sdkFilters,
  predicateWhitelist,
  instructions,
}: AdaptSdkToUrlQueryParams): string {
  // Invert groupedPredicates option predicates back to their virtual URL param keys
  // before entering the standard URL pipeline, otherwise they would be dropped as unknown.
  const resolvedFilters = invertGroupedPredicates(sdkFilters, instructions)

  const sdkFiltersWithArrayValues = Object.entries(resolvedFilters).reduce(
    (acc, [key, value]) => {
      return {
        ...acc,
        [key]:
          key.includes("_in") && typeof value === "string"
            ? value.split(",")
            : value,
      }
    },
    {},
  )

  const query = queryString.stringify(sdkFiltersWithArrayValues)

  return adaptUrlQueryToUrlQuery({
    queryString: query,
    predicateWhitelist,
    instructions,
  })
}

/**
 * Converts SDK predicates produced by `groupedPredicates` options back to the
 * corresponding virtual URL param key + option value, so the result can be
 * understood by `adaptUrlQueryToUrlQuery`.
 *
 * Example: an instruction with `urlParamKey: "availability"` has an option
 * `{ value: "in_stock", sdk: { predicate: "quantity_gteq", value: "1" } }`.
 * When `sdkFilters` contains `{ quantity_gteq: "1" }`, this returns
 * `{ availability: "in_stock" }` — removing `quantity_gteq` from the result.
 */
function invertGroupedPredicates(
  sdkFilters: QueryFilter,
  instructions: FiltersInstructions,
): QueryFilter {
  const groupedInstructions = instructions.filter(isGroupedPredicates)
  if (groupedInstructions.length === 0) return sdkFilters

  const consumedSdkKeys = new Set<string>()
  const virtualParams: Record<string, string | string[]> = {}

  for (const instruction of groupedInstructions) {
    const matchedOptionValues: string[] = []
    const matchedSdkPredicates: string[] = []

    for (const option of instruction.render.props.options) {
      const sdkValue = sdkFilters[option.sdk.predicate]
      if (sdkValue != null && String(sdkValue) === option.sdk.value) {
        matchedOptionValues.push(option.value)
        matchedSdkPredicates.push(option.sdk.predicate)
      }
    }

    if (matchedOptionValues.length === 0) continue

    const isSingleMode = instruction.render.props.mode === "single"

    // In single mode, multiple matches cannot be represented without losing
    // information. Leave the original SDK predicates untouched instead.
    if (isSingleMode && matchedOptionValues.length > 1) continue

    const [firstValue] = matchedOptionValues
    if (firstValue == null) continue

    for (const predicate of matchedSdkPredicates) {
      consumedSdkKeys.add(predicate)
    }

    // Single mode: only one option can be active at a time
    // Multi mode: multiple options can be active simultaneously
    virtualParams[instruction.urlParamKey] = isSingleMode
      ? firstValue
      : matchedOptionValues
  }

  if (consumedSdkKeys.size === 0) return sdkFilters

  // Strip the consumed SDK keys and inject the virtual URL params in their place
  return Object.entries(sdkFilters).reduce<QueryFilter>((acc, [key, value]) => {
    if (consumedSdkKeys.has(key)) return acc
    return { ...acc, [key]: value }
  }, virtualParams)
}
