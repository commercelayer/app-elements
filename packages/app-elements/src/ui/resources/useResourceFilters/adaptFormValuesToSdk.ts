import type { QueryFilter } from "@commercelayer/sdk"
import castArray from "lodash-es/castArray"
import isBoolean from "lodash-es/isBoolean"
import isEmpty from "lodash-es/isEmpty"
import isNumber from "lodash-es/isNumber"
import omitBy from "lodash-es/omitBy"
import { makeSdkFilterTime } from "./timeUtils"
import {
  type CurrencyRangeFieldValue,
  type FilterItemCurrencyRange,
  type FilterItemGroupedPredicates,
  type FilterItemOptions,
  type FilterItemTextSearch,
  type FiltersInstructions,
  getInstructionKey,
  isCurrencyRange,
  isGroupedPredicates,
  isItemOptions,
  isTextSearch,
  type TimeRangePreset,
  type UiFilterName,
  type UiFilterValue,
} from "./types"

export interface AdaptFormValuesToSdkParams<FilterFormValues> {
  formValues: FilterFormValues
  timezone?: string
  instructions: FiltersInstructions
  predicateWhitelist?: string[]
}

/**
 * Covert FilterFormValues in SDK filter object
 * @param formValues a valid FilterFormValues object
 * @returns an object of type QueryFilter to be used in the SDK stripping out empty or undefined values
 */
export function adaptFormValuesToSdk<
  FilterFormValues extends Record<
    UiFilterName,
    UiFilterValue | CurrencyRangeFieldValue
  >,
>({
  formValues,
  instructions,
  timezone,
  predicateWhitelist = [],
}: AdaptFormValuesToSdkParams<FilterFormValues>): QueryFilter {
  const formFieldNames = instructions
    .filter(
      (
        item,
      ): item is
        | FilterItemOptions
        | FilterItemTextSearch
        | FilterItemCurrencyRange
        | FilterItemGroupedPredicates =>
        isItemOptions(item) ||
        isTextSearch(item) ||
        isCurrencyRange(item) ||
        isGroupedPredicates(item),
    )
    .flatMap((item) =>
      ([] as string[])
        .concat(getInstructionKey(item))
        .concat(predicateWhitelist),
    )

  const sdkFilters = formFieldNames.reduce<Partial<QueryFilter>>(
    (acc, key) => {
      const instructionItem = instructions.find(
        (item) => getInstructionKey(item) === key,
      )

      if (instructionItem == null) {
        if (predicateWhitelist.includes(key)) {
          return {
            ...acc,
            [key]: formValues[key],
          }
        }

        return acc
      }

      // user custom defined parseFormValue function
      if (
        instructionItem.type !== "groupedPredicates" &&
        "parseFormValue" in instructionItem.sdk &&
        instructionItem.sdk.parseFormValue != null
      ) {
        return {
          ...acc,
          [key]: instructionItem.sdk.parseFormValue(formValues[key]),
        }
      }

      if (
        instructionItem.type === "options" ||
        instructionItem.type === "textSearch"
      ) {
        return {
          ...acc,
          [key]: castArray(formValues[key]).join(","),
        }
      }

      if (instructionItem.type === "currencyRange") {
        const currencyRangeField = formValues[key] as CurrencyRangeFieldValue
        const currencyFrom = currencyRangeField?.from ?? undefined
        const currencyTo = currencyRangeField?.to ?? undefined
        const currencyCode =
          currencyFrom != null || currencyTo != null
            ? (currencyRangeField?.currencyCode ?? undefined)
            : undefined
        return {
          ...acc,
          [`${key}_gteq`]: currencyFrom,
          [`${key}_lteq`]: currencyTo,
          currency_code_eq: currencyCode,
        }
      }

      if (instructionItem.type === "groupedPredicates") {
        // Each selected option value maps to its own distinct SDK predicate + value
        const selectedValues = castArray(formValues[key]).filter(
          Boolean,
        ) as string[]
        return selectedValues.reduce((innerAcc, selectedValue) => {
          const option = instructionItem.render.props.options.find(
            (o) => o.value === selectedValue,
          )
          if (option == null) return innerAcc
          return {
            ...innerAcc,
            [option.sdk.predicate]: option.sdk.value,
          }
        }, acc)
      }

      return acc
    },
    {
      ...makeSdkFilterTime({
        sdkFilterName: instructions.find((item) => item.type === "timeRange")
          ?.sdk.predicate,
        timePreset: formValues.timePreset as TimeRangePreset | undefined,
        timeFrom: formValues.timeFrom as Date | undefined,
        timeTo: formValues.timeTo as Date | undefined,
        timezone,
      }),
    },
  )

  // stripping out empty or undefined values
  const noEmpty = omitBy(
    sdkFilters,
    (v) => isEmpty(v) && !isBoolean(v) && !isNumber(v),
  ) as QueryFilter

  // enforce default values when not set, to prevent empty values to return unwanted data
  return enforceDefaultFiltersWhenEmpty(
    noEmpty,
    extractEnforcedValues(instructions),
  )
}

export function extractEnforcedValues(
  instructions: FiltersInstructions,
): QueryFilter {
  const instructionsWithDefaultOptions = instructions
    .filter(isItemOptions)
    .filter(
      (item) =>
        item.sdk.defaultOptions != null && item.sdk.defaultOptions.length > 0,
    )
  return instructionsWithDefaultOptions.reduce<QueryFilter>((acc, item) => {
    if (
      item.sdk.defaultOptions == null ||
      item.sdk.defaultOptions.length === 0
    ) {
      return acc
    }

    return {
      ...acc,
      [item.sdk.predicate]: item.sdk.defaultOptions.join(","),
    }
  }, {})
}

/**
 * Be sure to have all the default values
 * to prevent listing draft or pending orders
 */
export function enforceDefaultFiltersWhenEmpty(
  filters: QueryFilter,
  enforcedValues: QueryFilter,
): QueryFilter {
  if (isEmpty(enforcedValues)) {
    return filters
  }

  const enforcedFilters = Object.keys(enforcedValues).reduce<QueryFilter>(
    (acc, key) => {
      const enforcedValue = enforcedValues[key]
      if (isEmpty(filters[key]) && enforcedValue != null) {
        return {
          ...acc,
          [key]: enforcedValue,
        }
      }
      return acc
    },
    filters,
  )

  return enforcedFilters
}
