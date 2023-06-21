import { type QueryFilter } from '@commercelayer/sdk/lib/cjs/query'
import { adaptFormValuesToSdk } from './adaptFormValuesToSdk'
import { adaptUrlQueryToFormValues } from './adaptUrlQueryToFormValues'
import { type FiltersInstructions } from './types'

export interface AdaptUrlQueryToSdkParams {
  queryString: string
  instructions: FiltersInstructions
  timezone?: string
}

/**
 * Covert URL query string in SDK filter object
 * @param qs url query string
 * @returns an object of type QueryFilter to be used in the SDK
 * stripping out empty or undefined values and enforcing default status_in when empty
 */
export function adaptUrlQueryToSdk({
  queryString,
  instructions,
  timezone
}: AdaptUrlQueryToSdkParams): QueryFilter {
  const formValues = adaptUrlQueryToFormValues({
    queryString,
    instructions
  })

  return adaptFormValuesToSdk({
    formValues,
    instructions,
    timezone
  })
}
