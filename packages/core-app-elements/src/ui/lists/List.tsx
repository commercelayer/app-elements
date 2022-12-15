import { ReactNode } from 'react'
import cn from 'classnames'
import { Pagination, PaginationProps } from '#ui/atoms/Pagination'
import {
  computeTitleWithPagination,
  makeCurrentPageOffsets
} from '#utils/pagination'
import { Skeleton, SkeletonItem } from '#ui/atoms/Skeleton'
import { Legend } from '#ui/atoms/Legend'

export type ListPagination = {
  recordsPerPage: number
  recordCount: number
} & Omit<PaginationProps, 'className' | 'isDisabled'>

export interface ListProps {
  /*
   * List name displayed in the heading
   */
  title?: string
  /*
   * Element to be displayed on the right side of the heading
   */
  actionButton?: ReactNode
  /*
   * Set an opacity on the list, usefull when changing page and new page data is not ready yet.
   */
  isDisabled?: boolean
  /*
   * Show Skeleton UI
   */
  isLoading?: boolean
  /*
   * It should only accept or ListItem or ListItemTask
   */
  children?: ReactNode
  /*
   * When a `ListPagination` is passed, a pagination nav is added at the bottom of the list
   */
  pagination?: ListPagination
}

export function List({
  title,
  actionButton,
  isDisabled,
  children,
  pagination,
  isLoading,
  ...rest
}: ListProps): JSX.Element {
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
      {computedTitle != null || actionButton !== null ? (
        <Legend
          title={computedTitle}
          actionButton={actionButton}
          data-test-id='list-task-legend'
        />
      ) : null}
      <div
        className={cn('border-t border-gray-100', {
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

export default List
