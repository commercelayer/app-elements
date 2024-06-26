import { useIsChanged } from '#hooks/useIsChanged'
import { useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { Button } from '#ui/atoms/Button'
import { Card } from '#ui/atoms/Card'
import { EmptyState } from '#ui/atoms/EmptyState'
import { Section, type SectionProps } from '#ui/atoms/Section'
import { type SkeletonTemplateProps } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { InputFeedback } from '#ui/forms/InputFeedback'
import { type FetcherResponse } from '#ui/resources/ResourceList/infiniteFetcher'
import { useMetricsSdkProvider } from '#ui/resources/ResourceList/metricsApiClient'
import {
  CommerceLayerStatic,
  type ListableResourceType,
  type QueryParamsList
} from '@commercelayer/sdk'
import React, { useCallback, useEffect, useReducer, type FC } from 'react'
import { VisibilityTrigger } from './VisibilityTrigger'
import { infiniteFetcher, type Resource } from './infiniteFetcher'
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

export interface ResourceListItemTemplate<
  TResource extends ListableResourceType
> {
  /**
   * A react component to be used to render each item in the list.
   * For best results, pass as `Item` a component already wrapped in a `SkeletonTemplate` (or `withSkeletonTemplate` HOC).
   * In this way the loading state will be handled automatically.
   */
  ItemTemplate: FC<ResourceListItemTemplateProps<TResource>>
}

export type ResourceListProps<TResource extends ListableResourceType> = Pick<
  SectionProps,
  'actionButton'
> & {
  /**
   * The resource type to be fetched in the list
   */
  type: TResource
  /**
   * SDK query object to be used to fetch the list, excluding the pageNumber that is handled internally for infinite scrolling.
   */
  query?: Omit<QueryParamsList, 'pageNumber'>
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
  /**
   * An element to be rendered when the list is empty.
   */
  emptyState: JSX.Element
  /**
   * Title.
   */
  title?:
    | ((recordCount: number | undefined) => React.ReactNode)
    | React.ReactNode
  /**
   *
   */
  variant?: 'boxed'
} & (
    | ResourceListItemTemplate<TResource>
    | {
        /**
         * Children as a function to render a custom element.
         * @example
         * ```
         * <ResourceList type='customers'>
         *  {({ isLoading, data }) => <ol>{data?.list.map(customer => <li>{customer.email}</li>)}</ol>
         * </ResourceList>
         * ```
         */
        children: (childrenProps: {
          isLoading: boolean
          data?: FetcherResponse<Resource<TResource>>
          isFirstLoading: boolean
          removeItem: (resourceId: string) => void
        }) => React.ReactNode
      }
  )

/**
 * Renders a list of resources of a given type with infinite scrolling.
 * It's possible to specify a query to filter the list and either
 * a React component (`ItemTemplate`) to be used as item template for the list or a function as `children` to render a custom element.
 */
export function ResourceList<TResource extends ListableResourceType>({
  type,
  query,
  title,
  variant,
  actionButton,
  emptyState,
  metricsQuery,
  ...props
}: ResourceListProps<TResource>): JSX.Element {
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
    async ({ query }: { query?: QueryParamsList }): Promise<void> => {
      if (sdkClient == null) {
        return
      }
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
      if (sdkClient != null) {
        void fetchMore({ query })
      }
    },
    [sdkClient]
  )

  if (sdkClient == null) {
    return <div />
  }

  const isApiError = data != null && error != null
  if (isApiError) {
    return (
      <EmptyState
        title={`Could not retrieve ${type}`}
        description='Try to refresh the page or ask for support.'
      />
    )
  }

  const isEmptyList = data != null && data.list.length === 0
  if (isEmptyList) {
    return <>{emptyState}</>
  }

  const isFirstLoading = isLoading && data == null
  const recordCount = isFirstLoading ? 1000 : data?.meta.recordCount
  const hasMorePages =
    data == null || data.meta.pageCount > data.meta.currentPage

  const Boxed = variant === 'boxed' ? Card : React.Fragment

  return (
    <Section
      isLoading={isFirstLoading}
      title={
        typeof title === 'function'
          ? title(recordCount)
          : computeTitleWithTotalCount({
              title,
              recordCount
            })
      }
      border={variant === 'boxed' ? 'none' : undefined}
      actionButton={actionButton}
      titleSize='small'
      data-testid='resource-list'
    >
      <Boxed gap='1' overflow='hidden'>
        {'ItemTemplate' in props &&
          data?.list.map((resource) => {
            return (
              <props.ItemTemplate
                resource={resource}
                key={resource.id}
                remove={() => {
                  dispatch({
                    type: 'removeItem',
                    payload: {
                      resourceId: resource.id
                    }
                  })
                }}
              />
            )
          })}

        {'children' in props &&
          props.children({
            isLoading,
            data,
            isFirstLoading,
            removeItem: (resourceId) => {
              dispatch({
                type: 'removeItem',
                payload: {
                  resourceId
                }
              })
            }
          })}

        {error != null ? (
          <ErrorLine
            message={error.message}
            onRetry={() => {
              void fetchMore({ query })
            }}
          />
        ) : isLoading && 'ItemTemplate' in props ? (
          Array(isFirstLoading ? 8 : 2) // we want more elements as skeleton on first mount
            .fill(null)
            .map((_, idx) => (
              <props.ItemTemplate
                isLoading
                delayMs={!isFirstLoading ? 0 : undefined}
                key={idx}
              />
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
      </Boxed>
    </Section>
  )
}

ResourceList.displayName = 'ResourceList'

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
