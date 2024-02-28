import { adaptFormValuesToUrlQuery } from './adaptFormValuesToUrlQuery'
import { adaptUrlQueryToFormValues } from './adaptUrlQueryToFormValues'
import { type FiltersInstructions } from './types'

export interface AdaptUrlQueryToUrlQueryParams {
  queryString: string
  instructions: FiltersInstructions
  predicateWhitelist?: string[]
}

/**
 * Parse current URL query string to return a new query string that contains only valid form values
 * @param qs url query string
 * @returns an object of type QueryFilter to be used in the SDK stripping out empty or undefined values
 */
export function adaptUrlQueryToUrlQuery({
  queryString,
  instructions,
  predicateWhitelist = []
}: AdaptUrlQueryToUrlQueryParams): string {
  const formValues = adaptUrlQueryToFormValues({
    queryString,
    instructions,
    predicateWhitelist
  })
  return adaptFormValuesToUrlQuery({
    formValues,
    instructions
  })
}
