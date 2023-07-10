import { adaptFormValuesToUrlQuery } from './adaptFormValuesToUrlQuery'
import { adaptUrlQueryToFormValues } from './adaptUrlQueryToFormValues'
import { type FiltersInstructions } from './types'

export interface AdaptUrlQueryToUrlQueryParams {
  queryString: string
  instructions: FiltersInstructions
}

/**
 * Parse current URL query string to return a new query string that contains only valid form values
 * @param qs url query string
 * @returns an object of type QueryFilter to be used in the SDK stripping out empty or undefined values
 */
export function adaptUrlQueryToUrlQuery({
  queryString,
  instructions
}: AdaptUrlQueryToUrlQueryParams): string {
  const formValues = adaptUrlQueryToFormValues({
    queryString,
    instructions
  })
  return adaptFormValuesToUrlQuery({ formValues, instructions })
}
