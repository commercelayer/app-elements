import { formatResourceName } from '#helpers/resources'
import { useIsChanged } from '#hooks/useIsChanged'
import { useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { Button } from '#ui/atoms/Button'
import { Card } from '#ui/atoms/Card'
import { EmptyState } from '#ui/atoms/EmptyState'
import { Section, type SectionProps } from '#ui/atoms/Section'
import {
  SkeletonTemplate,
  type SkeletonTemplateProps
} from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Table, Th, Tr } from '#ui/atoms/Table'
import { type ThProps } from '#ui/atoms/Table/Th'
import { Text } from '#ui/atoms/Text'
import { InputFeedback } from '#ui/forms/InputFeedback'
import {
  CommerceLayerStatic,
  type ListMeta,
  type ListableResourceType,
  type QueryParamsList,
  type ResourceFields
} from '@commercelayer/sdk'
import React, {
  useCallback,
  useEffect,
  useReducer,
  type FC,
  type ReactNode
} from 'react'
import { VisibilityTrigger } from './VisibilityTrigger'
import { infiniteFetcher, type Resource } from './infiniteFetcher'
import { useMetricsSdkProvider } from './metricsApiClient'
import { initialState, reducer } from './reducer'
import { computeTitleWithTotalCount } from './utils'

export interface ResourceListItemTemplateProps<
  TResource extends ListableResourceType
> extends SkeletonTemplateProps<{
    /**
     * The fetched resource
     */
    resource?: Resource<TResource>
    /**
     * callback to be used to remove the item from the list as UI element.
     * This needs to be used after a successful API call to delete the resource, since it just affects the current UI rendering and not the server data.
     */
    remove?: () => void
  }> {}

type TableVariantHeading = Omit<ThProps, 'children'> & {
  label: React.ReactNode
}

export type ResourceListProps<TResource extends ListableResourceType> = Pick<
  SectionProps,
  'actionButton'
> & {
  /**
   * A react component to be used to render each item in the list.
   * For best results, pass as `Item` a component already wrapped in a `SkeletonTemplate` (or `withSkeletonTemplate` HOC).
   * In this way the loading state will be handled automatically.
   */
  ItemTemplate: FC<ResourceListItemTemplateProps<TResource>>
  /**
   * An element to be rendered when the list is empty.
   * When not provided, a default message will be shown.
   * When a string is provided, it will be rendered as inline text below title and actionButton.
   * When other ReactNode is provided, it will be rendered as a custom element and no title or actionButton will be shown.
   */
  emptyState?: ReactNode
  /**
   * Title.
   */
  title?:
    | ((recordCount: number | undefined) => React.ReactNode)
    | React.ReactNode
  /**
   * Force the size of the title, when not defined, title size will be `small` by default or `normal` when variant is `table` or `boxed`.
   */
  titleSize?: SectionProps['titleSize']
} & (
    | {
        /** Boxed variant wraps the list in a Card */
        variant?: 'boxed'
      }
    | {
        /** Table variant wraps the list in a Table and enables the `headings` prop */
        variant: 'table'
        headings: TableVariantHeading[]
      }
  )

export interface UseResourceListConfig<TResource extends ListableResourceType> {
  /**
   * The resource type to be fetched in the list
   */
  type: TResource
  /**
   * SDK query object to be used to fetch the list, excluding the pageNumber that is handled internally for infinite scrolling.
   */
  query?: Omit<QueryParamsList<ResourceFields[TResource]>, 'pageNumber'>
  /**
   * When set the component will fetch data from the Metrics API, and automatically use the returned cursor for infinite scrolling.
   */
  metricsQuery?: {
    search: {
      limit?: number
      sort?: 'asc' | 'desc'
      sort_by?: string
      fields?: string[]
    }
    filter: Record<string, unknown>
  }
}

/**
 * Renders a list of resources of a given type with infinite scrolling.
 * It's possible to specify a query to filter the list and either
 * a React component (`ItemTemplate`) to be used as item template for the list or a function as `children` to render a custom element.
 */
