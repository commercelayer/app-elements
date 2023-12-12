import { Spacer } from '#ui/atoms/Spacer'
import { StatusIcon } from '#ui/atoms/StatusIcon'
import { Text } from '#ui/atoms/Text'
import { List } from '#ui/composite/List'
import { ListItem } from '#ui/composite/ListItem'
import { PageLayout } from '#ui/composite/PageLayout'
import { Description, Primary, Subtitle, Title } from '@storybook/addon-docs'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta = {
  title: 'Examples/List Resources',
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
        </>
      )
    }
  }
}
export default setup

const Template: StoryFn<typeof List> = (args) => (
  <PageLayout
    title='Resources'
    navigationButton={{
      label: 'Back to dashboard',
      onClick: () => {
        alert('Back to dashboard')
      }
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
            <StatusIcon name='caretRight' />
          </ListItem>
        ))}
      </List>
    </Spacer>
  </PageLayout>
)

export const Default = Template.bind({})
