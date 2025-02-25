import { useTokenProvider } from '#providers/TokenProvider'
import { type MetricsFilters } from '#ui/resources/useResourceFilters/adaptSdkToMetrics'
import {
  type ListableResourceType,
  type ListMeta,
  type ListResponse
} from '@commercelayer/sdk'
import castArray from 'lodash-es/castArray'
import { useMemo } from 'react'
import { type Writable } from 'type-fest'
import {
  adaptMetricsOrderToCore,
  type MetricsResourceOrder
} from './adaptMetricsOrderToCore'
import { type Resource } from './infiniteFetcher'

export type MetricsResources = 'orders' | 'returns'

interface OpenApiResponse<ResourceType extends MetricsResources> {
  data: Array<Resource<ResourceType>>
  meta: {
    pagination: {
      record_count: number
      cursor: string | null
    }
  }
}

type ListResponseWithoutMeta<ResourceType extends MetricsResources> = Omit<
  ListResponse<Resource<ResourceType>>,
  'meta'
>
type ListMetaWithCursor = Writable<ListMeta> & {
  cursor: string | null
}
type ListResponseMetrics<ResourceType extends MetricsResources> =
  ListResponseWithoutMeta<ResourceType> & {
    meta: ListMetaWithCursor
  }

type MetricsList = <Resource extends MetricsResources>(
  resourceType: Resource,
  query: {
    search?: {
      limit?: number
      sort?: 'asc' | 'desc'
      sort_by?: string
      fields?: string[]
      cursor?: string | null
    }
    filter?: MetricsFilters
  }
) => Promise<ListResponseMetrics<Resource>>

export interface MetricsApiClient {
  list: MetricsList
}

type MakeMetricsApiClient = (opts: {
  accessToken: string
  slug: string
  domain: string
}) => {
  client: MetricsApiClient
}

const makeMetricsApiClient: MakeMetricsApiClient = ({
  accessToken,
  slug,
  domain
}) => {
  const baseUrl = `https://${slug}.${domain}/metrics`

  const list: MetricsList = async (resourceType, query) => {
    // when searching pending orders we need to call `/carts` endpoint, not `/orders`
    const orderFilterStatus = castArray(
      query.filter?.order?.statuses?.in ?? query.filter?.order?.status?.eq
    )
    const endpoint = orderFilterStatus.includes('pending')
      ? 'carts'
      : resourceType

    const response = await fetch(`${baseUrl}/${endpoint}/search`, {
      method: 'POST',
      headers: {
        accept: 'application/vnd.api.v1+json',
        'content-type': 'application/vnd.api+json',
        authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(query)
    })

    const json: OpenApiResponse<typeof resourceType> = await response.json()
    const data =
      endpoint === 'carts'
        ? await removePlacedOrdersFromCarts({
            resourceType,
            accessToken,
            baseUrl,
            metricsData: json.data,
            dateField: query.filter?.order?.date_field,
            dateFrom: query.filter?.order?.date_from,
            dateTo: query.filter?.order?.date_to
          })
        : json.data

    const list = [
      ...data.map((item) =>
        resourceType === 'orders'
          ? adaptMetricsOrderToCore(item as MetricsResourceOrder)
          : {
              // We only convert orders at this stage (`returns` are not supported and are sent back 1:1 from the metrics API)
              ...item,
              type: resourceType
            }
      )
    ] as unknown as ListResponseMetrics<typeof resourceType>

    // fake meta just to make the list compatible with core sdk ListResponse
    // plus the addition of `cursor` to support infinite scrolling with metrics api
    list.meta = {
      pageCount: json.meta.pagination.cursor == null ? 1 : 2,
      recordCount: json.meta.pagination.record_count,
      currentPage: 1,
      recordsPerPage: 25,
      cursor: json.meta.pagination.cursor
    }

    return list
  }

  return {
    client: { list }
  }
}

export function useMetricsSdkProvider(): {
  metricsClient: MetricsApiClient
} {
  const {
    settings: { accessToken, organizationSlug, domain }
  } = useTokenProvider()

  const metricsClient = useMemo(
    () =>
      makeMetricsApiClient({
        accessToken,
        slug: organizationSlug,
        domain
      }).client,
    [accessToken, organizationSlug, domain]
  )

  return {
    metricsClient
  }
}

export function isValidMetricsResource(
  resourceType: ListableResourceType
): resourceType is MetricsResources {
  return ['orders', 'returns'].includes(resourceType)
}

/**
 * Clean up the list of metrics data by removing placed orders from carts.
 * This is necessary because the metrics api does not have a way to filter out placed orders from carts.
 */
async function removePlacedOrdersFromCarts<Resource extends MetricsResources>({
  dateFrom,
  dateTo,
  dateField,
  metricsData,
  baseUrl,
  accessToken,
  resourceType
}: {
  metricsData: OpenApiResponse<typeof resourceType>['data']
  dateFrom?: string
  dateTo?: string
  dateField?: string
  baseUrl: string
  accessToken: string
  resourceType: Resource
}): Promise<OpenApiResponse<typeof resourceType>['data']> {
  if (metricsData.length === 0) {
    return metricsData
  }
  const placedOrdersResponse = await fetch(`${baseUrl}/orders/search`, {
    method: 'POST',
    headers: {
      accept: 'application/vnd.api.v1+json',
      'content-type': 'application/vnd.api+json',
      authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      search: {
        limit: 25,
        fields: ['order.id']
      },
      filter: {
        order: {
          date_from: dateFrom,
          date_to: dateTo,
          date_field: dateField,
          ids: {
            in: metricsData.map((item) => item.id)
          }
        }
      }
    })
  })
  const placedOrders: OpenApiResponse<'orders'> =
    await placedOrdersResponse.json()

  const placedOrdersIds = placedOrders.data.map((item) => item.id)
  const filteredList = metricsData.filter(
    (item) => !placedOrdersIds.includes(item.id)
  )

  return filteredList
}