export function useResourceList<TResource extends ListableResourceType>({
  type,
  query,
  metricsQuery
}: UseResourceListConfig<TResource>): {
  /** The component that renders the list with infinite scrolling functionality */
  ResourceList: FC<ResourceListProps<TResource>>
  /** The raw array of fetched resources, which grows each time a new page is fetched */
  list?: Array<Resource<TResource>>
  /** Metadata related to pagination, as returned by the SDK */
  meta?: ListMeta
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
} {
  const { sdkClient } = useCoreSdkProvider()
  const { metricsClient } = useMetricsSdkProvider()
  const [{ data, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState
  )

  const isQueryChanged = useIsChanged({
    value: query,
    onChange: () => {
      dispatch({ type: 'reset' })
      void fetchMore({ query })
    }
  })

  const fetchMore = useCallback(
    async ({
      query
    }: {
      query?: Omit<QueryParamsList<ResourceFields[TResource]>, 'pageNumber'>
    }): Promise<void> => {
      dispatch({ type: 'prepare' })
      try {
        const listResponse = await infiniteFetcher({
          // when is new query, we don't want to pass existing data
          currentData: isQueryChanged ? undefined : data,
          resourceType: type,
          ...(metricsQuery != null
            ? {
                clientType: 'metricsClient',
                client: metricsClient,
                query: metricsQuery
              }
            : {
                clientType: 'coreSdkClient',
                client: sdkClient,
                query
              })
        })
        dispatch({ type: 'loaded', payload: listResponse })
      } catch (err) {
        dispatch({ type: 'error', payload: parseApiErrorMessage(err) })
      }
    },
    [sdkClient, data, isQueryChanged]
  )

  useEffect(
    function initialFetch() {
      void fetchMore({ query })
    },
    [sdkClient]
  )

  const isApiError = data != null && error != null
  const isEmptyList = data != null && data.list.length === 0
  const isFirstLoading = isLoading && data == null
  const recordCount = isFirstLoading ? 1000 : data?.meta.recordCount
  const hasMorePages =
    data == null || data.meta.pageCount > data.meta.currentPage

  const removeItem = useCallback((resourceId: string) => {
    dispatch({
      type: 'removeItem',
      payload: {
        resourceId
      }
    })
  }, [])

  const refresh = useCallback(() => {
    dispatch({ type: 'reset' })
    void fetchMore({ query })
  }, [])

  const ResourceList = useCallback<FC<ResourceListProps<TResource>>>(
    ({
      ItemTemplate,
      emptyState: emptyStateProp,
      title,
      titleSize,
      variant,
      actionButton,
      ...rest
    }) => {
      const computedTitle =
        typeof title === 'function'
          ? title(recordCount)
          : computeTitleWithTotalCount({
              title,
              recordCount
            })
      const sectionBorder =
        variant === 'boxed' || variant === 'table' ? 'none' : undefined
      const tableHeadings = 'headings' in rest ? rest.headings : undefined

      if (isApiError) {
        return (
          <EmptyState
            title={`Could not retrieve ${type}`}
            description='Try to refresh the page or ask for support.'
          />
        )
      }

      // Empty state JSX element to render when the list is empty
      // If not provided, a default message based on the resource name will be shown
      const emptyState = emptyStateProp ?? (
        <Text variant='info'>
          No{' '}
          {formatResourceName({
            resource: type,
            count: 'plural'
          })}
          .
        </Text>
      )

      if (isEmptyList) {
        return variant != null || typeof emptyStateProp === 'string' ? (
          // inline empty state
          <Section
            actionButton={actionButton}
            title={computedTitle}
            titleSize={titleSize}
          >
            <Spacer top='4'>{emptyState}</Spacer>
          </Section>
        ) : (
          // custom JSX element (no title or actionButton)
          emptyState
        )
      }

      return (
        <Section
          isLoading={isFirstLoading}
          delayMs={0}
          data-testid='resource-list'
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
                <>
                  {error != null ? (
                    <ErrorLine
                      message={error.message}
                      onRetry={() => {
                        void fetchMore({ query })
                      }}
                    />
                  ) : isLoading ? (
                    Array(isFirstLoading ? 8 : 2) // we want more elements as skeleton on first mount
                      .fill(null)
                      .map((_, idx) => (
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
                  )}
                </>
              }
            >
              {data?.list.map((resource) => {
                return (
                  <ItemTemplate
                    resource={resource}
                    key={resource.id}
                    remove={() => {
                      removeItem(resource.id)
                    }}
                  />
                )
              })}
            </Wrapper>
          </SkeletonTemplate>
        </Section>
      )
    },
    [
      data?.list,
      hasMorePages,
      isApiError,
      isEmptyList,
      type,
      isLoading,
      isFirstLoading,
      error
    ]
  )

  return {
    ResourceList,
    list: data?.list,
    meta: data?.meta,
    isLoading,
    isFirstLoading,
    error: error?.message,
    removeItem,
    refresh,
    fetchMore: async () => {
      if (hasMorePages) {
        await fetchMore({ query })
      }
    },
    hasMorePages
  }
}

function ErrorLine({
  message,
  onRetry
}: {
  message: string
  onRetry: () => void
}): JSX.Element {
  return (
    <Spacer top='6'>
      <Spacer bottom='4'>
        <InputFeedback variant='danger' message={message} />
      </Spacer>
      <Button size='small' onClick={onRetry}>
        Retry
      </Button>
    </Spacer>
  )
}

function parseApiErrorMessage(error: unknown): string {
  return CommerceLayerStatic.isApiError(error)
    ? (error.errors ?? []).map(({ detail }) => detail).join(', ')
    : 'Could not retrieve data'
}

/**
 * Wraps the list in:
 * - a Card component when variant is boxed,
 * - a Table component when variant is table
 * - nothing (Fragment) when there is no variant
 */
const Wrapper: FC<{
  children?: ReactNode
  variant?: 'boxed' | 'table'
  tableHeadings?: TableVariantHeading[]
  isFirstLoading?: boolean
  isLoading?: boolean
  footer?: ReactNode
}> = ({ children, variant, tableHeadings, isLoading, footer }) => {
  if (variant === 'boxed') {
    return (
      <Card gap='1' overflow='hidden'>
        {children}
        {footer}
      </Card>
    )
  }

  if (variant === 'table') {
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
