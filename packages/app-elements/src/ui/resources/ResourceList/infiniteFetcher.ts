import { metricsApiFetcher } from '#ui/resources/ResourceList/metricsApiClient'
import type { CommerceLayerClient, QueryParamsList } from '@commercelayer/sdk'
import { type ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import uniqBy from 'lodash/uniqBy'
import { type MetricsApiFetcherParams } from './metricsApiClient'

type ListResource<TResource extends ListableResourceType> = Awaited<
  ReturnType<CommerceLayerClient[TResource]['list']>
>

export type Resource<TResource extends ListableResourceType> =
  ListResource<TResource>[number]

export interface FetcherResponse<TResource> {
  list: TResource[]
  meta: {
    pageCount: number
    recordCount: number
    currentPage: number
    recordsPerPage: number
    cursor?: string
  }
}

export async function infiniteFetcher<TResource extends ListableResourceType>({
  currentData,
  resourceType,
  ...rest
}: {
  currentData?: FetcherResponse<Resource<TResource>>
  resourceType: TResource
} & (
  | {
      sdkClient: CommerceLayerClient
      query?: Omit<QueryParamsList, 'pageNumber'>
    }
  | {
      metricsApiFetcherParams: MetricsApiFetcherParams
      sdkClient: never
      query: never
    }
)): Promise<FetcherResponse<Resource<TResource>>> {
  const currentPage = currentData?.meta.currentPage ?? 0
  const pageToFetch = currentPage + 1

  const listResponse =
    'metricsApiFetcherParams' in rest && rest.metricsApiFetcherParams != null
      ? await metricsApiFetcher({
          ...rest.metricsApiFetcherParams,
          query: {
            ...rest.metricsApiFetcherParams.query,
            search: {
              ...rest.metricsApiFetcherParams.query.search,
              cursor: currentData?.meta.cursor ?? null
            }
          }
        })
      : await rest.sdkClient[resourceType].list({
          ...rest.query,
          pageNumber: pageToFetch
        })

  // we need the primitive array
  // without the sdk added methods ('meta' | 'first' | 'last' | 'get')
  const existingList = currentData?.list ?? []
  const uniqueList = uniqBy(existingList.concat(listResponse), 'id')
  const meta = listResponse.meta

  return { list: uniqueList, meta }
}
