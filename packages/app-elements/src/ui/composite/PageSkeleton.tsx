import { Section } from '#ui/atoms/Section'
import { SkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { StatusIcon } from '#ui/atoms/StatusIcon'
import { Text } from '#ui/atoms/Text'
import { List } from '#ui/composite/List'
import { ListItem } from '#ui/composite/ListItem'
import { PageLayout } from '#ui/composite/PageLayout'
import { SearchBar } from '#ui/composite/SearchBar'

/**
 * This component renders a skeleton page layout simulating the presence of the common elements of an initial app page:
 * - page title,
 * - back button,
 * - search bar,
 * - list of items.
 *
 * <span type='info'>You can use this component to display generic loading UI when you can't rely on single SkeletonTemplate blocks.</span>
 **/
function PageSkeleton(): JSX.Element {
  return (
    <SkeletonTemplate isLoading delayMs={0}>
      <PageLayout
        title='Loading'
        navigationButton={{
          label: 'Back',
          onClick: () => {}
        }}
        gap='only-top'
        scrollToTop
      >
        <Spacer bottom='14'>
          <SearchBar onSearch={() => {}} isLoading delayMs={0} />
        </Spacer>

        <Section title='Loading' border='none'>
          <List>
            {Array.from({ length: 2 }).map((_, index) => (
              <ListItem
                key={index}
                icon={
                  <StatusIcon name='arrowDown' background='gray' gap='large' />
                }
              >
                <div>
                  <Text tag='div' weight='semibold'>
                    Loading item number {index}
                  </Text>
                  <Text tag='div' weight='medium' size='small' variant='info'>
                    please wait a moment
                  </Text>
                </div>
                <StatusIcon name='caretRight' />
              </ListItem>
            ))}
          </List>
        </Section>
      </PageLayout>
    </SkeletonTemplate>
  )
}

PageSkeleton.displayName = 'PageSkeleton'
export { PageSkeleton }
