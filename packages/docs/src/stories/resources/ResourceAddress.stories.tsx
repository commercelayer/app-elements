import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { Stack } from '#ui/atoms/Stack'
import { ListItem } from '#ui/composite/ListItem'
import { ResourceAddress } from '#ui/resources/ResourceAddress'
import { presetAddresses } from '#ui/resources/ResourceAddress/ResourceAddress.mocks'
import { type Meta, type StoryFn } from '@storybook/react'

type Props = Parameters<typeof ResourceAddress>[0] & {
  preset: Array<keyof typeof presetAddresses | 'custom'>
}

const setup: Meta<Props> = {
  title: 'Resources/ResourceAddress',
  component: ResourceAddress,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<Props> = ({ preset, ...args }) => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <ResourceAddress {...args} />
      </CoreSdkProvider>
    </TokenProvider>
  )
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

const StackedTemplate: StoryFn = () => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
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
      </CoreSdkProvider>
    </TokenProvider>
  )
}

export const StackedAddresses = StackedTemplate.bind({})

const ListedTemplate: StoryFn = () => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <ListItem tag='div'>
          <ResourceAddress resource={presetAddresses.withCompany} editable />
        </ListItem>
        <ListItem tag='div'>
          <ResourceAddress resource={presetAddresses.withName} editable />
        </ListItem>
      </CoreSdkProvider>
    </TokenProvider>
  )
}

export const ListedAddresses = ListedTemplate.bind({})
