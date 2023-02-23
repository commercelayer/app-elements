import { ListItemFlex } from '#app-elements/lists/ListItemFlex'
import { Meta } from '@storybook/react'
import { Container } from '#app-elements/atoms/Container'
import { Text } from '#app-elements/atoms/Text'
import { List } from '#app-elements/lists/List'

const setup: Meta = {
  title: 'Examples/OrderHistory',
  parameters: {
    layout: 'padded'
  }
}
export default setup

export const FullList = (): JSX.Element => (
  <Container minHeight={false}>
    <List title='Results · 13,765'>
      <ListItemFlex
        icon={{
          name: 'arrowDown',
          background: 'orange'
        }}
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
      </ListItemFlex>

      <ListItemFlex
        icon={{
          name: 'x',
          background: 'gray'
        }}
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
      </ListItemFlex>
    </List>
  </Container>
)
