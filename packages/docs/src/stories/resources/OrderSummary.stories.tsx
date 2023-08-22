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
    id: 'JZYhBKoLZW',

    number: 45531033,
    autorefresh: true,
    status: 'placed',
    payment_status: 'authorized',
    fulfillment_status: 'unfulfilled',
    guest: true,
    editable: false,
    customer_email: 'marco.montalbano@commercelayer.io',
    language_code: 'it',
    currency_code: 'EUR',
    tax_included: true,
    tax_rate: null,
    freight_taxable: null,
    requires_billing_info: false,
    country_code: 'IT',
    shipping_country_code_lock: null,
    coupon_code: '10PER100',
    gift_card_code: '6665f707-09bc-4497-a01e-4c8bb1ccacb2',
    subtotal_amount_cents: 13000,
    subtotal_amount_float: 130,
    formatted_subtotal_amount: '€130,00',
    shipping_amount_cents: 1200,
    shipping_amount_float: 12,
    formatted_shipping_amount: '€12,00',
    payment_method_amount_cents: 0,
    payment_method_amount_float: 0,
    formatted_payment_method_amount: '€0,00',
    discount_amount_cents: -4300,
    discount_amount_float: -43,
    formatted_discount_amount: '-€43,00',
    adjustment_amount_cents: 0,
    adjustment_amount_float: 0,
    formatted_adjustment_amount: '€0,00',
    gift_card_amount_cents: -900,
    gift_card_amount_float: -9,
    formatted_gift_card_amount: '-€9,00',
    total_tax_amount_cents: 0,
    total_tax_amount_float: 0,
    formatted_total_tax_amount: '€0,00',
    subtotal_tax_amount_cents: 0,
    subtotal_tax_amount_float: 0,
    formatted_subtotal_tax_amount: '€0,00',
    shipping_tax_amount_cents: 0,
    shipping_tax_amount_float: 0,
    formatted_shipping_tax_amount: '€0,00',
    payment_method_tax_amount_cents: 0,
    payment_method_tax_amount_float: 0,
    formatted_payment_method_tax_amount: '€0,00',
    adjustment_tax_amount_cents: 0,
    adjustment_tax_amount_float: 0,
    formatted_adjustment_tax_amount: '€0,00',
    total_amount_cents: 9900,
    total_amount_float: 99,
    formatted_total_amount: '€99,00',
    total_taxable_amount_cents: 14200,
    total_taxable_amount_float: 142,
    formatted_total_taxable_amount: '€142,00',
    subtotal_taxable_amount_cents: 13000,
    subtotal_taxable_amount_float: 130,
    formatted_subtotal_taxable_amount: '€130,00',
    shipping_taxable_amount_cents: 1200,
    shipping_taxable_amount_float: 12,
    formatted_shipping_taxable_amount: '€12,00',
    payment_method_taxable_amount_cents: 0,
    payment_method_taxable_amount_float: 0,
    formatted_payment_method_taxable_amount: '€0,00',
    adjustment_taxable_amount_cents: 0,
    adjustment_taxable_amount_float: 0,
    formatted_adjustment_taxable_amount: '€0,00',
    total_amount_with_taxes_cents: 9000,
    total_amount_with_taxes_float: 90,
    formatted_total_amount_with_taxes: '€90,00',
    fees_amount_cents: 0,
    fees_amount_float: 0,
    formatted_fees_amount: '€0,00',
    duty_amount_cents: null,
    duty_amount_float: null,
    formatted_duty_amount: null,
    skus_count: 2,
    line_item_options_count: 0,
    shipments_count: 1,
    tax_calculations_count: 0,
    validations_count: 0,
    payment_source_details: {
      type: 'wire_transfer'
    },
    token: 'd66c465d6d138ee7c3a130e13956f7a9',
    cart_url: 'https://commercelayer.github.io/demo-store-core/it-IT/cart',
    return_url: 'https://commercelayer.github.io/demo-store-core/it-IT',
    terms_url: null,
    privacy_url: null,
    checkout_url: null,
    placed_at: '2023-08-22T13:20:14.619Z',
    approved_at: null,
    cancelled_at: null,
    payment_updated_at: '2023-08-22T13:20:14.584Z',
    fulfillment_updated_at: null,
    refreshed_at: '2023-08-22T13:19:51.091Z',
    archived_at: null,
    expires_at: null,
    subscription_created_at: null,
    created_at: '2023-08-22T13:15:21.536Z',
    updated_at: '2023-08-22T13:20:14.617Z',
    reference: null,
    reference_origin: null,
    metadata: {},

    line_items: [
      presetLineItems.oneLine,
      presetLineItems.twoLines,
      presetLineItems.withBundle,
      presetLineItems.withOptions,
      presetLineItems.giftCard,
      presetLineItems.percentageDiscountPromotionCoupon,
      presetLineItems.percentageDiscountPromotionOver100,
      presetLineItems.percentageDiscountPromotionSkuList,
      presetLineItems.freeShippingPromotion
    ]
  }
}
