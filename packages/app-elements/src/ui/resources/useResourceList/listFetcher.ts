import type {
  CommerceLayerBundle,
  ListableResourceType,
} from "@commercelayer/sdk"
import uniqBy from "lodash-es/uniqBy"
import type {
  ApiFlavour,
  ClientFor,
  ListableResourceTypeFor,
  QueryParamsListFor,
  ResourceFor,
} from "./apiFlavour"
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

/**
 * The part of an SDK client a list actually touches. Both the Core and the
 * Provisioning client match it, which is what lets one fetcher serve both.
 */
interface SdkListResource<TResource> {
  list: (
    params: Record<string, unknown>,
  ) => Promise<Array<TResource> & { meta: FetcherResponse<TResource>["meta"] }>
}

/**
 * The `client.orders` / `client.roles` accessor for a resource type.
 *
 * Indexing either SDK's client by a generic resource type defeats its types
 * ("union type too complex to represent"), so the lookup is made against the shape
 * both clients share. The resource type is constrained to a listable one of the
 * flavour in use, so the accessor is always there.
 */
function listResourceOf<TResource>(
  client: unknown,
  resourceType: string,
): SdkListResource<TResource> {
  // the cast past `noUncheckedIndexedAccess`: a listable resource type always has
  // its accessor on the client of the flavour it belongs to
  return (client as Record<string, SdkListResource<TResource>>)[
    resourceType
  ] as SdkListResource<TResource>
}

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

export async function listFetcher<
  TResource extends ListableResourceTypeFor<TApi>,
  TApi extends ApiFlavour = "core",
>({
  currentData,
  resourceType,
  client,
  clientType,
  query,
  mode = "infinite",
  pageNumber,
  cursor,
}: {
  currentData?: FetcherResponse<ResourceFor<TApi, TResource>>
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
      query?: QueryParamsListFor<TApi, TResource>
    }
  | {
      client: MetricsApiClient
      clientType: "metricsClient"
      query: Record<string, Record<string, unknown>>
    }
  | {
      /**
       * Provisioning API. The client is built by the caller — app-elements has no
       * provisioning token — and is otherwise used exactly like the core one.
       */
      client: ClientFor<"provisioning">
      clientType: "provisioningSdkClient"
      query?: QueryParamsListFor<TApi, TResource>
    }
)): Promise<FetcherResponse<ResourceFor<TApi, TResource>>> {
  const currentPage = currentData?.meta.currentPage ?? 0
  const pageToFetch =
    mode === "pagination" && pageNumber != null ? pageNumber : currentPage + 1

  if (clientType === "metricsClient" && !isValidMetricsResource(resourceType)) {
    throw new Error("Metrics client is not available for this resource type")
  }

  const listResponse =
    clientType === "metricsClient"
      ? await client.list(resourceType as unknown as MetricsResources, {
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
      : await listResourceOf<ResourceFor<TApi, TResource>>(
          client,
          resourceType,
        ).list({
          ...query,
          pageNumber: pageToFetch,
        })

  // the primitive array, without the methods every SDK adds to its list response
  // ('meta' | 'first' | 'last' | 'get'), and typed as this flavour's resource:
  // each client returns its own shape, but from here on they are all the same list
  const fetchedList = [...listResponse] as Array<ResourceFor<TApi, TResource>>
  const existingList = currentData?.list ?? []
  // In pagination mode, replace the list instead of accumulating
  const uniqueList =
    mode === "pagination"
      ? fetchedList
      : uniqBy(existingList.concat(fetchedList), "id")
  // The core SDK's `meta.cursor` is an object we don't use here, and the
  // provisioning one has no cursor at all; keep only the string cursor set by the
  // metrics client for infinite scrolling.
  const { cursor: responseCursor, ...rest } = listResponse.meta as {
    pageCount: number
    recordCount: number
    currentPage: number
    recordsPerPage: number
    cursor?: unknown
  }
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
