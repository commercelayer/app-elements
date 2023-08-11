import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { presetLineItems } from '#ui/resources/LineItems.mocks'
import { OrderSummary } from '#ui/resources/OrderSummary'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof OrderSummary> = {
  title: 'Resources/Order Summary',
  component: OrderSummary,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof OrderSummary> = (args) => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <OrderSummary {...args} />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  isLoading: false,
  footerActions: [
    {
      label: 'Approve',
      onClick: () => {
        alert('Approved!')
      }
    },
    {
      label: 'Cancel',
      variant: 'secondary',
      onClick: () => {
        alert('Cancelled!')
      }
    }
  ],
  onChange() {
    alert('Something has changed!')
  },
  order: {
    type: 'orders',
    id: '',
    created_at: '',
    updated_at: '',
    status: 'approved',
    payment_status: 'paid',
    fulfillment_status: 'fulfilled',
    subtotal_amount_cents: 14160,
    formatted_subtotal_amount: '$141.60',
    discount_amount_cents: 0,
    formatted_discount_amount: '$0.00',
    adjustment_amount_cents: 0,
    formatted_adjustment_amount: '$0.00',
    shipping_amount_cents: 1200,
    formatted_shipping_amount: '$12.00',
    payment_method_amount_cents: 1000,
    formatted_payment_method_amount: '$10.00',
    total_tax_amount_cents: 3115,
    formatted_total_tax_amount: '$31.15',
    gift_card_amount_cents: 0,
    formatted_gift_card_amount: '$0.00',
    total_amount_cents: 16360,
    formatted_total_amount: '$163.60',

    line_items: [
      presetLineItems.oneLine,
      presetLineItems.oneLine_2,
      presetLineItems.withBundle,
      presetLineItems.withOptions
    ]
  }
}
