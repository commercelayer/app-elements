import { Icon } from '#ui/atoms/Icon'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { List } from '#ui/lists/List'
import { ListItem } from '#ui/lists/ListItem'
import { ComponentStory, Meta } from '@storybook/react'

const setup: Meta = {
  title: 'Examples/Order History',
  parameters: {
    layout: 'padded'
  }
}
export default setup

export const Default: ComponentStory<typeof ListItem> = (args): JSX.Element => (
  <Spacer bottom='14'>
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
  </Spacer>
)
