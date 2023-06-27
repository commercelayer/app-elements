import { type QueryFilter } from '@commercelayer/sdk/lib/cjs/query'
import castArray from 'lodash/castArray'
import isBoolean from 'lodash/isBoolean'
import isEmpty from 'lodash/isEmpty'
import omitBy from 'lodash/omitBy'
import { makeSdkFilterTime } from './timeUtils'
import {
  isItemOptions,
  isTextSearch,
  type FilterItemOptions,
  type FilterItemTextSearch,
  type FiltersInstructions,
  type TimeRangePreset,
  type UiFilterName,
  type UiFilterValue
} from './types'

export interface AdaptFormValuesToSdkParams<FilterFormValues> {
  formValues: FilterFormValues
  timezone?: string
  instructions: FiltersInstructions
}

/**
 * Covert FilterFormValues in SDK filter object
 * @param formValues a valid FilterFormValues object
 * @returns an object of type QueryFilter to be used in the SDK stripping out empty or undefined values
 */
export function adaptFormValuesToSdk<
  FilterFormValues extends Record<UiFilterName, UiFilterValue>
>({
  formValues,
  instructions,
  timezone
}: AdaptFormValuesToSdkParams<FilterFormValues>): QueryFilter {
  const formFieldNames = instructions
    .filter(
      (item): item is FilterItemOptions | FilterItemTextSearch =>
        isItemOptions(item) || isTextSearch(item)
    )
    .map((item) => item.sdk.predicate)

  const sdkFilters = formFieldNames.reduce<Partial<QueryFilter>>(
    (acc, key) => {
      const instructionItem = instructions.find(
        (item) => item.sdk.predicate === key
      )

      if (instructionItem == null) {
        return acc
      }

      // user custom defined parseFormValue function
      if (
        'parseFormValue' in instructionItem.sdk &&
        instructionItem.sdk.parseFormValue != null
      ) {
        return {
          ...acc,
          [key]: instructionItem.sdk.parseFormValue(formValues[key])
        }
      }

      if (
        instructionItem.type === 'options' ||
        instructionItem.type === 'textSearch'
      ) {
        return {
          ...acc,
          [key]: castArray(formValues[key]).join(',')
        }
      }

      return acc
    },
    {
      ...makeSdkFilterTime({
        sdkFilterName: instructions.find((item) => item.type === 'timeRange')
          ?.sdk.predicate,
        timePreset: formValues.timePreset as TimeRangePreset | undefined,
        timeFrom: formValues.timeFrom as Date | undefined,
        timeTo: formValues.timeTo as Date | undefined,
        timezone
      })
    }
  )

  // stripping out empty or undefined values
  const noEmpty = omitBy(
    sdkFilters,
    (v) => isEmpty(v) && !isBoolean(v)
  ) as QueryFilter

  // enforce default values when not set, to prevent empty values to return unwanted data
  return enforceDefaultFiltersWhenEmpty(
    noEmpty,
    extractEnforcedValues(instructions)
  )
}

export function extractEnforcedValues(
  instructions: FiltersInstructions
): QueryFilter {
  return instructions
    .filter(isItemOptions)
    .filter((item) => item.sdk.restrictToOptions === true)
    .reduce<QueryFilter>((acc, item) => {
      if (
        !('options' in item.render.props) ||
        ('options' in item.render.props && item.render.props.options == null)
      ) {
        return acc
      }
      return {
        ...acc,
        [item.sdk.predicate]: item.render.props.options
          .map((option) => option.value)
          .join(',')
      }
    }, {})
}

/**
 * Be sure to have all the default values
 * to prevent listing draft or pending orders
 */
export function enforceDefaultFiltersWhenEmpty(
  filters: QueryFilter,
  enforcedValues: QueryFilter
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
          [key]: enforcedValue
        }
      }
      return acc
    },
    filters
  )

  return enforcedFilters
}
