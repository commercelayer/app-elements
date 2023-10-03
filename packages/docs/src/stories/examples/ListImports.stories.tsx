import { Button } from '#ui/atoms/Button'
import { Icon } from '#ui/atoms/Icon'
import { RadialProgress } from '#ui/atoms/RadialProgress'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { List } from '#ui/composite/List'
import { ListItem } from '#ui/composite/ListItem'
import { PageLayout } from '#ui/composite/PageLayout'
import { Description, Primary, Subtitle, Title } from '@storybook/addon-docs'
import { type Meta, type StoryFn } from '@storybook/react'
import { useState } from 'react'

const setup: Meta = {
  title: 'Examples/List Imports',
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

export const Default: StoryFn<typeof ListItem> = (args): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <PageLayout
      title='All imports'
      mode='test'
      onGoBack={() => {
        alert('onGoBack clicked')
      }}
    >
      <Spacer bottom='14'>
        <List
          title='Imports'
          actionButton={<Button variant='link'>New import</Button>}
          pagination={{
            recordsPerPage: 20,
            recordCount: 243,
            currentPage,
            onChangePageRequest: (newPage: number) => {
              setCurrentPage(newPage)
            },
            pageCount: 5
          }}
        >
          <ListItem tag='div' icon={<RadialProgress percentage={45} />}>
            <div>
              <Text tag='div' weight='semibold'>
                Prices
              </Text>
              <Text tag='div' size='small' variant='info' weight='medium'>
                Importing 45%
              </Text>
            </div>
            <Button variant='danger'>Cancel</Button>
          </ListItem>

          <ListItem tag='div' icon={<RadialProgress />}>
            <div>
              <Text tag='div' weight='semibold'>
                Orders
              </Text>
              <Text tag='div' size='small' variant='info' weight='medium'>
                Pending
              </Text>
            </div>
            <Icon name='caretRight' />
          </ListItem>

          <ListItem
            tag='div'
            icon={<Icon gap='large' name='check' background='green' />}
          >
            <div>
              <Text tag='div' weight='semibold'>
                SKUs
              </Text>
              <Text tag='div' size='small' variant='info' weight='medium'>
                Imported on Jan 27, 2023
              </Text>
            </div>
            <Icon name='caretRight' />
          </ListItem>

          <ListItem
            tag='div'
            icon={<Icon gap='large' name='x' background='red' />}
          >
            <div>
              <Text tag='div' weight='semibold'>
                SKUs
              </Text>
              <Text tag='div' size='small' variant='info' weight='medium'>
                Imported failed Jan 26, 2023
              </Text>
            </div>
            <Icon name='caretRight' />
          </ListItem>
        </List>
      </Spacer>
    </PageLayout>
  )
}
