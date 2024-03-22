import { type Order, type Shipment } from '@commercelayer/sdk'
import { type ListResponse } from '@commercelayer/sdk/lib/cjs/resource'
import { type Writable } from 'type-fest'

type MetricsResources = Order | Shipment

interface VndApiResponse<TResource extends MetricsResources> {
  data: TResource[]
  meta: {
    pagination: {
      record_count: number
      cursor: string | null
    }
  }
}

type ListResponseWithCursor<TResource extends MetricsResources> = Omit<
  ListResponse<TResource>,
  'meta'
> &
  Writable<Pick<ListResponse<TResource>, 'meta'>> & {
    meta: { cursor: string | null }
  }

export interface MetricsApiFetcherParams {
  resourceType: string
  slug: string
  accessToken: string
  query: Record<string, any>
  domain: string
}

export const metricsApiFetcher = async <TResource extends MetricsResources>({
  resourceType,
  slug,
  accessToken,
  query,
  domain
}: MetricsApiFetcherParams): Promise<ListResponse<TResource>> => {
  const url = `https://${slug}.${domain}/metrics/${resourceType}/search`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/vnd.api.v1+json',
      'content-type': 'application/vnd.api+json',
      authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(query)
  })

  const json: VndApiResponse<TResource> = await response.json()

  const list = [
    ...json.data.map((item) => ({
      ...item,
      type: resourceType // metrics api does not return the type
    }))
  ] as ListResponseWithCursor<TResource>

  // fake meta just to make the list compatible with core sdk ListResponse
  // plus the addition of `cursor` to support infinite scrolling with metrics api
  list.meta = {
    pageCount: json.meta.pagination.cursor == null ? 1 : 2,
    recordCount: json.meta.pagination.record_count,
    currentPage: 1,
    recordsPerPage: 25,
    cursor: json.meta.pagination.cursor
  } as const

  return list
}
