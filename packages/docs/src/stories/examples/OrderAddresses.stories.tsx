import { Button } from '#ui/atoms/Button'
import { Section } from '#ui/atoms/Section'
import { Spacer } from '#ui/atoms/Spacer'
import { Stack } from '#ui/atoms/Stack'
import { Text } from '#ui/atoms/Text'
import { type ListItem } from '#ui/composite/ListItem'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta = {
  title: 'Examples/Order Addresses',
  parameters: {
    layout: 'padded'
  }
}
export default setup

export const Default: StoryFn<typeof ListItem> = (args): JSX.Element => (
  <Section title='Addresses' border='none'>
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
          <Button variant='link'>Edit</Button>
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
          <Button variant='link'>Edit</Button>
        </Spacer>
      </div>
    </Stack>
  </Section>
)
