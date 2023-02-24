import { ListItem } from '#ui/lists/ListItem'
import { List } from '#ui/lists/List'
import { Text } from '#ui/atoms/Text'
import { ComponentStory, Meta } from '@storybook/react'
import { Icon } from '#ui/atoms/Icon'
import { PageLayout } from '#app-elements/composite/PageLayout'

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
        <ListItem key={resource} onClick={() => {}}>
          <Text weight='semibold'>{resource}</Text>
          <Icon name='caretRight' />
        </ListItem>
      ))}
    </List>
  </PageLayout>
)

export const Default = Template.bind({})
