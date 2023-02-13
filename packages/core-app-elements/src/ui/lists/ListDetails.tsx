import { ReactNode } from 'react'
import { Skeleton, SkeletonItem } from '#ui/atoms/Skeleton'

export interface DetailsListProps {
  /**
   * Optional title to show on top of the list
   */
  title?: string
  /**
   * Use <ListDetailsItem> component as children
   */
  children?: ReactNode
  /**
   * css class name
   */
  className?: string
  /**
   * Show skeleton when this is `true`
   */
  isLoading?: boolean
  /**
   * Number of items to show as skeleton rows. Default is `3`.
   */
  loadingLines?: number
}

function ListDetails({
  title,
  children,
  isLoading,
  loadingLines = 3,
  ...rest
}: DetailsListProps): JSX.Element {
  if (isLoading === true) {
    return (
      <div {...rest}>
        <Skeleton>
          <h4 className='text-[18px] font-semibold mb-4'>
            <SkeletonItem className='h-7 w-32' />
          </h4>
          <div data-test-id='details-list-loading-rows'>
            {[...Array(loadingLines).keys()].map((_, idx) => (
              <SkeletonItem
                key={`details-loading-${idx}`}
                className='h-[53px] w-full mb-1 last:mb-0'
              />
            ))}
          </div>
        </Skeleton>
      </div>
    )
  }

  return (
    <div {...rest}>
      {title != null ? (
        <h4
          className='text-[18px] font-semibold mb-4'
          data-test-id='details-list-title'
        >
          {title}
        </h4>
      ) : null}
      <div data-test-id='details-list-rows'>{children}</div>
    </div>
  )
}

ListDetails.displayName = 'ListDetails'
export { ListDetails }
