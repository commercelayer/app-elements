import { useIsChanged } from '#hooks/useIsChanged'
import { Button } from '#ui/atoms/Button'
import { EmptyState } from '#ui/atoms/EmptyState'
import { Legend, type LegendProps } from '#ui/atoms/Legend'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { InputFeedback } from '#ui/forms/InputFeedback'
import {
  CommerceLayerStatic,
  type CommerceLayerClient,
  type QueryParamsList
} from '@commercelayer/sdk'
import { type ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import { useCallback, useEffect, useReducer, type FC } from 'react'
import { VisibilityTrigger } from './VisibilityTrigger'
import { infiniteFetcher, type Resource } from './infiniteFetcher'
import { initialState, reducer } from './reducer'
import { computeTitleWithTotalCount } from './utils'

const LegendWithSkeleton = withSkeletonTemplate(Legend)

export interface ResourceListItemProps<TResource extends ListableResourceType> {
  resource?: Resource<TResource>
  isLoading?: boolean
  delayMs?: number
  remove?: () => void
}

export interface ResourceListProps<TResource extends ListableResourceType>
  extends Pick<LegendProps, 'title' | 'actionButton'> {
  type: TResource
  query?: Omit<QueryParamsList, 'pageNumber'>
  Item: FC<ResourceListItemProps<TResource>>
  emptyState: JSX.Element
  sdkClient?: CommerceLayerClient
}

function ResourceList<TResource extends ListableResourceType>({
  type,
  query,
  title,
  Item,
  actionButton,
  sdkClient,
  emptyState
}: ResourceListProps<TResource>): JSX.Element {
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
    <div data-test-id='resource-list'>
      {title != null || actionButton != null ? (
        <LegendWithSkeleton
          isLoading={isFirstLoading}
          title={computeTitleWithTotalCount({
            title,
            recordCount
          })}
          actionButton={actionButton}
          titleSize='small'
        />
      ) : null}

      {data?.list.map((resource) => {
        return (
          <Item
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
            <Item
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

ResourceList.displayName = 'ResourceList'
export { ResourceList }
