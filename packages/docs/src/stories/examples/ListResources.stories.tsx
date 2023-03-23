import { Icon } from '#ui/atoms/Icon'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { PageLayout } from '#ui/composite/PageLayout'
import { List } from '#ui/lists/List'
import { ListItem } from '#ui/lists/ListItem'
import { ComponentStory, Meta } from '@storybook/react'

const setup: Meta = {
  title: 'Examples/List Resources',
  parameters: {
    layout: 'fullscreen'
  }
}
export default setup

const Template: ComponentStory<typeof List> = (args) => (
  <PageLayout
    title='Resources'
    onGoBack={() => {
      alert('onGoBack clicked')
    }}
  >
    <Spacer bottom='14'>
      <List
        title='All resources'
        pagination={{
          recordsPerPage: 200,
          recordCount: 104,
          currentPage: 1,
          onChangePageRequest: (newPage: number) => {},
          pageCount: 1
        }}
      >
        {[
          'Customers',
          'Events',
          'Exports',
          'Gift cards',
          'Orders',
          'Prices',
          'Shipments',
          'SKUs',
          'SKU lists',
          'Tax rules',
          'Wire transfers'
        ].map((resource) => (
          <ListItem tag='a' key={resource} href='#' target='_blank'>
            <Text weight='semibold'>{resource}</Text>
            <Icon name='caretRight' />
          </ListItem>
        ))}
      </List>
    </Spacer>
  </PageLayout>
)

export const Default = Template.bind({})
