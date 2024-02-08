import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { presetLineItems } from '#ui/resources/ResourceLineItems/ResourceLineItems.mocks'
import { ResourceOrderSummary } from '#ui/resources/ResourceOrderSummary'
import { type Meta, type StoryFn } from '@storybook/react'

/**
 * The main responsibility of the Order Summary component is rendering the summary given an Order resource.
 * Other then that, it uses the `LineItems` component to render the `line_items` at the top.
 */
const setup: Meta<typeof ResourceOrderSummary> = {
  title: 'Resources/ResourceOrderSummary',
  component: ResourceOrderSummary,
  parameters: {
    layout: 'padded'
  }
}
export default setup

type Order = Parameters<typeof ResourceOrderSummary>[0]['order']

const order: Order = {
  type: 'orders',
  id: 'JZYhBKoLZW',
  number: '45531033',
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
  discount_amount_cents: -3800,
  formatted_discount_amount: '-€38,00',
  adjustment_amount_cents: -1000,
  formatted_adjustment_amount: '-€10,00',
  gift_card_amount_cents: -3,
  formatted_gift_card_amount: '-€0,03',
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
  total_amount_with_taxes_cents: 9500,
  formatted_total_amount_with_taxes: '€95,00',

  line_items: [
    presetLineItems.oneLine,
    presetLineItems.giftCardUsed,
    presetLineItems.percentageDiscountPromotionCoupon,
    presetLineItems.percentageDiscountPromotionOver100,
    presetLineItems.freeShippingPromotion,
    presetLineItems.adjustmentAdditionalService
  ]
}

const Template: StoryFn<typeof ResourceOrderSummary> = (args) => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <ResourceOrderSummary {...args} />
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
 * When the order is placed **without** using a `coupon_code`, it will not be shown in the summary.
 *
 * When you set `editable: true`, you'll be able to add a coupon by clicking on "Add coupon" link.
 */
export const WithoutACouponCode = Template.bind({})
WithoutACouponCode.args = {
  ...Default.args,
  editable: false,
  order: {
    ...order,
    coupon_code: undefined
  }
}

/**
 * When the order is placed **with** a `coupon_code`, it will be visible in the order summary in a dedicated section.
 *
 * When you set `editable: true`, you'll be able to remove the coupon by clicking on the "trash" icon.
 */
export const WithACouponCode = Template.bind({})
WithACouponCode.args = {
  ...Default.args,
  editable: false,
  order
}

/**
 * When the order does not contain a "manual adjustment" line_item, then the adjustment row is not shown.
 *
 * When you set `editable: true`, you'll be able to adjust the total by clicking on "Adjust total" link.
 */
export const WithoutAManualAdjustment = Template.bind({})
WithoutAManualAdjustment.args = {
  ...Default.args,
  editable: false,
  order: {
    ...order,
    coupon_code: undefined
  }
}

/**
 * When the order contains a "manual adjustment" line_item, then the adjustment row is visible in the order summary with a label "Adjustment".
 *
 * When you set `editable: true`, you'll be able to update the manual adjustment by clicking on its value (e.g. `-€8,00`).
 */
export const WithAManualAdjustment = Template.bind({})
WithAManualAdjustment.args = {
  ...Default.args,
  editable: false,
  order: {
    ...order,
    coupon_code: undefined,
    line_items: [...(order.line_items ?? []), presetLineItems.manualAdjustment]
  }
}
