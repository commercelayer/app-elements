import type { CommerceLayerClient, QueryParamsList } from '@commercelayer/sdk'
import { type ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import uniqBy from 'lodash/uniqBy'

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
  }
}

export async function infiniteFetcher<TResource extends ListableResourceType>({
  sdkClient,
  query,
  currentData,
  resourceType
}: {
  sdkClient: CommerceLayerClient
  query?: Omit<QueryParamsList, 'pageNumber'>
  currentData?: FetcherResponse<Resource<TResource>>
  resourceType: TResource
}): Promise<FetcherResponse<Resource<TResource>>> {
  const currentPage = currentData?.meta.currentPage ?? 0
  const pageToFetch = currentPage + 1
  const listResponse = await sdkClient[resourceType].list({
    ...query,
    pageNumber: pageToFetch
  })

  // we need the primitive array
  // without the sdk added methods ('meta' | 'first' | 'last' | 'get')
  const existingList = currentData?.list ?? []
  const uniqueList = uniqBy(existingList.concat(listResponse), 'id')
  const meta = listResponse.meta

  return { list: uniqueList, meta }
}
