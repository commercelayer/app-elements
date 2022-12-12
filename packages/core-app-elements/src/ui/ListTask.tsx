import { ReactNode } from 'react'
import cn from 'classnames'
import { Pagination, PaginationProps } from './Pagination'
import { makeCurrentPageOffsets } from '#utils/pagination'
import { Skeleton, SkeletonItem } from './Skeleton'
import { Legend } from './Legend'

export interface ListTaskProps {
  title?: string
  actionButton?: ReactNode
  isDisabled?: boolean
  children?: ReactNode
  pagination?: {
    recordsPerPage: number
    recordCount: number
  } & Omit<PaginationProps, 'className' | 'isDisabled'>
  isLoading?: boolean
}

export function ListTask({
  title,
  actionButton,
  isDisabled,
  children,
  pagination,
  isLoading,
  ...rest
}: ListTaskProps): JSX.Element {
  const offsets =
    pagination != null
      ? makeCurrentPageOffsets({
          currentPage: pagination.currentPage,
          recordCount: pagination.recordCount,
          recordsPerPage: pagination.recordsPerPage
        })
      : null

  if (isLoading === true) {
    return (
      <Skeleton {...rest}>
        <div className='flex justify-between pb-4'>
          <SkeletonItem className='w-32 h-6' />
          <SkeletonItem className='w-24 h-6' />
        </div>
        <SkeletonItem className='w-full h-16 mb-2' />
        <SkeletonItem className='w-full h-16 mb-2' />
        <SkeletonItem className='w-full h-16 mb-2' />
        <SkeletonItem className='w-full h-16 mb-2' />
        <SkeletonItem className='w-full h-16 mb-2' />
      </Skeleton>
    )
  }

  const computedTitle =
    title != null && pagination != null && offsets != null
      ? computeTitleWithPagination({
          title,
          currentPage: pagination.currentPage,
          recordCount: pagination.recordCount,
          firstOfPage: offsets.firstOfPage,
          lastOfPage: offsets.lastOfPage
        })
      : title

  return (
    <div className='flex flex-col flex-1' {...rest}>
      <Legend
        title={computedTitle}
        actionButton={actionButton}
        data-test-id='list-task-legend'
      />
      <div
        className={cn({
          'opacity-40 pointer-events-none touch-none': isDisabled
        })}
      >
        {children}
      </div>
      {pagination != null && offsets != null ? (
        <div className='flex mt-auto items-center justify-between pt-9 pb-24'>
          <div className='text-gray-500 font-medium text-sm'>
            {offsets.firstOfPage}-{offsets.lastOfPage} of{' '}
            {pagination.recordCount}
          </div>

          <Pagination
            isDisabled={isDisabled}
            currentPage={pagination.currentPage}
            // eslint-disable-next-line react/jsx-handler-names
            onChangePageRequest={pagination.onChangePageRequest}
            pageCount={pagination.pageCount}
          />
        </div>
      ) : null}
    </div>
  )
}

function computeTitleWithPagination({
  title,
  firstOfPage,
  lastOfPage,
  recordCount,
  currentPage
}: {
  title: string
  firstOfPage: number
  lastOfPage: number
  recordCount: number
  currentPage: number
}): string {
  if (currentPage === 1) {
    return `${title} · ${recordCount}`
  }

  return `${title} · ${firstOfPage}-${lastOfPage} of ${recordCount}`
}

export default ListTask
