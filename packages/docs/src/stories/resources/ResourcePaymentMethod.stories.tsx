import { ResourcePaymentMethod } from '#ui/resources/ResourcePaymentMethod'
import {
  customerPaymentSource,
  orderWithPaymentSourceResponse,
  orderWithoutPaymentSourceResponse
} from '#ui/resources/ResourcePaymentMethod.mocks'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof ResourcePaymentMethod> = {
  title: 'Resources/ResourcePaymentMethod',
  component: ResourcePaymentMethod,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '1rem 2rem' }}>
        <Story />
      </div>
    )
  ]
}
export default setup

const Template: StoryFn<typeof ResourcePaymentMethod> = (args) => (
  <ResourcePaymentMethod {...args} />
)

export const Default = Template.bind({})
Default.args = {
  resource: orderWithoutPaymentSourceResponse
}

/**
 * If the order includes the `payment_source` the component will show more details (expandable) on the transaction.
 */
export const WithOrder = Template.bind({})
WithOrder.args = {
  resource: orderWithPaymentSourceResponse
}

/**
 * When working in a customer context, we can pass the `customer_payment_source` to render the block related to the saved payment source.
 */
export const WithCustomerPaymentSource = Template.bind({})
WithCustomerPaymentSource.args = {
  resource: customerPaymentSource
}
