import { type FiltersInstructions } from '#ui/resources/useResourceFilters/types'
import { type QueryFilter } from '@commercelayer/sdk'
import queryString from 'query-string'
import { adaptUrlQueryToUrlQuery } from './adaptUrlQueryToUrlQuery'

export interface AdaptSdkToUrlQueryParams {
  sdkFilters: QueryFilter
  instructions: FiltersInstructions
  predicateWhitelist?: string[]
}

export function adaptSdkToUrlQuery({
  sdkFilters,
  predicateWhitelist,
  instructions
}: AdaptSdkToUrlQueryParams): string {
  const sdkFiltersWithArrayValues = Object.entries(sdkFilters).reduce(
    (acc, [key, value]) => {
      return {
        ...acc,
        [key]:
          key.includes('_in') && typeof value === 'string'
            ? value.split(',')
            : value
      }
    },
    {}
  )

  const query = queryString.stringify(sdkFiltersWithArrayValues)

  return adaptUrlQueryToUrlQuery({
    queryString: query,
    predicateWhitelist,
    instructions
  })
}
