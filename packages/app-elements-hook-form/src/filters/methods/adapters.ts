import { adaptFormValuesToSdk as adaptFormValuesToSdkFn } from './adaptFormValuesToSdk'
import { adaptFormValuesToUrlQuery as adaptFormValuesToUrlQueryFn } from './adaptFormValuesToUrlQuery'
import { adaptUrlQueryToFormValues as adaptUrlQueryToFormValuesFn } from './adaptUrlQueryToFormValues'
import { adaptUrlQueryToSdk as adaptUrlQueryToSdkFn } from './adaptUrlQueryToSdk'
import { adaptUrlQueryToUrlQuery as adaptUrlQueryToUrlQueryFn } from './adaptUrlQueryToUrlQuery'
import type { MakeFiltersAdapters } from './adapters.types'
import { type FiltersInstructions } from './types'

export const makeFilterAdapters: MakeFiltersAdapters = ({ instructions }) => {
  const validInstructions = isValidInstructions(instructions)
    ? instructions
    : []

  return {
    adaptFormValuesToUrlQuery: (params) => adaptFormValuesToUrlQueryFn(params),

    adaptFormValuesToSdk: (params) =>
      adaptFormValuesToSdkFn({
        ...params,
        instructions: validInstructions
      }),

    adaptUrlQueryToFormValues: (params) =>
      adaptUrlQueryToFormValuesFn({
        ...params,
        instructions: validInstructions
      }),

    adaptUrlQueryToSdk: (params) =>
      adaptUrlQueryToSdkFn({
        ...params,
        instructions: validInstructions
      }),

    adaptUrlQueryToUrlQuery: (params) =>
      adaptUrlQueryToUrlQueryFn({
        ...params,
        instructions: validInstructions
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
    instructions.filter((item) => item.type === 'textSearch')?.length > 1

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
