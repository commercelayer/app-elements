import {
  CommerceLayerStatic,
  type ListableResourceType,
} from "@commercelayer/sdk"
import React, {
  type FC,
  type JSX,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react"
import { formatResourceName } from "#helpers/resources"
import { useIsChanged } from "#hooks/useIsChanged"
import { useCoreSdkProvider } from "#providers/CoreSdkProvider"
import { t } from "#providers/I18NProvider"
import { Button } from "#ui/atoms/Button"
import { Card } from "#ui/atoms/Card"
import { EmptyState } from "#ui/atoms/EmptyState"
import { Section, type SectionProps } from "#ui/atoms/Section"
import {
  SkeletonTemplate,
  type SkeletonTemplateProps,
} from "#ui/atoms/SkeletonTemplate"
import { Spacer } from "#ui/atoms/Spacer"
import { Table, Th, Tr } from "#ui/atoms/Table"
import type { ThProps } from "#ui/atoms/Table/Th"
import { Text } from "#ui/atoms/Text"
import { VisibilityTrigger } from "#ui/atoms/VisibilityTrigger"
import { InputFeedback } from "#ui/forms/InputFeedback"
import { ListContext } from "#ui/internals/listContext"
import type {
  AnyListableResourceType,
  ApiFlavour,
  ClientFor,
  ListableResourceTypeFor,
  QueryParamsListFor,
  ResourceFor,
} from "./apiFlavour"
import { type FetcherResponse, listFetcher } from "./listFetcher"
import { useMetricsSdkProvider } from "./metricsApiClient"
import { PaginationInfo } from "./PaginationInfo"
import {
  type Action,
  createInitialState,
  type ResourceListInternalState,
  reducer,
} from "./reducer"
import { subscribeToResourceLists } from "./resourceListSignals"
import { useMetricsCursorTrail } from "./useMetricsCursorTrail"
import { usePageInUrl } from "./usePageInUrl"
import { computeTitleWithTotalCount } from "./utils"

export interface ResourceListItemTemplateProps<
  TResource extends ListableResourceTypeFor<TApi>,
  TApi extends ApiFlavour = "core",
> extends SkeletonTemplateProps<{
    /**
     * The fetched resource
     */
    resource?: ResourceFor<TApi, TResource>
    /**
     * callback to be used to remove the item from the list as UI element.
     * This needs to be used after a successful API call to delete the resource, since it just affects the current UI rendering and not the server data.
     */
    remove?: () => void
  }> {}

type TableVariantHeading = Omit<ThProps, "children"> & {
  label: React.ReactNode
}

export type ResourceListProps<
  TResource extends ListableResourceTypeFor<TApi>,
  TApi extends ApiFlavour = "core",
> = Pick<SectionProps, "actionButton"> & {
  /**
   * A react component to be used to render each item in the list.
   * For best results, pass as `Item` a component already wrapped in a `SkeletonTemplate` (or `withSkeletonTemplate` HOC).
   * In this way the loading state will be handled automatically.
   */
  ItemTemplate: FC<ResourceListItemTemplateProps<TResource, TApi>>
  /**
   * An element to be rendered when the list is empty.
   * When not provided, a default message will be shown.
   * When a string is provided, it will be rendered as inline text below title and actionButton.
   * When other ReactNode is provided, it will be rendered as a custom element and no title or actionButton will be shown.
   */
  emptyState?: Awaited<ReactNode>
  /**
   * Title.
   */
  title?:
    | ((recordCount: number | undefined) => React.ReactNode)
    | React.ReactNode
  /**
   * Force the size of the title, when not defined, title size will be `small` by default or `normal` when variant is `table` or `boxed`.
   */
  titleSize?: SectionProps["titleSize"]
} & (
    | {
        /**
         * A list nested in a parent resource's page rather than being the page
         * itself — a customer's orders, a subscription's recurring ones.
         *
         * The rows go in a gray card and separate with a dashed rule, so the
         * group reads as one block belonging to the page around it.
         */
        variant?: "boxed"
      }
    | {
        /** Table variant wraps the list in a Table and enables the `headings` prop */
        variant: "table"
        headings: TableVariantHeading[]
      }
  )

export type UseResourceListConfig<
  TResource extends ListableResourceTypeFor<TApi>,
  TApi extends ApiFlavour = "core",
> = {
  /**
   * The resource type to be fetched in the list
   */
  type: TResource
  /**
   * Which Commerce Layer API the list speaks to.
   * @default "core"
   */
  api?: TApi
  /**
   * SDK query object to be used to fetch the list, excluding the pageNumber that is handled internally for infinite scrolling.
   */
  query?: QueryParamsListFor<TApi, TResource>
  /**
   * When set the component will fetch data from the Metrics API, and automatically use the returned cursor for infinite scrolling.
   */
  metricsQuery?: {
    search: {
      limit?: number
      sort?: "asc" | "desc"
      sort_by?: string
      fields?: string[]
    }
    filter: Record<string, unknown>
  }
  /**
   * Optional function to process the fetched resource list client-side before rendering.
   * It receives the full list returned by the API and must return the processed list.
   * Useful for client-side filtering or sorting that cannot be expressed via the API query.
   * Affects both the `list` value returned by the hook and what is rendered by `<ResourceList>`.
   */
  preProcess?: (
    list: Array<ResourceFor<TApi, TResource>>,
  ) => Array<ResourceFor<TApi, TResource>>
  /**
   * Pagination type: 'infinite' for infinite scrolling (default), 'pagination' for classic prev/next pagination.
   * Works with both the Core API and the Metrics API. Since the Metrics API is
   * cursor-based, prev/next works by remembering the cursor that opens each
   * visited page; arbitrary page jumps are not possible there.
   */
  paginationType?: "infinite" | "pagination"
  /**
   * Controls scroll behavior when the user navigates to a new page.
   * Only applies when `paginationType` is `'pagination'`.
   * - `'top'`: scrolls to the top of the page (default)
   * - `'list'`: scrolls to the top of the list
   * - `'none'`: no scroll
   * @default 'top'
   */
  paginationScrollTo?: "top" | "list" | "none"
  /**
   * The client for `api`. Required for the Provisioning API — app-elements has no
   * provisioning token of its own, so the caller builds it (see
   * `docs/adr/0001-provisioning-api-in-resource-list.md`); the overloads below are
   * what enforce that. Never passed for the Core API, whose client comes from
   * `CoreSdkProvider` — which is why this is the Provisioning client rather than
   * `ClientFor<TApi>`: a property whose type is conditional on the flavour cannot be
   * `Omit`ed or unioned by callers, and consumers that spread the config into a
   * component stopped typechecking.
   */
  client?: ClientFor<"provisioning">
}

// Base return type without Pagination
export interface UseResourceListReturn<
  TResource extends ListableResourceTypeFor<TApi>,
  TApi extends ApiFlavour = "core",
> {
  /** The component that renders the list with infinite scrolling or pagination functionality */
  ResourceList: FC<ResourceListProps<TResource, TApi>>
  /** The array of resources to display. When `preProcess` is provided, this is the processed result; otherwise it is the raw fetched data, which grows each time a new page is fetched (infinite mode) or shows current page only (pagination mode) */
  list?: Array<ResourceFor<TApi, TResource>>
  /** Metadata related to pagination, as returned by the SDK */
  meta?: FetcherResponse<ResourceFor<TApi, TResource>>["meta"]
  /** Indicates whether the list is currently loading the next page */
  isLoading: boolean
  /** Indicates whether the list is loading for the first time (initial page load) */
  isFirstLoading: boolean
  /** The error message (already parsed) returned from the API when a fetch request fails */
  error?: string
  /** Removes an item from the list, typically can be triggered after a delete action from the UI */
  removeItem: (resourceId: string) => void
  /**
   * Manually triggers data fetching for the next page without requiring the user to reach the infinite scroll trigger.
   * It does not trigger when last page has been reached.
   */
  fetchMore: () => Promise<void>
  /** Refreshes the list by clearing all previously fetched data and resetting the initial loading state before refetching the first page. */
  refresh: () => void
  /** Indicates whether there are more pages available for fetching */
  hasMorePages?: boolean
}

// Return type with Pagination component
export interface UseResourceListReturnWithPagination<
  TResource extends ListableResourceTypeFor<TApi>,
  TApi extends ApiFlavour = "core",
> extends UseResourceListReturn<TResource, TApi> {
  /** Pagination controls component (only shown when paginationType is 'pagination' and there are multiple pages) */
  Pagination: FC
}

/**
 * Renders a list of resources of a given type with infinite scrolling or classic pagination.
 * @see `docs/adr/0001-provisioning-api-in-resource-list.md`
 * It's possible to specify a query to filter the list and either
 * a React component (`ItemTemplate`) to be used as item template for the list or a function as `children` to render a custom element.
 */
/**
 * The Provisioning client, or a loud failure.
 *
 * The public overloads make it impossible to ask for a Provisioning list without
 * one, but `useResourceListForApi` is generic over the flavour and cannot: without
 * this, a missing client fell through to the Core client and queried the wrong API
 * with no sign of it.
 */
function requireProvisioningClient(
  client: ClientFor<"provisioning"> | undefined,
): ClientFor<"provisioning"> {
  if (client == null) {
    throw new Error(
      'A list with api: "provisioning" needs a client: app-elements cannot build one (see docs/adr/0001-provisioning-api-in-resource-list.md).',
    )
  }
  return client
}

/**
 * The list, generic over the API flavour.
 *
 * `useResourceList` below is the same thing behind overloads that pin the flavour,
 * so that a Provisioning list cannot be asked for without a client. Overloads take
 * a single type argument, though, so code that is itself generic over the flavour —
 * `useResourceTable` — calls this instead.
 */
export function useResourceListForApi<
  TResource extends ListableResourceTypeFor<TApi>,
  TApi extends ApiFlavour = "core",
>({
  type,
  api,
  client,
  query,
  metricsQuery,
  paginationType = "infinite",
  paginationScrollTo = "top",
  preProcess,
}: UseResourceListConfig<TResource, TApi>):
  | UseResourceListReturn<TResource, TApi>
  | UseResourceListReturnWithPagination<TResource, TApi> {
  // throws when a Provisioning list was built without a client (see below): at
  // mount, so the mistake surfaces where the list is rendered
  const provisioningClient =
    api === "provisioning" ? requireProvisioningClient(client) : undefined

  const { sdkClient } = useCoreSdkProvider()
  const { metricsClient } = useMetricsSdkProvider()
  const [{ data, isLoading, error }, dispatch] = useReducer<
    ResourceListInternalState<ResourceFor<TApi, TResource>>,
    [Action<ResourceFor<TApi, TResource>>]
  >(reducer, createInitialState<ResourceFor<TApi, TResource>>())
  const { requestedPage, pushPage, replacePage } = usePageInUrl()
  const listRef = React.useRef<HTMLDivElement>(null)
  /**
   * Metrics API + `pagination` mode only: the cursor that opens each page.
   * Index 0 is page 1 (no cursor); after loading page N we learn the cursor for
   * page N+1. The metrics API can only move forward, so remembering the cursors
   * we have seen is what makes "previous page" possible — and persisting them
   * is what lets the list reopen on the page it was left on.
   */
  const metricsTrail = useMetricsCursorTrail({
    enabled: metricsQuery != null && paginationType === "pagination",
    type,
    metricsQuery,
  })

  /**
   * Turn the page the url asks for into the page that can actually be served.
   *
   * This is the seam between "what the url wants" and "what the api can do".
   * The core api addresses any page directly, so a request always stands. The
   * metrics api can only open a page whose cursor is in the trail, and
   * answering a request it cannot meet would return the first page of rows
   * under the requested page's label — see `listFetcher`, which stamps
   * `meta.currentPage` from the requested number. Declining is the only honest
   * answer, and page 1 is always servable.
   */
  const resolveRequestedPage = useCallback(
    (page: number): number => {
      if (page <= 1) {
        return 1
      }
      if (metricsQuery == null) {
        return page
      }
      return metricsTrail.cursorFor(page) != null ? page : 1
    },
    [metricsQuery, metricsTrail],
  )

  // Resolved once, on mount, so that a restored list opens the page the url
  // asks for with a single request. A metrics-backed list can answer here too,
  // when its trail was persisted by an earlier mount; `followRequestedPage`
  // below corrects the url when the request cannot be met after all.
  const [currentPage, setCurrentPage] = React.useState(() =>
    paginationType === "pagination" ? resolveRequestedPage(requestedPage) : 1,
  )

  // Both queries are watched: for metrics-backed lists `metricsQuery` is the one
  // that actually drives the request (deep-compared, so inline objects are safe).
  const isQueryChanged = useIsChanged({
    value: { query, metricsQuery },
    onChange: () => {
      setCurrentPage(1)
      // the url must follow, or it would keep asking for a page this list has
      // just left — in place, since the filter change already pushed an entry
      replacePage(1)
      dispatch({ type: "reset" })
      // no need to clear the cursor trail here: the page 1 fetch below
      // re-anchors it, and a changed query no longer matches its fingerprint
      void fetchMore({ query, pageNumber: 1 })
    },
  })

  const fetchMore = useCallback(
    async ({
      query,
      pageNumber,
      fromScratch = false,
    }: {
      query?: QueryParamsListFor<TApi, TResource>
      pageNumber?: number
      /**
       * Start the list over from its first page, discarding what is already
       * fetched. An infinite list derives the page to ask for from the data it
       * holds, so without this a `refresh` would fetch the page *after* the last
       * one it has and append it.
       */
      fromScratch?: boolean
    }): Promise<void> => {
      dispatch({ type: "prepare" })
      try {
        const listResponse = await listFetcher<TResource, TApi>({
          // when is new query, we don't want to pass existing data
          currentData: isQueryChanged || fromScratch ? undefined : data,
          resourceType: type,
          mode: paginationType,
          pageNumber,
          // metrics pagination: hand over the cursor that opens the requested page
          cursor:
            metricsQuery != null &&
            paginationType === "pagination" &&
            pageNumber != null
              ? (metricsTrail.cursorFor(pageNumber) ?? null)
              : undefined,
          // Which client answers: the Provisioning one the caller handed over, the
          // Metrics one when a metrics query is set, or the Core client from the
          // provider. `api` and `metricsQuery` are separate axes — metrics is a
          // transport for Core resources, not a third namespace.
          ...(api === "provisioning" && provisioningClient != null
            ? {
                clientType: "provisioningSdkClient" as const,
                client: provisioningClient,
                query,
              }
            : metricsQuery != null
              ? {
                  clientType: "metricsClient" as const,
                  client: metricsClient,
                  query: metricsQuery,
                }
              : {
                  clientType: "coreSdkClient" as const,
                  client: sdkClient,
                  query,
                }),
        })
        // remember the cursor that will open the *next* page, so it can be
        // revisited (forwards or backwards) without refetching from page 1
        if (
          metricsQuery != null &&
          paginationType === "pagination" &&
          pageNumber != null
        ) {
          // Page 1 is fetched with no cursor, so it re-anchors the list against
          // the data as it is now. Everything the trail remembered about later
          // pages was measured against an older snapshot and would place their
          // boundaries in the wrong spot, so it goes.
          //
          // This is the *only* place the trail is cleared, and it is enough:
          // every path that abandons the current page — a filter or tab change,
          // `refresh`, a page the resolver declined — goes on to fetch page 1.
          if (pageNumber === 1) {
            metricsTrail.reset()
          }
          metricsTrail.record(pageNumber, listResponse.meta.cursor ?? null)
        }
        dispatch({ type: "loaded", payload: listResponse })
      } catch (err) {
        dispatch({ type: "error", payload: parseApiErrorMessage(err) })
      }
    },
    [sdkClient, data, isQueryChanged, paginationType, metricsQuery, type],
  )

  useEffect(
    function initialFetch() {
      void fetchMore({
        query,
        // `currentPage` is already the page the url asked for, when that page
        // could be served, so a restored list opens it with a single request
        pageNumber: paginationType === "pagination" ? currentPage : undefined,
      })
    },
    [sdkClient],
  )

  /**
   * The url is the single source of truth for the page: a pager click, the
   * browser's back button and a shared link all arrive here the same way.
   *
   * Deliberately keyed on `requestedPage` alone. `fetchMore` changes identity
   * with `data`, so depending on it would refetch on every response; the values
   * read here come from the render in which the page changed, which is the
   * render whose values are wanted.
   */
  useEffect(
    function followRequestedPage() {
      if (paginationType !== "pagination") {
        return
      }

      const servablePage = resolveRequestedPage(requestedPage)

      if (servablePage !== requestedPage) {
        // correcting the url re-runs this effect with a page that can be served
        replacePage(servablePage)
        return
      }

      if (servablePage === currentPage) {
        return
      }

      setCurrentPage(servablePage)
      void fetchMore({ query, pageNumber: servablePage }).then(() => {
        if (paginationScrollTo === "top") {
          window.scrollTo({ top: 0 })
        } else if (paginationScrollTo === "list") {
          listRef.current?.scrollIntoView()
        }
      })
    },
    [requestedPage],
  )

  const isApiError = data != null && error != null
  const displayList = useMemo(
    () =>
      preProcess != null && data != null ? preProcess(data.list) : data?.list,
    [data?.list, preProcess],
  )
  // true when preProcess has filtered out items — client-side filtering is active
  const isPreProcessed =
    preProcess != null &&
    data != null &&
    displayList != null &&
    displayList.length !== data.list.length
  const isEmptyList = data != null && (displayList?.length ?? 0) === 0
  const isFirstLoading = isLoading && data == null
  // when filtered client-side, show the filtered count; otherwise show the API total (includes unfetched pages)
  const recordCount = isFirstLoading
    ? 1000
    : isPreProcessed
      ? displayList?.length
      : data?.meta.recordCount
  // when filtered client-side, stop fetching more pages — assume further pages won't change the filtered result
  const hasMorePages =
    !isPreProcessed &&
    (data == null || data.meta.pageCount > data.meta.currentPage)

  const removeItem = useCallback((resourceId: string) => {
    dispatch({
      type: "removeItem",
      payload: {
        resourceId,
      },
    })
  }, [])

  const refresh = useCallback(() => {
    setCurrentPage(1)
    if (paginationType === "pagination") {
      replacePage(1)
    }
    dispatch({ type: "reset" })
    void fetchMore({
      query,
      pageNumber: paginationType === "pagination" ? 1 : undefined,
      // `reset` has not been applied yet, so the fetch would still see the data
      // this refresh is throwing away
      fromScratch: true,
    })
  }, [query, paginationType, fetchMore, replacePage])

  // A component that mutates a resource is often not the one rendering the list:
  // a details drawer is a sibling of the list, which stays mounted underneath, so
  // a row deleted there would linger until a reload. These signals let it say so.
  // Read through a ref because `refresh` changes identity with `query`, and
  // resubscribing on every query change would be pointless churn.
  const signalHandlersRef = useRef({ removeItem, refresh })
  signalHandlersRef.current = { removeItem, refresh }

  useEffect(
    () =>
      subscribeToResourceLists(type, (signal) => {
        if (signal.kind === "removeItem") {
          signalHandlersRef.current.removeItem(signal.resourceId)
        } else {
          signalHandlersRef.current.refresh()
        }
      }),
    [type],
  )

  // The pager only writes the url; `followRequestedPage` above does the rest, so
  // that clicking Next and pressing the browser's back button take one path.
  const handlePageChange = useCallback(
    (newPage: number) => {
      pushPage(newPage)
    },
    [pushPage],
  )

  const ResourceList = useCallback<FC<ResourceListProps<TResource, TApi>>>(
    ({
      ItemTemplate,
      emptyState: emptyStateProp,
      title,
      titleSize: titleSizeProp,
      variant,
      actionButton,
      ...rest
    }) => {
      const computedTitle =
        typeof title === "function"
          ? title(recordCount)
          : computeTitleWithTotalCount({
              title,
              recordCount,
            })
      // lists by default have a small title, but table and boxed have a normal title size unless specified
      const titleSize =
        titleSizeProp ??
        (variant === "table" || variant === "boxed" ? "normal" : "small")
      const sectionBorder =
        variant === "boxed" || variant === "table" ? "none" : undefined
      const tableHeadings = "headings" in rest ? rest.headings : undefined

      if (isApiError) {
        return (
          <EmptyState
            title={`Could not retrieve ${type}`}
            description={t("common.try_to_refresh_page")}
          />
        )
      }

      // Empty state JSX element to render when the list is empty
      // If not provided, a default message based on the resource name will be shown
      const emptyState = emptyStateProp ?? (
        <Text variant="info">
          No{" "}
          {formatResourceName({
            // only used to build the "No <things> found" label
            resource: type as ListableResourceType,
            count: "plural",
          })}
          .
        </Text>
      )

      if (isEmptyList) {
        return variant != null || typeof emptyStateProp === "string" ? (
          // inline empty state
          <Section
            actionButton={actionButton}
            title={computedTitle}
            titleSize={titleSize}
          >
            <Spacer top="4">{emptyState}</Spacer>
          </Section>
        ) : (
          // custom JSX element (no title or actionButton)
          emptyState
        )
      }

      return (
        <Section
          ref={paginationScrollTo === "list" ? listRef : undefined}
          isLoading={isFirstLoading}
          delayMs={0}
          data-testid="resource-list"
          actionButton={actionButton}
          title={computedTitle}
          titleSize={titleSize}
          border={sectionBorder}
        >
          <SkeletonTemplate
            // prevent spreading skeleton internally
            isLoading={false}
          >
            <Wrapper
              tableHeadings={tableHeadings}
              variant={variant}
              isLoading={isLoading}
              footer={
                error != null ? (
                  <ErrorLine
                    message={error.message}
                    onRetry={() => {
                      void fetchMore({
                        query,
                        pageNumber:
                          paginationType === "pagination"
                            ? currentPage
                            : undefined,
                      })
                    }}
                  />
                ) : paginationType === "infinite" ? (
                  isLoading ? (
                    Array(isFirstLoading ? 8 : 2) // we want more elements as skeleton on first mount
                      .fill(null)
                      .map((_, idx) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since items are static
                        <ItemTemplate isLoading delayMs={0} key={idx} />
                      ))
                  ) : (
                    <VisibilityTrigger
                      enabled={hasMorePages}
                      callback={(entry) => {
                        if (entry.isIntersecting) {
                          void fetchMore({ query })
                        }
                      }}
                    />
                  )
                ) : null
              }
            >
              {displayList?.map((resource, index) => {
                return (
                  // Per row rather than around the list: a row in a boxed list
                  // separates with a dashed rule, and the one that closes the
                  // list leaves it out — the card's edge already closes the
                  // group. Only the list knows which row that is.
                  <ListContext.Provider
                    key={resource.id}
                    value={{
                      boxed: variant === "boxed",
                      isLastRow: index === displayList.length - 1,
                    }}
                  >
                    <ItemTemplate
                      resource={resource}
                      remove={() => {
                        removeItem(resource.id)
                      }}
                    />
                  </ListContext.Provider>
                )
              })}
            </Wrapper>
          </SkeletonTemplate>
        </Section>
      )
    },
    [
      displayList,
      hasMorePages,
      isApiError,
      isEmptyList,
      type,
      isLoading,
      isFirstLoading,
      error,
      paginationType,
      currentPage,
      query,
      fetchMore,
    ],
  )

  const Pagination = useCallback<FC>(() => {
    if (
      paginationType !== "pagination" ||
      data == null ||
      data.meta.pageCount <= 1 ||
      isPreProcessed
    ) {
      return null
    }

    return (
      <PaginationInfo
        currentPage={data.meta.currentPage}
        pageCount={data.meta.pageCount}
        recordsPerPage={data.meta.recordsPerPage}
        recordCount={data.meta.recordCount}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />
    )
  }, [
    paginationType,
    data,
    currentPage,
    isLoading,
    handlePageChange,
    isPreProcessed,
  ])

  const baseReturn: UseResourceListReturn<TResource, TApi> = {
    ResourceList,
    list: displayList,
    meta: data?.meta,
    isLoading,
    isFirstLoading,
    error: error?.message,
    removeItem,
    refresh,
    fetchMore: async () => {
      if (paginationType === "pagination") {
        console.warn("fetchMore is not supported in pagination mode.")
        return
      }
      if (hasMorePages) {
        await fetchMore({ query })
      }
    },
    hasMorePages,
  }

  if (paginationType === "pagination") {
    return {
      ...baseReturn,
      Pagination,
    } as UseResourceListReturnWithPagination<TResource, TApi>
  }

  return baseReturn
}

