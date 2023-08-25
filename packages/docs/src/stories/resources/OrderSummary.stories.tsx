import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { presetLineItems } from '#ui/resources/LineItems.mocks'
import { OrderSummary } from '#ui/resources/OrderSummary'
import { type Meta, type StoryFn } from '@storybook/react'

/**
 * <blockquote title="SKUs and Bundles" type="info">
 * Order Summary is using the `LineItems` components to render the `line_items` at the top.
 * </blockquote>
 */
const setup: Meta<typeof OrderSummary> = {
  title: 'Resources/Order Summary',
  component: OrderSummary,
  parameters: {
    layout: 'padded'
  }
}
export default setup

type Order = Parameters<typeof OrderSummary>[0]['order']

const order: Order = {
  type: 'orders',
  id: 'JZYhBKoLZW',
  number: 45531033,
  status: 'placed',
  payment_status: 'authorized',
  fulfillment_status: 'unfulfilled',
  language_code: 'it',
  currency_code: 'EUR',

  created_at: '2023-08-22T13:15:21.536Z',
  updated_at: '2023-08-22T13:20:14.617Z',

  tax_included: true,
  tax_rate: null,
  freight_taxable: null,
  country_code: 'IT',
  coupon_code: '10PER100',
  gift_card_code: '6665f707-09bc-4497-a01e-4c8bb1ccacb2',
  subtotal_amount_cents: 13000,
  formatted_subtotal_amount: '€130,00',
  shipping_amount_cents: 1200,
  formatted_shipping_amount: '€12,00',
  payment_method_amount_cents: 0,
  formatted_payment_method_amount: '€0,00',
  discount_amount_cents: -4300,
  formatted_discount_amount: '-€43,00',
  adjustment_amount_cents: -1000,
  formatted_adjustment_amount: '-€10,00',
  gift_card_amount_cents: -900,
  formatted_gift_card_amount: '-€9,00',
  total_tax_amount_cents: 0,
  formatted_total_tax_amount: '€0,00',
  subtotal_tax_amount_cents: 0,
  formatted_subtotal_tax_amount: '€0,00',
  shipping_tax_amount_cents: 0,
  formatted_shipping_tax_amount: '€0,00',
  payment_method_tax_amount_cents: 0,
  formatted_payment_method_tax_amount: '€0,00',
  adjustment_tax_amount_cents: 0,
  formatted_adjustment_tax_amount: '€0,00',
  total_amount_cents: 9900,
  formatted_total_amount: '€99,00',
  total_taxable_amount_cents: 14200,
  formatted_total_taxable_amount: '€142,00',
  subtotal_taxable_amount_cents: 13000,
  formatted_subtotal_taxable_amount: '€130,00',
  shipping_taxable_amount_cents: 1200,
  formatted_shipping_taxable_amount: '€12,00',
  payment_method_taxable_amount_cents: 0,
  formatted_payment_method_taxable_amount: '€0,00',
  adjustment_taxable_amount_cents: 0,
  formatted_adjustment_taxable_amount: '€0,00',
  total_amount_with_taxes_cents: 9000,
  formatted_total_amount_with_taxes: '€90,00',

  line_items: [
    presetLineItems.oneLine,
    presetLineItems.giftCard,
    presetLineItems.percentageDiscountPromotionCoupon,
    presetLineItems.percentageDiscountPromotionOver100,
    presetLineItems.percentageDiscountPromotionSkuList,
    presetLineItems.freeShippingPromotion
  ]
}

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
  order
}

/**
 * When the order does not contain an `adjustment` line_item, then the adjustment row is not shown, but when the order is in `editing` status, you will see the row and you can add a new adjustment.
 */
export const EditableEmptyAdjustment = Template.bind({})
EditableEmptyAdjustment.args = {
  ...Default.args,
  editable: true,
  order: {
    ...order,
    adjustment_amount_cents: undefined,
    formatted_adjustment_amount: undefined
  }
}

/**
 * All `line_items` amounts with the `item_type` equal to `adjustments` are shown as a single row in the OrderSummary.
 *
 * When the order is in `editing` status, you can click on the adjustment value to update it.
 */
export const EditableAdjustmentWithExistingValue = Template.bind({})
EditableAdjustmentWithExistingValue.args = {
  ...Default.args,
  editable: true
}
