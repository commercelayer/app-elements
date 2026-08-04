import type {
  CommerceLayerBundle,
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
  ReturnType<CommerceLayerBundle[TResource]["list"]>
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
  cursor,
}: {
  currentData?: FetcherResponse<Resource<TResource>>
  resourceType: TResource
  mode?: "infinite" | "pagination"
  pageNumber?: number
  /**
   * Metrics API only: the cursor that opens the requested page. Used in
   * `pagination` mode, where the caller keeps track of one cursor per page
   * (the metrics API can only move forward on its own).
   */
  cursor?: string | null
} & (
  | {
      client: CommerceLayerBundle
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
            // in pagination mode the caller owns the cursor (it can jump back to
            // an already-visited page); in infinite mode we just keep going
            // forward from the last response
            cursor:
              mode === "pagination"
                ? (cursor ?? null)
                : (currentData?.meta.cursor ?? null),
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
  // The core SDK's `meta.cursor` is an object we don't use here; keep only the
  // string cursor set by the metrics client for infinite scrolling.
  const { cursor: responseCursor, ...rest } = listResponse.meta
  const meta = {
    ...rest,
    cursor: typeof responseCursor === "string" ? responseCursor : null,
  }

  // The metrics API reports neither the current page nor a total page count
  // (its `pageCount` is only a "has more" flag). In pagination mode the caller
  // drives the page number, so derive honest values from the real `recordCount`.
  // Infinite mode is left untouched: there `pageCount`/`currentPage` are what
  // `hasMorePages` is computed from.
  if (clientType === "metricsClient" && mode === "pagination") {
    meta.currentPage = pageToFetch
    meta.pageCount =
      meta.recordsPerPage > 0
        ? Math.max(1, Math.ceil(meta.recordCount / meta.recordsPerPage))
        : 1
  }

  return { list: uniqueList, meta }
}
