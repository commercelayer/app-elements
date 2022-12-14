import cn from 'classnames'
import { Pagination, PaginationProps } from '#ui/atoms/Pagination'
import { makeCurrentPageOffsets } from '#utils/pagination'

interface ListSimpleProps {
  children: React.ReactNode
  className?: string
  pagination?: {
    recordsPerPage: number
    recordCount: number
  } & Omit<PaginationProps, 'className' | 'isDisabled'>
}

export function ListSimple({
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

  return (
    <div>
      <div
        {...rest}
        className={cn('border-t border-gray-100 mb-20', className)}
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
          />
        </div>
      ) : null}
    </div>
  )
}

export default ListSimple
