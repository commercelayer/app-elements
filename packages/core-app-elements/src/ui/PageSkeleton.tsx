import { Container } from './Container'
import { DetailsList } from './DetailsList'
import { ListTask } from './ListTask'
import { Report } from './Report'
import { Skeleton, SkeletonItem } from './Skeleton'

interface PageSkeletonProps {
  layout?: 'list' | 'details'
  hasHeaderDescription?: boolean
  delayMs?: number
}

export function PageSkeleton({
  layout,
  hasHeaderDescription,
  delayMs
}: PageSkeletonProps): JSX.Element {
  return (
    <Container data-test-id='page-skeleton'>
      <Skeleton delayMs={delayMs}>
        {/* PageHeading */}
        <div className='pt-10 pb-14'>
          <div>
            <SkeletonItem className='w-8 h-8 mb-2' />
            <SkeletonItem className='w-36 h-8' />
            {hasHeaderDescription === true && (
              <SkeletonItem
                data-test-id='loading-header-description'
                className='w-36 h-5 mt-2'
              />
            )}
          </div>
        </div>

        {layout === 'list' ? (
          <ListTask data-test-id='loading-list' isLoading />
        ) : layout === 'details' ? (
          <div data-test-id='loading-details'>
            <Report isLoading loadingLines={2} items={[]} />
            <DetailsList title='Details' isLoading loadingLines={4} />
          </div>
        ) : null}
      </Skeleton>
    </Container>
  )
}

export default PageSkeleton
