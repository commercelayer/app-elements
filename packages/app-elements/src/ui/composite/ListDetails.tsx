import { Section } from '#ui/atoms/Section'
import { Skeleton, SkeletonItem } from '#ui/atoms/Skeleton'
import cn from 'classnames'
import { type ReactNode } from 'react'

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
   * CSS class name
   */
  className?: string
  /**
   * Font size
   */
  fontSize?: 'normal' | 'small'
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
  fontSize = 'normal',
  isLoading,
  loadingLines = 3,
  className
}: DetailsListProps): JSX.Element {
  if (isLoading === true) {
    return (
      <section aria-label='Loading ...' className={className}>
        <Skeleton>
          <h4 className='text-[18px] font-semibold mb-4'>
            <SkeletonItem className='h-7 w-32' />
          </h4>
          <div data-testid='details-list-loading-rows'>
            {[...Array(loadingLines).keys()].map((_, idx) => (
              <SkeletonItem
                key={`details-loading-${idx}`}
                className='h-[53px] w-full mb-1 last:mb-0'
              />
            ))}
          </div>
        </Skeleton>
      </section>
    )
  }

  return (
    <Section
      data-testid='details-list-title'
      title={title}
      className={cn([{ 'text-sm': fontSize === 'small' }, className])}
    >
      <div data-testid='details-list-rows'>{children}</div>
    </Section>
  )
}

ListDetails.displayName = 'ListDetails'
export { ListDetails }
