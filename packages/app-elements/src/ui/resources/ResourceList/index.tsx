import { Button } from '#ui/atoms/Button'
import { EmptyState, EmptyStateProps } from '#ui/atoms/EmptyState'
import { Legend, LegendProps } from '#ui/atoms/Legend'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { InputFeedback } from '#ui/forms/InputFeedback'
import {
  CommerceLayerClient,
  CommerceLayerStatic,
  QueryParamsList
} from '@commercelayer/sdk'
import { FC, useCallback, useEffect, useReducer } from 'react'
import { VisibilityTrigger } from './VisibilityTrigger'
import { ListableResource, Resource, infiniteFetcher } from './infiniteFetcher'
import { initialState, reducer } from './reducer'

const LegendWithSkeleton = withSkeletonTemplate(Legend)

export interface ResourceListProps<TResource extends ListableResource>
  extends Pick<LegendProps, 'title' | 'actionButton'> {
  type: TResource
  query?: Omit<QueryParamsList, 'pageNumber'>
  Item: FC<{
    resource?: Resource<TResource>
    isLoading?: boolean
    delayMs?: number
  }>
  emptyState: EmptyStateProps
  sdkClient?: CommerceLayerClient
}

function ResourceList<TResource extends ListableResource>({
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

  const fetchMore = useCallback(async (): Promise<void> => {
    if (sdkClient == null) {
      return
    }
    dispatch({ type: 'prepare' })
    try {
      const listResponse = await infiniteFetcher({
        sdkClient,
        currentData: data,
        resourceType: type,
        query
      })
      dispatch({ type: 'loaded', payload: listResponse })
    } catch (err) {
      dispatch({ type: 'error', payload: parseApiErrorMessage(err) })
    }
  }, [sdkClient, data])

  useEffect(
    function initialFetch() {
      if (sdkClient != null) {
        void fetchMore()
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
    return <EmptyState {...emptyState} />
  }

  const isFirstLoading = isLoading && data == null
  const recordCount = isFirstLoading ? 1000 : data?.meta.recordCount
  const hasMorePages =
    data == null || data.meta.pageCount > data.meta.currentPage

  return (
    <div data-test-id='resource-list'>
      <LegendWithSkeleton
        isLoading={isFirstLoading}
        title={computeTitleWithTotalCount({
          title,
          recordCount
        })}
        actionButton={actionButton}
        titleSize='small'
      />

      {data?.list.map((resource) => {
        return <Item resource={resource} key={resource.id} />
      })}

      {error != null ? (
        <ErrorLine
          message={error.message}
          onRetry={() => {
            void fetchMore()
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
              void fetchMore()
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

export function computeTitleWithTotalCount({
  title,
  recordCount,
  locale
}: {
  title?: LegendProps['title']
  recordCount?: number
  locale?: string
}): LegendProps['title'] {
  if (typeof title !== 'string' || recordCount == null || recordCount === 0) {
    return title
  }

  return `${title} · ${Intl.NumberFormat(locale).format(recordCount)}`
}
