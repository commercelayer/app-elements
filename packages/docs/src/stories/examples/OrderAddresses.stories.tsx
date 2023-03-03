import { A } from '#app-elements/atoms/A'
import { Legend } from '#app-elements/atoms/Legend'
import { Stack } from '#app-elements/atoms/Stack'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/lists/ListItem'
import { ComponentStory, Meta } from '@storybook/react'

const setup: Meta = {
  title: 'Examples/Order Addresses',
  parameters: {
    layout: 'padded'
  }
}
export default setup

export const Default: ComponentStory<typeof ListItem> = (args): JSX.Element => (
  <>
    <Legend title='Addresses' border='none' />
    <Stack>
      <div>
        <Spacer bottom='2'>
          <Text tag='div' weight='bold'>
            Shipping address
          </Text>
        </Spacer>
        <Text tag='div' variant='info'>
          Jack Kein
          <br />
          1209 Orange Street
          <br />
          Wilmington DE 19801 (US)
        </Text>
        <Spacer top='4'>
          <A>Edit</A>
        </Spacer>
      </div>
      <div>
        <Spacer bottom='2'>
          <Text tag='div' weight='bold'>
            Billing address
          </Text>
        </Spacer>
        <Text tag='div' variant='info'>
          Jack Kein
          <br />
          1209 Orange Street
          <br />
          Wilmington DE 19801 (US)
        </Text>
        <Spacer top='4'>
          <A>Edit</A>
        </Spacer>
      </div>
    </Stack>
  </>
)
