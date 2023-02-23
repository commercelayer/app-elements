import { ListItem } from '#app-elements/lists/ListItem'
import { ComponentStory, Meta } from '@storybook/react'
import { Container } from '#app-elements/atoms/Container'
import { Text } from '#app-elements/atoms/Text'
import { List } from '#app-elements/lists/List'
import { Icon } from '#app-elements/atoms/Icon'
import { StatusIcon } from '#app-elements/atoms/StatusIcon'
import { Button } from '#app-elements/atoms/Button'
import { A } from '#app-elements/atoms/A'
import { useState } from 'react'

const setup: Meta = {
  title: 'Examples/Tasks',
  parameters: {
    layout: 'padded'
  }
}
export default setup

export const Default: ComponentStory<typeof ListItem> = (args): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <Container>
      <List
        title='Imports'
        actionButton={<A>New import</A>}
        pagination={{
          recordsPerPage: 20,
          recordCount: 243,
          currentPage,
          onChangePageRequest: (newPage: number) => setCurrentPage(newPage),
          pageCount: 5
        }}
      >
        <ListItem icon={<StatusIcon status='progress' percentage={45} />}>
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

        <ListItem icon={<StatusIcon status='pending' />}>
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

        <ListItem icon={<StatusIcon status='success' />}>
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

        <ListItem icon={<StatusIcon status='danger' />}>
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
    </Container>
  )
}