function ErrorLine({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}): JSX.Element {
  return (
    <Spacer top="6">
      <Spacer bottom="4">
        <InputFeedback variant="danger" message={message} />
      </Spacer>
      <Button size="small" onClick={onRetry}>
        {t("common.retry")}
      </Button>
    </Spacer>
  )
}

function parseApiErrorMessage(error: unknown): string {
  return CommerceLayerStatic.isApiError(error)
    ? (error.errors ?? []).map(({ detail }) => detail).join(", ")
    : t("common.could_not_retrieve_data")
}

/**
 * Wraps the list in:
 * - a Card component when variant is boxed,
 * - a Table component when variant is table
 * - nothing (Fragment) when there is no variant
 */
const Wrapper: FC<{
  children?: ReactNode
  variant?: "boxed" | "table"
  tableHeadings?: TableVariantHeading[]
  isFirstLoading?: boolean
  isLoading?: boolean
  footer?: ReactNode
}> = ({ children, variant, tableHeadings, isLoading, footer }) => {
  if (variant === "boxed") {
    return (
      // `overflow` visible so a row's own menu is not cut off by the card — the
      // last row's opens downwards past its edge. Nothing needs clipping: the
      // card's padding insets the rows, so a row's hover cannot reach the
      // rounded corners.
      // `gap` is the card's own padding, and it is uniform, so the horizontal
      // one comes from `px-6` on top of it: the rows need room at their sides —
      // the dashed rules, which span a row, inset with them — but each row
      // already brings its own vertical padding, so the card only keeps a hair
      // of its own so the first and last rows do not touch its edges.
      <Card gap="1" overflow="visible" backgroundColor="light" className="px-6">
        {children}
        {footer}
      </Card>
    )
  }

  if (variant === "table") {
    return (
      <Table
        thead={
          <Tr>
            {tableHeadings?.map(({ label, ...thProps }, idx) => (
              <Th key={label?.toString() ?? idx} {...thProps}>
                {label}
              </Th>
            ))}
          </Tr>
        }
        tbody={children}
        tfoot={
          isLoading === true ? (
            footer
          ) : (
            <tr>
              {/* when not loading, footer elements needs to be wrapped in a <tr> since they are not aware to be part of a table */}
              <td colSpan={tableHeadings?.length}>{footer}</td>
            </tr>
          )
        }
      />
    )
  }

  return (
    <>
      {children}
      {footer}
    </>
  )
}

