import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { OrderTimeline } from '#ui/resources/OrderTimeline'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof OrderTimeline> = {
  title: 'Resources/OrderTimeline',
  component: OrderTimeline,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof OrderTimeline> = (args) => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <OrderTimeline {...args} />
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
