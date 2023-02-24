import { ListItem } from '#ui/lists/ListItem'
import { List } from '#ui/lists/List'
import { Text } from '#ui/atoms/Text'
import { ComponentStory, Meta } from '@storybook/react'
import { Icon } from '#ui/atoms/Icon'
import { PageLayout } from '#app-elements/composite/PageLayout'

const setup: Meta = {
  title: 'Examples/List SKUs',
  parameters: {
    layout: 'fullscreen'
  }
}
export default setup

const Template: ComponentStory<typeof List> = (args) => (
  <PageLayout
    title='SKUs'
    onGoBack={() => {
      alert('onGoBack clicked')
    }}
  >
    <List
      title='All resources'
      pagination={{
        recordsPerPage: 25,
        recordCount: 104,
        currentPage: 1,
        onChangePageRequest: (newPage: number) => {},
        pageCount: 5
      }}
    >
      {[...Array(10).keys()].map((_, idx) => (
        <ListItem key={idx} onClick={() => {}}>
          <div>
            <Text weight='semibold' tag='div'>
              WGDMSMNOwJ
            </Text>
            <Text size='small'>Feb 20, 2023 · 4:23 AM</Text>
          </div>
          <Icon name='caretRight' />
        </ListItem>
      ))}
    </List>
  </PageLayout>
)

export const Default = Template.bind({})
