import { useIsChanged } from '#hooks/useIsChanged'
import { useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { Button } from '#ui/atoms/Button'
import { EmptyState } from '#ui/atoms/EmptyState'
import { Legend, type LegendProps } from '#ui/atoms/Legend'
import { type SkeletonTemplateProps } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { InputFeedback } from '#ui/forms/InputFeedback'
import { type FetcherResponse } from '#ui/resources/ResourceList/infiniteFetcher'
import { CommerceLayerStatic, type QueryParamsList } from '@commercelayer/sdk'
import { type ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import { useCallback, useEffect, useReducer, type FC } from 'react'
import { VisibilityTrigger } from './VisibilityTrigger'
import { infiniteFetcher, type Resource } from './infiniteFetcher'
import { initialState, reducer } from './reducer'
import { computeTitleWithTotalCount } from './utils'

export interface ResourceListItemProps<TResource extends ListableResourceType>
  extends SkeletonTemplateProps<{
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

export interface ResourceListItem<TResource extends ListableResourceType> {
  /**
   * A react component to be used to render each item in the list.
   * For best results, pass as `Item` a component already wrapped in a `SkeletonTemplate` (or `withSkeletonTemplate` HOC).
   * In this way the loading state will be handled automatically.
   */
  Item: FC<ResourceListItemProps<TResource>>
}

export type ResourceListProps<TResource extends ListableResourceType> = Pick<
  LegendProps,
  'title' | 'actionButton'
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
   * An element to be rendered when the list is empty.
   */
  emptyState: JSX.Element
} & (
    | ResourceListItem<TResource>
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
        }) => React.ReactNode
      }
  )

/**
 * Renders a list of resources of a given type with infinite scrolling.
 * It's possible to specify a query to filter the list and either
 * a React component to be used as `Item` template for the list or a function as `children` to render a custom element.
 */
export function ResourceList<TResource extends ListableResourceType>({
  type,
  query,
  title,
  actionButton,
  emptyState,
  ...props
}: ResourceListProps<TResource>): JSX.Element {
  const { sdkClient } = useCoreSdkProvider()
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
          sdkClient,
          // when is new query, we don't want to pass existing data
          currentData: isQueryChanged ? undefined : data,
          resourceType: type,
          query
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

  return (
    <div data-testid='resource-list'>
      {title != null || actionButton != null ? (
        <Legend
          isLoading={isFirstLoading}
          title={computeTitleWithTotalCount({
            title,
            recordCount
          })}
          actionButton={actionButton}
          titleSize='small'
        />
      ) : null}

      {'Item' in props &&
        data?.list.map((resource) => {
          return (
            <props.Item
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

      {'children' in props && props.children({ isLoading, data })}

      {error != null ? (
        <ErrorLine
          message={error.message}
          onRetry={() => {
            void fetchMore({ query })
          }}
        />
      ) : isLoading && 'Item' in props ? (
        Array(isFirstLoading ? 8 : 2) // we want more elements as skeleton on first mount
          .fill(null)
          .map((_, idx) => (
            <props.Item
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
    </div>
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
