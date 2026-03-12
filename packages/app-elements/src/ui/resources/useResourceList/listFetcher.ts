import type {
  CommerceLayerClient,
  ListableResourceType,
  QueryParamsList,
  ResourceFields,
} from "@commercelayer/sdk"
import uniqBy from "lodash-es/uniqBy"
import {
  isValidMetricsResource,
  type MetricsApiClient,
  type MetricsResources,
} from "./metricsApiClient"

type ListResource<TResource extends ListableResourceType> = Awaited<
  ReturnType<CommerceLayerClient[TResource]["list"]>
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
    cursor?: string | null
  }
}

export async function listFetcher<TResource extends ListableResourceType>({
  currentData,
  resourceType,
  client,
  clientType,
  query,
  mode = "infinite",
  pageNumber,
}: {
  currentData?: FetcherResponse<Resource<TResource>>
  resourceType: TResource
  mode?: "infinite" | "pagination"
  pageNumber?: number
} & (
  | {
      client: CommerceLayerClient
      clientType: "coreSdkClient"
      query?: Omit<QueryParamsList<ResourceFields[TResource]>, "pageNumber">
    }
  | {
      client: MetricsApiClient
      clientType: "metricsClient"
      query: Record<string, Record<string, unknown>>
    }
)): Promise<FetcherResponse<Resource<TResource>>> {
  const currentPage = currentData?.meta.currentPage ?? 0
  const pageToFetch =
    mode === "pagination" && pageNumber != null ? pageNumber : currentPage + 1

  if (clientType === "metricsClient" && !isValidMetricsResource(resourceType)) {
    throw new Error("Metrics client is not available for this resource type")
  }

  const listResponse =
    clientType === "metricsClient"
      ? await client.list(resourceType as MetricsResources, {
          ...query,
          search: {
            ...query.search,
            cursor: currentData?.meta.cursor ?? null,
          },
        })
      : // @ts-expect-error "Expression produces a union type that is too complex to represent"
        await client[resourceType].list({
          ...query,
          pageNumber: pageToFetch,
        })

  // we need the primitive array
  // without the sdk added methods ('meta' | 'first' | 'last' | 'get')
  const existingList = currentData?.list ?? []
  // In pagination mode, replace the list instead of accumulating
  const uniqueList =
    mode === "pagination"
      ? [...listResponse]
      : uniqBy(existingList.concat(listResponse), "id")
  const meta = listResponse.meta

  return { list: uniqueList, meta: { ...meta, currentPage: pageToFetch } }
}
