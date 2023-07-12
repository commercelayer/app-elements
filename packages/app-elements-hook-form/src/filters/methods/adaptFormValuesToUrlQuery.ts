import {
  isCurrencyRange,
  type CurrencyRangeFieldValue,
  type FiltersInstructions
} from '#filters/methods/types'
import { isNumber } from 'lodash'
import isEmpty from 'lodash/isEmpty'
import omitBy from 'lodash/omitBy'
import queryString from 'query-string'
import type { FormFullValues } from './types'

export interface AdaptFormValuesToUrlQueryParams<
  FilterFormValues extends FormFullValues
> {
  formValues: FilterFormValues
  instructions: FiltersInstructions
}

/**
 * Covert FilterFormValues in url query string
 * @param formValues a valid FilterFormValues object
 * @returns a string ready to be used in URL
 */
export function adaptFormValuesToUrlQuery<
  FilterFormValues extends FormFullValues
>({
  formValues,
  instructions
}: AdaptFormValuesToUrlQueryParams<FilterFormValues>): string {
  // flat currency range object values
  const currencyRangePredicates = instructions
    .filter(isCurrencyRange)
    .map((item) => item.sdk.predicate)

  const currencyRangeFormValues = omitBy(
    formValues,
    (_, key) => !currencyRangePredicates.includes(key)
  )

  const currencyRangeValues = Object.entries(currencyRangeFormValues).reduce(
    (acc, [key, value]) => {
      const currencyRangeField = value as CurrencyRangeFieldValue
      const currencyFrom = currencyRangeField?.from ?? undefined
      const currencyTo = currencyRangeField?.to ?? undefined
      const currencyCode =
        currencyFrom != null || currencyTo != null
          ? currencyRangeField?.currencyCode ?? undefined
          : undefined

      return {
        ...acc,
        [`${key}_gteq`]: currencyFrom,
        [`${key}_lteq`]: currencyTo,
        currency_code_eq: currencyCode
      }
    },
    {}
  )

  const restFormValues = omitBy(formValues, (_, key) =>
    currencyRangePredicates.includes(key)
  )

  return queryString.stringify(
    omitBy(
      {
        ...restFormValues,
        ...currencyRangeValues,
        timeFrom: formValues.timeFrom?.toISOString(),
        timeTo: formValues.timeTo?.toISOString()
      },
      (v) => isEmpty(v) && !isNumber(v)
    )
  )
}
