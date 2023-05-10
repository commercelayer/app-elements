import { Icon } from '#ui/atoms/Icon'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { PageLayout } from '#ui/composite/PageLayout'
import { List } from '#ui/lists/List'
import { ListItem } from '#ui/lists/ListItem'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta = {
  title: 'Examples/List SKUs',
  parameters: {
    layout: 'fullscreen'
  }
}
export default setup

const Template: StoryFn<typeof List> = (args) => (
  <PageLayout
    title='SKUs'
    onGoBack={() => {
      alert('onGoBack clicked')
    }}
  >
    <Spacer bottom='14'>
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
          <ListItem tag='div' key={idx} onClick={() => {}}>
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
    </Spacer>
  </PageLayout>
)

export const Default = Template.bind({})
