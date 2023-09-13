import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { ResourceOrderTimeline } from '#ui/resources/ResourceOrderTimeline'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof ResourceOrderTimeline> = {
  title: 'Resources/ResourceOrderTimeline',
  component: ResourceOrderTimeline,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof ResourceOrderTimeline> = (args) => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <ResourceOrderTimeline {...args} />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  isLoading: false,
  orderId: 'NMWYhbGorj',
  attachmentOption: {
    referenceOrigin: 'app-shipments--note'
  }
}

export const NoOrderId = Template.bind({})
NoOrderId.args = {
  isLoading: false,
  attachmentOption: {
    referenceOrigin: 'app-shipments--note'
  }
}
