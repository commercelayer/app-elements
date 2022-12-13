import { ReactNode } from 'react'
import { Skeleton, SkeletonItem } from './Skeleton'

export interface DetailsListProps {
  title?: string
  children?: ReactNode
  className?: string
  isLoading?: boolean
  loadingLines?: number
}

export function DetailsList({
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

export default DetailsList
