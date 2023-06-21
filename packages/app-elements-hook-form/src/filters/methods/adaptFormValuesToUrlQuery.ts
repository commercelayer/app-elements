import isEmpty from 'lodash/isEmpty'
import omitBy from 'lodash/omitBy'
import queryString from 'query-string'
import type { FormFullValues } from './types'

export interface AdaptFormValuesToUrlQueryParams<FilterFormValues> {
  formValues: FilterFormValues
}

/**
 * Covert FilterFormValues in url query string
 * @param formValues a valid FilterFormValues object
 * @returns a string ready to be used in URL
 */
export function adaptFormValuesToUrlQuery<
  FilterFormValues extends FormFullValues
>({ formValues }: AdaptFormValuesToUrlQueryParams<FilterFormValues>): string {
  return queryString.stringify(
    omitBy(
      {
        ...formValues,
        timeFrom: formValues.timeFrom?.toISOString(),
        timeTo: formValues.timeTo?.toISOString()
      },
      isEmpty
    )
  )
}
