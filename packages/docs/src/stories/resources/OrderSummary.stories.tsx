import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider'
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
      {
        type: 'line_items',
        item_type: 'skus',
        id: '',
        created_at: '',
        updated_at: '',
        sku_code: 'BABYBIBXA19D9D000000XXXX',
        image_url:
          'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BABYBIBXA19D9D000000XXXX_FLAT.png',
        name: 'Gray Baby Bib with Black Logo',
        quantity: 2,
        formatted_unit_amount: '9.00€',
        formatted_total_amount: '18.00€',
        total_amount_float: 18.0,
        tax_amount_float: 100
      },
      {
        type: 'line_items',
        item_type: 'skus',
        id: '',
        created_at: '',
        updated_at: '',
        sku_code: 'BASEBHAT000000FFFFFFXXXX',
        image_url:
          'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BASEBHAT000000FFFFFFXXXX_FLAT.png',
        name: 'Black Baseball Hat with White Logo',
        quantity: 1,
        formatted_total_amount: '34.00€',
        formatted_unit_amount: '34.00€',
        total_amount_float: 34.0,
        tax_amount_float: 0
      },
      {
        type: 'line_items',
        item_type: 'skus',
        id: '',
        created_at: '',
        updated_at: '',
        sku_code: 'HOODIEUL000000FFFFFFLXXX',
        image_url:
          'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/HOODIEUL000000FFFFFFLXXX_FLAT.png',
        name: 'BlackUnisexLightweightHoodieWithWhiteLogo_Cotton_Fabric_long_name',
        quantity: 10,
        formatted_total_amount: '1090.00€',
        formatted_unit_amount: '109.00€',
        total_amount_float: 1090.0,
        tax_amount_float: 200
      }
    ]
  }
}

export const LineItemsOptions = Template.bind({})
LineItemsOptions.args = {
  isLoading: false,
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
      {
        type: 'line_items',
        item_type: 'skus',
        id: '',
        created_at: '',
        updated_at: '',
        sku_code: 'HOODIEUL000000FFFFFFLXXX',
        image_url:
          'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/HOODIEUL000000FFFFFFLXXX_FLAT.png',
        name: 'Black Unisex Lightweight Hoodie with White Logo',
        quantity: 10,
        formatted_total_amount: '1090.00€',
        formatted_unit_amount: '109.00€',
        total_amount_float: 1090.0,
        tax_amount_float: 200,

        line_item_options: [
          {
            id: 'NOnEiOMPRx',
            type: 'line_item_options',
            name: 'Front Text',
            quantity: 1,
            currency_code: 'USD',
            unit_amount_cents: 100,
            unit_amount_float: 1,
            formatted_unit_amount: '$1.00',
            total_amount_cents: 100,
            total_amount_float: 1,
            formatted_total_amount: '$1.00',
            delay_hours: 0,
            delay_days: 0,
            options: {
              line1: 'Commerce Layer',
              line2: 'Composable Commerce API'
            },
            created_at: '2023-03-27T10:33:30.074Z',
            updated_at: '2023-03-27T10:33:30.074Z',
            reference: null,
            reference_origin: null,
            metadata: {}
          },
          {
            id: 'xqrRidVOVN',
            type: 'line_item_options',
            name: 'Rear Text',
            quantity: 1,
            currency_code: 'USD',
            unit_amount_cents: 100,
            unit_amount_float: 1,
            formatted_unit_amount: '$1.00',
            total_amount_cents: 100,
            total_amount_float: 1,
            formatted_total_amount: '$1.00',
            delay_hours: 0,
            delay_days: 0,
            options: {
              name: 'Ringo Starr',
              team: 'Beatles'
            },
            created_at: '2023-03-27T10:33:30.099Z',
            updated_at: '2023-03-27T10:33:30.099Z',
            reference: null,
            reference_origin: null,
            metadata: {}
          },
          {
            id: 'xqrRisOVN',
            type: 'line_item_options',
            name: 'Special',
            quantity: 1,
            currency_code: 'USD',
            unit_amount_cents: 100,
            unit_amount_float: 1,
            formatted_unit_amount: '$1.00',
            total_amount_cents: 100,
            total_amount_float: 1,
            formatted_total_amount: '$1.00',
            delay_hours: 0,
            delay_days: 0,
            options: {
              logo_url: 'http://data.commercelayer.com/long_url/logo.png',
              colors: ['#400', '#fff', '#000fff'],
              position: {
                x: 30,
                y: 10
              }
            },
            created_at: '2023-03-27T10:33:30.099Z',
            updated_at: '2023-03-27T10:33:30.099Z',
            reference: null,
            reference_origin: null,
            metadata: {}
          }
        ]
      }
    ]
  }
}

export const WithBundle = Template.bind({})
WithBundle.args = {
  isLoading: false,
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
      {
        id: 'PljQzimxgB',
        type: 'line_items',
        item_type: 'bundles',
        sku_code: null,
        bundle_code: 'WELCOME_KIT_001',
        quantity: 1,
        currency_code: 'USD',
        unit_amount_cents: 1000,
        unit_amount_float: 10,
        formatted_unit_amount: '$10.00',
        formatted_options_amount: '$0.00',
        formatted_discount: '$0.00',
        total_amount_cents: 1000,
        total_amount_float: 10,
        formatted_total_amount: '$10.00',
        tax_amount_cents: 0,
        tax_amount_float: 0,
        name: 'Welcome KIT',
        image_url:
          'https://data.commercelayer.app/assets/images/t-shirts/color/png/t-shirt-flat_GREEN-ALIEN.png',
        created_at: '2023-04-28T09:46:16.219Z',
        updated_at: '2023-04-28T09:46:16.219Z'
      }
    ]
  }
}
