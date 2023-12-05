import { Spacer } from '#ui/atoms/Spacer'
import { StatusIcon } from '#ui/atoms/StatusIcon'
import { Text } from '#ui/atoms/Text'
import { List } from '#ui/composite/List'
import { ListItem } from '#ui/composite/ListItem'
import { Description, Primary, Subtitle, Title } from '@storybook/addon-docs'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta = {
  title: 'Examples/Order History',
  parameters: {
    layout: 'padded',
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

export const Default: StoryFn<typeof ListItem> = (args): JSX.Element => (
  <Spacer bottom='14'>
    <List title='Results · 13,765'>
      <ListItem
        tag='div'
        icon={<StatusIcon name='arrowDown' background='orange' gap='large' />}
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

      <ListItem
        tag='div'
        icon={<StatusIcon name='x' background='gray' gap='large' />}
      >
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
