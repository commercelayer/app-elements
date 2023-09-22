import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { ResourceAddress } from '#ui/resources/ResourceAddress'
import { presetAddresses } from '#ui/resources/ResourceAddress/ResourceAddress.mocks'
import { type Meta, type StoryFn } from '@storybook/react'

type Props = Parameters<typeof ResourceAddress>[0] & {
  preset: Array<keyof typeof presetAddresses | 'custom'>
}

const setup: Meta<Props> = {
  title: 'Resources/ResourceAddress',
  component: ResourceAddress,
  argTypes: {
    preset: {
      options: [...Object.keys(presetAddresses)],
      control: { type: 'check' },
      description: `⚠️ This attribute is **not** a component prop.
        It is meant to be used only within this documentation.
        You can quickly switch to a pre-configured \`lineItem\`.
      `
    }
  },
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

export const WithTitle = Template.bind({})
WithTitle.args = {
  isLoading: false,
  title: 'Shipping address',
  resource: presetAddresses.withName
}

export const WithCompany = Template.bind({})
WithCompany.args = {
  isLoading: false,
  resource: presetAddresses.withCompany
}

export const WithCompanyAndTitle = Template.bind({})
WithCompanyAndTitle.args = {
  isLoading: false,
  title: 'Billing address',
  resource: presetAddresses.withCompany
}

export const Editable = Template.bind({})
Editable.args = {
  isLoading: false,
  editable: true,
  resource: presetAddresses.withName
}

export const EditableBottom = Template.bind({})
EditableBottom.args = {
  isLoading: false,
  editable: true,
  editPosition: 'bottom',
  resource: presetAddresses.withName
}
