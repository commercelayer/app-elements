import { Spacer } from '#ui/atoms/Spacer'
import { StatusIcon } from '#ui/atoms/StatusIcon'
import { Text } from '#ui/atoms/Text'
import { List } from '#ui/composite/List'
import { ListItem } from '#ui/composite/ListItem'
import { PageLayout } from '#ui/composite/PageLayout'
import { Description, Primary, Subtitle, Title } from '@storybook/addon-docs'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta = {
  title: 'Examples/List SKUs',
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
    title='SKUs'
    navigationButton={{
      label: 'Home',
      onClick: () => {}
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
          <ListItem key={idx} onClick={() => {}}>
            <div>
              <Text weight='semibold' tag='div'>
                WGDMSMNOwJ
              </Text>
              <Text size='small'>Feb 20, 2023 · 4:23 AM</Text>
            </div>
            <StatusIcon name='caretRight' />
          </ListItem>
        ))}
      </List>
    </Spacer>
  </PageLayout>
)

export const Default = Template.bind({})
