import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { Stack } from '#ui/atoms/Stack'
import { Address } from '#ui/composite/Address'
import { ListItem } from '#ui/composite/ListItem'
import { presetAddresses } from '#ui/resources/ResourceAddress/ResourceAddress.mocks'
import { type Meta, type StoryFn } from '@storybook/react-vite'

type Props = Parameters<typeof Address>[0] & {
  preset: Array<keyof typeof presetAddresses | 'custom'>
}

const setup: Meta<Props> = {
  title: 'Composite/Address',
  component: Address,
  parameters: {
    layout: 'padded'
  },
  decorators: [
    (Story) => (
      <TokenProvider kind='integration' appSlug='orders' devMode>
        <CoreSdkProvider>
          <Story />
        </CoreSdkProvider>
      </TokenProvider>
    )
  ]
}
export default setup

const Template: StoryFn<Props> = ({ preset, ...args }) => {
  return <Address {...args} />
}

export const Default = Template.bind({})
Default.args = {
  isLoading: false,
  address: presetAddresses.withName
}

export const WithoutTitle = Template.bind({})
WithoutTitle.args = {
  isLoading: false,
  address: presetAddresses.withName
}

export const WithTitle = Template.bind({})
WithTitle.args = {
  isLoading: false,
  title: 'Shipping address',
  address: presetAddresses.withName
}

export const Editable = Template.bind({})
Editable.args = {
  isLoading: false,
  address: presetAddresses.withNotes,
  onEdit: () => {
    alert('Edit button clicked')
  }
}

export const NoAddress: StoryFn = () => {
  return (
    <Stack>
      <Address title='Billing address' showBillingInfo />
      <Address
        title='Shipping address'
        address={null}
        onEdit={() => {
          alert('Edit button clicked')
        }}
      />
    </Stack>
  )
}

export const StackedAddresses: StoryFn = () => {
  return (
    <Stack>
      <Address address={presetAddresses.withCompany} title='Billing address' />
      <Address address={presetAddresses.withNotes} title='Shipping address' />
    </Stack>
  )
}

export const ListedAddresses: StoryFn = () => {
  return (
    <>
      <ListItem>
        <Address address={presetAddresses.withCompany} />
      </ListItem>
      <ListItem>
        <Address address={presetAddresses.withName} />
      </ListItem>
    </>
  )
}
