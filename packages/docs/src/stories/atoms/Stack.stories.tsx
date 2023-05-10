import { A } from '#ui/atoms/A'
import { Badge } from '#ui/atoms/Badge'
import { Spacer } from '#ui/atoms/Spacer'
import { Stack } from '#ui/atoms/Stack'
import { Text } from '#ui/atoms/Text'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Stack> = {
  title: 'Atoms/Stack',
  component: Stack,
  parameters: {
    layout: 'padded'
  }
}
export default setup

export const Default: StoryFn<typeof Stack> = (args) => (
  <Stack {...args}>
    <div>Element 1</div>
    <div>Element 2</div>
    <div>Element 3</div>
  </Stack>
)
Default.args = {}

export const Steps: StoryFn<typeof Stack> = (args) => (
  <Stack {...args}>
    <div>
      <Spacer bottom='2'>
        <Text tag='div' variant='info' size='small' weight='semibold'>
          Order
        </Text>
      </Spacer>
      <Badge label='APPROVED' variant='success-solid' />
    </div>
    <div>
      <Spacer bottom='2'>
        <Text tag='div' variant='info' size='small' weight='semibold'>
          Payment
        </Text>
      </Spacer>
      <Badge label='AUTHORIZED' variant='secondary' />
    </div>
    <div>
      <Spacer bottom='2'>
        <Text tag='div' variant='info' size='small' weight='semibold'>
          Fulfillment
        </Text>
      </Spacer>
      <Badge label='UNFULFILLED' variant='secondary' />
    </div>
  </Stack>
)
Steps.args = {}

export const Addresses: StoryFn<typeof Stack> = (args) => (
  <Stack {...args}>
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
)
Addresses.args = {}
