import type { ListResponse, Resource } from "@commercelayer/sdk"
import { useRef } from "react"
import hash from "stable-hash"
import type { Arguments, BareFetcher } from "swr"
import useSWRInfinite, {
  type SWRInfiniteConfiguration,
  type SWRInfiniteKeyLoader,
} from "swr/infinite"
import { useCoreSdkProvider } from "#providers/CoreSdkProvider"
import { VisibilityTrigger as VisibilityTriggerComponent } from "#ui/atoms/VisibilityTrigger"

/** The `@commercelayer/sdk` client, as provided by `CoreSdkProvider`. */
type SdkClient = ReturnType<typeof useCoreSdkProvider>["sdkClient"]

export interface CursorPage<Data extends ListResponse<Resource>> {
  /**
   * A serializable value that uniquely identifies this page request. It's used
   * as the SWR cache key, so it must include everything that makes the request
   * unique (resource type, parent id, cursor, ...).
   */
  key: Arguments
  /** Performs the actual cursor-paginated request and resolves the page data. */
  fetch: () => Promise<Data>
}

export type GetCursorPage<Data extends ListResponse<Resource>> = (params: {
  sdkClient: SdkClient
  index: number
  previousPageData: Data | null
}) => CursorPage<Data> | null

/**
 * Returns the `next` cursor from a cursor-paginated response, ready to be used
 * as the `pageAfter` query param. Returns `undefined` for offset-paginated
 * responses, missing data or when there are no more pages.
 */
export const getNextCursor = (
  page: ListResponse<Resource> | null | undefined,
): string | undefined => page?.meta.cursor?.next?.after

export const useInfiniteScrollCursor = <
  Data extends ListResponse<Resource>,
  Error = unknown,
>(
  getCursorPage: GetCursorPage<Data>,
  config?: SWRInfiniteConfiguration<Data, Error, BareFetcher<Data>>,
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
) => {
  const { sdkClient } = useCoreSdkProvider()

  // `useSWRInfinite` only forwards the (serializable) key to the fetcher, so we
  // register the matching `fetch` thunk keyed by that key and look it up when
  // fetching. The same key always maps to a functionally identical request.
  const fetchersRef = useRef(new Map<string, () => Promise<Data>>())

  const getKey: SWRInfiniteKeyLoader<Data, Arguments> = (
    index,
    previousPageData,
  ) => {
    const page = getCursorPage({ sdkClient, index, previousPageData })
    if (page == null) {
      return null
    }
    fetchersRef.current.set(hash(page.key), page.fetch)
    return page.key
  }

  const fetcher: BareFetcher<Data> = async (key) => {
    const runFetch = fetchersRef.current.get(hash(key))
    if (runFetch == null) {
      throw new Error("No fetcher registered for the current SWR key")
    }
    return await runFetch()
  }

  const {
    data: swrData,
    isLoading,
    setSize,
    size,
    error,
    isValidating,
    mutate,
  } = useSWRInfinite<Data, Error>(getKey, fetcher, {
    compare: (a, b) => {
      if (a != null && b != null && "meta" in a && "meta" in b) {
        return hash(a) === hash(b) && hash(a.meta) === hash(b.meta)
      }

      if (
        a?.[0] != null &&
        b?.[0] != null &&
        "meta" in a[0] &&
        "meta" in b[0]
      ) {
        return hash(a) === hash(b) && hash(a[0].meta) === hash(b[0].meta)
      }

      return hash(a) === hash(b)
    },
    ...config,
  })

  const isLoadingMore =
    isLoading ||
    (size > 0 && swrData != null && typeof swrData[size - 1] === "undefined")
  const hasMorePages = getNextCursor(swrData?.at(-1)) != null
  const data = swrData != null ? swrData.flat() : []

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    currentPage: size,
    isLoadingMore,
    fetchNextPage: hasMorePages
      ? () => {
          void setSize(size + 1)
        }
      : undefined,
    VisibilityTrigger: () => {
      return (
        <VisibilityTriggerComponent
          key={size}
          enabled={hasMorePages}
          callback={(entry) => {
            if (entry.isIntersecting && !isLoadingMore) {
              void setSize(size + 1)
            }
          }}
        />
      )
    },
  }
}
