import { useTokenProvider } from '#providers/TokenProvider'
import { type Resource } from '#ui/resources/ResourceList/infiniteFetcher'
import { type MetricsFilters } from '#ui/resources/useResourceFilters/adaptSdkToMetrics'
import {
  type ListableResourceType,
  type ListMeta,
  type ListResponse
} from '@commercelayer/sdk'
import castArray from 'lodash/castArray'
import { useMemo } from 'react'
import { type Writable } from 'type-fest'

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

    const list = [
      ...json.data.map((item) => ({
        ...item,
        type: resourceType // metrics api does not return the type
      }))
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