// Overload: the Provisioning API, whose client the caller owns
export function useResourceList<
  TResource extends ListableResourceTypeFor<"provisioning">,
>(
  config: UseResourceListConfig<TResource, "provisioning"> & {
    api: "provisioning"
    client: ClientFor<"provisioning">
    /** Metrics is a transport for Core resources: it has no Provisioning side. */
    metricsQuery?: never
  },
): UseResourceListReturn<TResource, "provisioning">

// Overload: when paginationType is explicitly 'pagination'
export function useResourceList<
  TResource extends ListableResourceTypeFor<"core">,
>(
  config: UseResourceListConfig<TResource, "core"> & {
    paginationType: "pagination"
  },
): UseResourceListReturnWithPagination<TResource, "core">

// Overload: when paginationType is explicitly 'infinite' or omitted
export function useResourceList<
  TResource extends ListableResourceTypeFor<"core">,
>(
  config: UseResourceListConfig<TResource, "core"> & {
    paginationType?: "infinite"
  },
): UseResourceListReturn<TResource, "core">

// Fallback overload: when paginationType is a union type or otherwise not narrowable to a literal
export function useResourceList<
  TResource extends ListableResourceTypeFor<"core">,
>(
  config: UseResourceListConfig<TResource, "core">,
): UseResourceListReturn<TResource, "core">

// Implementation for the overloads above. The overloads are what callers see; this
// signature only has to cover all of them, which the widest instantiation does —
// every resource type either API can list, at either flavour.
export function useResourceList(
  config: UseResourceListConfig<AnyListableResourceType, ApiFlavour>,
):
  | UseResourceListReturn<AnyListableResourceType, ApiFlavour>
  | UseResourceListReturnWithPagination<AnyListableResourceType, ApiFlavour> {
  return useResourceListForApi(config)
}
