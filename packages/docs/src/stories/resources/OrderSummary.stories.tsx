import { OrderSummary } from '#ui/resources/OrderSummary'
import { ComponentMeta, ComponentStory } from '@storybook/react'

const setup: ComponentMeta<typeof OrderSummary> = {
  title: 'Resources/Order Summary',
  component: OrderSummary,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof OrderSummary> = (args) => {
  return <OrderSummary {...args} />
}

export const Default = Template.bind({})
Default.args = {
  isLoading: false,
  footerActions: [
    {
      label: 'Archive',
      disabled: true,
      onClick: () => {
        alert('Approved!')
      }
    },
    {
      label: 'Approve',
      onClick: () => {
        alert('Approved!')
      }
    },
    {
      label: 'Cancel',
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
        formatted_total_amount: '18.00€'
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
        formatted_unit_amount: '34.00€'
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
        name: 'Black Unisex Lightweight Hoodie with White Logo',
        quantity: 10,
        formatted_total_amount: '1090.00€',
        formatted_unit_amount: '109.00€'
      }
    ]
  }
}
