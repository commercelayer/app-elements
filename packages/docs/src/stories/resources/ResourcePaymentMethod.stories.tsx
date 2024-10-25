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
 * The component can show more details on the transaction (`payment_source.payment_response`) by enabling `showPaymentResponse` prop.
 * If the `payment_response` is not available, the show more button will not be present.
 */
export const WithOrder = Template.bind({})
WithOrder.args = {
  resource: orderWithPaymentSourceResponse,
  showPaymentResponse: true
}

/**
 * When working in a customer context, we can pass the `customer_payment_source` to render the block related to the saved payment source.
 */
export const WithCustomerPaymentSource = Template.bind({})
WithCustomerPaymentSource.args = {
  resource: customerPaymentSource
}

/**
 * When used in lists or other components, boxed style can be removed using `variant: plain`.
 */
export const WithoutSideGap = Template.bind({})
WithoutSideGap.args = {
  resource: customerPaymentSource,
  variant: 'plain'
}
