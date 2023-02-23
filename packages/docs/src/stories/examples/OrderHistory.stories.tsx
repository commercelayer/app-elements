import { ListItem } from '#app-elements/lists/ListItem'
import { ComponentStory, Meta } from '@storybook/react'
import { Container } from '#app-elements/atoms/Container'
import { Text } from '#app-elements/atoms/Text'
import { List } from '#app-elements/lists/List'
import { Icon } from '#app-elements/atoms/Icon'

const setup: Meta = {
  title: 'Examples/OrderHistory',
  parameters: {
    layout: 'padded'
  }
}
export default setup

export const Default: ComponentStory<typeof ListItem> = (args): JSX.Element => (
  <Container minHeight={false}>
    <List title='Results · 13,765'>
      <ListItem
        icon={<Icon name='arrowDown' background='orange' gap='large' />}
      >
        <div>
          <Text tag='div' weight='semibold'>
            NY Store #19346524
          </Text>
          <Text tag='div' weight='medium' size='small' variant='info'>
            Placed · mjordan@nba.com · May 17
          </Text>
          <Text tag='div' weight='bold' size='small' variant='warning'>
            Awaiting approval
          </Text>
        </div>
        <div>
          <Text tag='div' weight='semibold'>
            $42.55
          </Text>
          <Text tag='div' weight='medium' size='small' variant='info'>
            Authorized
          </Text>
        </div>
      </ListItem>

      <ListItem icon={<Icon name='x' background='gray' gap='large' />}>
        <div>
          <Text tag='div' weight='semibold'>
            US online #19346523
          </Text>
          <Text tag='div' weight='medium' size='small' variant='info'>
            Cancelled · mjordan@nba.com · May 17
          </Text>
        </div>
        <div>
          <Text tag='div' weight='semibold'>
            $23.00
          </Text>
          <Text tag='div' weight='medium' size='small' variant='info'>
            Voided
          </Text>
        </div>
      </ListItem>
    </List>
  </Container>
)
