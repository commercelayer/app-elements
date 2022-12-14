import cn from 'classnames'
import { Pagination, PaginationProps } from '#ui/atoms/Pagination'
import {
  makeCurrentPageOffsets,
  computeTitleWithPagination
} from '#utils/pagination'
import { Legend } from '#ui/atoms/Legend'

export interface ListSimpleProps {
  title?: string
  children: React.ReactNode
  className?: string
  pagination?: {
    recordsPerPage: number
    recordCount: number
  } & Omit<PaginationProps, 'className' | 'isDisabled'>
}

export function ListSimple({
  title,
  children,
  className,
  pagination,
  ...rest
}: ListSimpleProps): JSX.Element {
  const offsets =
    pagination != null
      ? makeCurrentPageOffsets({
          currentPage: pagination.currentPage,
          recordCount: pagination.recordCount,
          recordsPerPage: pagination.recordsPerPage
        })
      : null

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
    <div {...rest}>
      {computedTitle != null && (
        <Legend title={computedTitle} data-test-id='list-simple-legend' />
      )}
      <div
        className={cn(
          'mb-20',
          {
            'border-t border-gray-100': computedTitle == null
          },
          className
        )}
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
            currentPage={pagination.currentPage}
            // eslint-disable-next-line react/jsx-handler-names
            onChangePageRequest={pagination.onChangePageRequest}
            pageCount={pagination.pageCount}
            data-test-id='list-simple-pagination'
          />
        </div>
      ) : null}
    </div>
  )
}

export default ListSimple
