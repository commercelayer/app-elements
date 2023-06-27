import { type FormFullValues } from '#filters/methods/types'
import castArray from 'lodash/castArray'
import compact from 'lodash/compact'
import qs, { type ParsedQuery } from 'query-string'
import {
  filtrableTimeRangePreset,
  type FiltersInstructions,
  type UiFilterName,
  type UiFilterValue
} from './types'
import { getAllowedValuesFromItemOptions } from './utils'

export interface AdaptUrlQueryToFormValuesParams {
  queryString: string
  instructions: FiltersInstructions
}

/**
 * Covert query string in filters form values
 * @param qs url query string
 * @returns an object containing FilterFormValues
 */
export function adaptUrlQueryToFormValues<
  FilterFormValues extends Record<UiFilterName, UiFilterValue>
>({
  queryString,
  instructions
}: AdaptUrlQueryToFormValuesParams): FilterFormValues & FormFullValues {
  const parsedQuery = qs.parse(queryString)

  const allowedQueryParams = instructions.map((item) => item.sdk.predicate)

  // parse a single filter key value to return
  // an array of valid values or an empty array
  const parseQueryStringValueAsArray = <TFiltrableValue extends string>(
    value?: ParsedQuery[string],
    acceptedValues?: Readonly<TFiltrableValue[]>
  ): TFiltrableValue[] => {
    if (value == null) {
      return []
    }
    const cleanValue = compact(castArray(value) as TFiltrableValue[])
    if (acceptedValues != null) {
      return cleanValue.filter((v) => acceptedValues.includes(v))
    }
    return cleanValue
  }

  const parseQueryStringValueAsDate = (value: unknown): Date | undefined => {
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/
    if (typeof value !== 'string' || !isoRegex.test(value)) {
      return undefined
    }
    try {
      return new Date(value)
    } catch {
      return undefined
    }
  }

  const formValues = allowedQueryParams.reduce(
    (formValues, key) => {
      const instructionItem = instructions.find(
        (item) => item.sdk.predicate === key
      )

      if (instructionItem == null) {
        return formValues
      }

      // single option, return first value only
      if (
        instructionItem.type === 'options' &&
        instructionItem.render.component === 'toggleButtons' &&
        instructionItem.render.props.mode === 'single'
      ) {
        return parsedQuery[key] != null
          ? {
              ...formValues,
              [key]: parseQueryStringValueAsArray(
                parsedQuery[key],
                getAllowedValuesFromItemOptions(instructionItem)
              )[0]
            }
          : {
              ...formValues,
              [key]: undefined
            }
      }

      // multi options
      if (instructionItem.type === 'options') {
        return parsedQuery[key] != null
          ? {
              ...formValues,
              [key]: parseQueryStringValueAsArray(
                parsedQuery[key],
                getAllowedValuesFromItemOptions(instructionItem)
              )
            }
          : {
              ...formValues,
              [key]: []
            }
      }

      if (instructionItem.type === 'textSearch') {
        return parsedQuery[key] != null
          ? {
              ...formValues,
              [key]: parseQueryStringValueAsArray(parsedQuery[key])[0]
            }
          : {
              ...formValues,
              [key]: undefined
            }
      }

      return formValues
    },
    {
      timePreset: parseQueryStringValueAsArray(
        parsedQuery.timePreset,
        filtrableTimeRangePreset
      )[0],
      timeFrom: parseQueryStringValueAsDate(parsedQuery.timeFrom),
      timeTo: parseQueryStringValueAsDate(parsedQuery.timeTo),
      viewTitle: parseQueryStringValueAsArray(parsedQuery.viewTitle)[0]
    }
  ) as FilterFormValues & FormFullValues

  return formValues
}
