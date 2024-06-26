import { adaptFormValuesToSdk as adaptFormValuesToSdkFn } from './adaptFormValuesToSdk'
import { adaptFormValuesToUrlQuery as adaptFormValuesToUrlQueryFn } from './adaptFormValuesToUrlQuery'
import { adaptSdkToMetrics as adaptSdkToMetricsFn } from './adaptSdkToMetrics'
import { adaptSdkToUrlQuery as adaptSdkToUrlQueryFn } from './adaptSdkToUrlQuery'
import { adaptUrlQueryToFormValues as adaptUrlQueryToFormValuesFn } from './adaptUrlQueryToFormValues'
import { adaptUrlQueryToSdk as adaptUrlQueryToSdkFn } from './adaptUrlQueryToSdk'
import { adaptUrlQueryToUrlQuery as adaptUrlQueryToUrlQueryFn } from './adaptUrlQueryToUrlQuery'
import type { MakeFiltersAdapters } from './adapters.types'
import { type FiltersInstructions } from './types'

export const makeFilterAdapters: MakeFiltersAdapters = ({
  instructions,
  predicateWhitelist
}) => {
  const validInstructions = isValidInstructions(instructions)
    ? instructions
    : []

  return {
    adaptFormValuesToUrlQuery: (params) =>
      adaptFormValuesToUrlQueryFn({
        ...params,
        instructions: validInstructions
      }),

    adaptFormValuesToSdk: (params) =>
      adaptFormValuesToSdkFn({
        ...params,
        instructions: validInstructions,
        predicateWhitelist
      }),

    adaptUrlQueryToFormValues: (params) =>
      adaptUrlQueryToFormValuesFn({
        ...params,
        instructions: validInstructions,
        predicateWhitelist
      }),

    adaptUrlQueryToSdk: (params) =>
      adaptUrlQueryToSdkFn({
        ...params,
        instructions: validInstructions,
        predicateWhitelist
      }),

    adaptUrlQueryToUrlQuery: (params) =>
      adaptUrlQueryToUrlQueryFn({
        ...params,
        instructions: validInstructions,
        predicateWhitelist
      }),

    adaptSdkToMetrics: (params) =>
      adaptSdkToMetricsFn({
        ...params,
        instructions: validInstructions,
        predicateWhitelist
      }),

    adaptSdkToUrlQuery: (params) =>
      adaptSdkToUrlQueryFn({
        ...params,
        instructions: validInstructions,
        predicateWhitelist
      }),

    validInstructions
  }
}

/**
 * Checks if instructions are valid by checking if there are multiple text or timePreset filters.
 * Also checks if reserved uiFilterName are not used for other types.
 * reserved uiFilterName are 'text' and 'timePreset' , 'timeFrom', 'timeTo'
 */
function isValidInstructions(instructions: FiltersInstructions): boolean {
  const hasMultipleText =
    instructions.filter(
      (item) =>
        item.type === 'textSearch' && item.render.component === 'searchBar'
    )?.length > 1

  const hasMultipleTimePreset =
    instructions.filter((item) => item.type === 'timeRange')?.length > 1

  const hasReservedTimePresetUiFilterName =
    instructions.filter(
      (item) =>
        (item.sdk.predicate === 'timePreset' && item.type !== 'timeRange') ||
        item.sdk.predicate === 'timeFrom' ||
        item.sdk.predicate === 'timeTo'
    )?.length > 0

  const isInvalid =
    hasMultipleText ||
    hasMultipleTimePreset ||
    hasReservedTimePresetUiFilterName

  if (isInvalid) {
    console.error('Invalid instructions: ', {
      hasMultipleText,
      hasMultipleTimePreset,
      hasReservedTimePresetUiFilterName
    })
  }

  return !isInvalid
}
