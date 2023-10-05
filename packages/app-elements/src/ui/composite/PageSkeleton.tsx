import { Container } from '#ui/atoms/Container'
import { Skeleton, SkeletonItem } from '#ui/atoms/Skeleton'
import { List } from '#ui/composite/List'
import { ListDetails } from '#ui/composite/ListDetails'
import { Report } from './Report'

export interface PageSkeletonProps {
  layout?: 'list' | 'details'
  hasHeaderDescription?: boolean
  delayMs?: number
}

function PageSkeleton({
  layout,
  hasHeaderDescription,
  delayMs
}: PageSkeletonProps): JSX.Element {
  return (
    <Container data-testid='page-skeleton'>
      <Skeleton delayMs={delayMs}>
        {/* PageHeading */}
        <div className='pt-10 pb-14'>
          <div>
            <SkeletonItem className='w-8 h-8 mb-2' />
            <SkeletonItem className='w-36 h-8' />
            {hasHeaderDescription === true && (
              <SkeletonItem
                data-testid='loading-header-description'
                className='w-36 h-5 mt-2'
              />
            )}
          </div>
        </div>

        {layout === 'list' ? (
          <List data-testid='loading-list' isLoading />
        ) : layout === 'details' ? (
          <div data-testid='loading-details'>
            <Report isLoading loadingLines={2} items={[]} />
            <ListDetails title='Details' isLoading loadingLines={4} />
          </div>
        ) : null}
      </Skeleton>
    </Container>
  )
}

PageSkeleton.displayName = 'PageSkeleton'
export { PageSkeleton }
