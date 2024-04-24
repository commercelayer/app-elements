import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { Button } from '#ui/atoms/Button'
import { Stack } from '#ui/atoms/Stack'
import { ListItem } from '#ui/composite/ListItem'
import {
  ResourceAddress,
  useResourceAddressOverlay
} from '#ui/resources/ResourceAddress'
import { presetAddresses } from '#ui/resources/ResourceAddress/ResourceAddress.mocks'
import { type Meta, type StoryFn } from '@storybook/react'
import { useState } from 'react'

type Props = Parameters<typeof ResourceAddress>[0] & {
  preset: Array<keyof typeof presetAddresses | 'custom'>
}

const setup: Meta<Props> = {
  title: 'Resources/ResourceAddress',
  component: ResourceAddress,
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
  return <ResourceAddress {...args} />
}

export const Default = Template.bind({})
Default.args = {
  isLoading: false,
  resource: presetAddresses.withName
}

export const WithoutTitle = Template.bind({})
WithoutTitle.args = {
  isLoading: false,
  resource: presetAddresses.withName
}

export const WithTitle = Template.bind({})
WithTitle.args = {
  isLoading: false,
  title: 'Shipping address',
  resource: presetAddresses.withName
}

export const Editable = Template.bind({})
Editable.args = {
  isLoading: false,
  editable: true,
  resource: presetAddresses.withNotes
}

export const StackedAddresses: StoryFn = () => {
  return (
    <Stack>
      <ResourceAddress
        resource={presetAddresses.withCompany}
        title='Billing address'
        editable
      />
      <ResourceAddress
        resource={presetAddresses.withNotes}
        title='Shipping address'
        editable
      />
    </Stack>
  )
}

export const ListedAddresses: StoryFn = () => {
  return (
    <>
      <ListItem>
        <ResourceAddress resource={presetAddresses.withCompany} editable />
      </ListItem>
      <ListItem>
        <ResourceAddress resource={presetAddresses.withName} editable />
      </ListItem>
    </>
  )
}

export const UseResourceAddressOverlay: StoryFn = () => {
  const [address, setAddress] = useState(presetAddresses.withName)

  const { ResourceAddressOverlay, openAddressOverlay } =
    useResourceAddressOverlay({
      address,
      title: address.full_name,
      onUpdate: (updatedAddress) => {
        console.log(updatedAddress)
        // @ts-expect-error We don't have the sdk types here
        setAddress(updatedAddress)
      }
    })

  return (
    <>
      <ResourceAddressOverlay />
      <Button
        onClick={() => {
          openAddressOverlay()
        }}
      >
        Edit address
      </Button>
    </>
  )
}
