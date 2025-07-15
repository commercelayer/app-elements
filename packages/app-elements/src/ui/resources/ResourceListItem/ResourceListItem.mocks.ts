import type {
  Market,
  Order,
  ShippingMethod,
  Sku,
  StockLocation,
  StockTransfer
} from '@commercelayer/sdk'
import { type ResourceListItemProps } from './ResourceListItem'

const market = {
  type: 'markets',
  id: '',
  name: 'Europe',
  created_at: '',
  updated_at: '',
  shared_secret: ''
} as const satisfies Market

const originStockLocation = {
  type: 'stock_locations',
  id: '',
  name: 'US Warehouse',
  created_at: '',
  updated_at: ''
} as const satisfies StockLocation

const destinationStockLocation = {
  type: 'stock_locations',
  id: '',
  name: 'NY Store',
  created_at: '',
  updated_at: ''
} as const satisfies StockLocation

const sku = {
  type: 'skus',
  id: '',
  code: 'BASEBHAT000000FFFFFFXXXX',
  name: 'Black Baseball Hat with White Logo',
  image_url:
    'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BASEBHAT000000FFFFFFXXXX_FLAT.png',
  created_at: '',
  updated_at: ''
} as const satisfies Sku

const stockTransfer = {
  type: 'stock_transfers',
  id: '',
  number: '30817130',
  sku_code: 'BABYBIBXA19D9D000000XXXX',
  quantity: 1,
  status: 'upcoming',
  created_at: '',
  updated_at: ''
} as const satisfies StockTransfer

const shippingMethod = {
  type: 'shipping_methods',
  id: '',
  name: 'Standard Shipping',
  price_amount_cents: 0,
  created_at: '',
  updated_at: '',
  shared_secret: ''
} as const satisfies ShippingMethod

const order = {
  type: 'orders',
  id: '',
  updated_at: '2023-06-10T06:38:44.964Z',
  placed_at: '2023-06-09T11:00:00.000Z',
  created_at: '',
  formatted_total_amount: '$650.00',
  fulfillment_status: 'unfulfilled',
  number: '123456',
  payment_status: 'authorized',
  status: 'placed',
  market,
  billing_address: {
    first_name: 'Bruce',
    last_name: 'Wayne',
    type: 'addresses',
    id: '',
    updated_at: '',
    created_at: '',
    line_1: '',
    state_code: '',
    phone: '',
    city: '',
    country_code: ''
  }
} as const satisfies Order

export const presetResourceListItem = {
  orderAwaitingApproval: order,
  orderFulfilled: {
    type: 'orders',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    placed_at: '2023-06-09T11:00:00.000Z',
    number: '30817130',
    status: 'approved',
    payment_status: 'paid',
    fulfillment_status: 'fulfilled',
    formatted_total_amount: '$272.00',
    market,
    billing_address: {
      first_name: 'Ringo',
      last_name: 'Starr',
      company: 'The Beatles',
      type: 'addresses',
      id: '',
      updated_at: '',
      created_at: '',
      line_1: '',
      state_code: '',
      phone: '',
      city: '',
      country_code: ''
    }
  },
  orderPending: {
    type: 'orders',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    number: '30817130',
    status: 'pending',
    payment_status: 'unpaid',
    fulfillment_status: 'unfulfilled',
    formatted_total_amount: '$272.00',
    market
  },
  orderEditing: {
    type: 'orders',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    number: '30817130',
    status: 'editing',
    payment_status: 'authorized',
    fulfillment_status: 'unfulfilled',
    formatted_total_amount: '$272.00',
    market,
    billing_address: {
      first_name: 'Michele',
      last_name: 'Jordan',
      type: 'addresses',
      id: '',
      updated_at: '',
      created_at: '',
      line_1: '',
      state_code: '',
      phone: '',
      city: '',
      country_code: ''
    }
  },
  returnRequested: {
    type: 'returns',
    id: '',
    number: '123456',
    updated_at: '2023-06-10T06:38:44.964Z',
    created_at: '',
    status: 'requested',
    order
  },
  returnApproved: {
    type: 'returns',
    id: '',
    number: '123456',
    updated_at: '2023-06-10T06:38:44.964Z',
    created_at: '',
    status: 'approved',
    order
  },
  returnShipped: {
    type: 'returns',
    id: '',
    number: '123456',
    updated_at: '2023-06-10T06:38:44.964Z',
    created_at: '',
    status: 'shipped',
    order
  },
  returnReceived: {
    type: 'returns',
    id: '',
    number: '123456',
    updated_at: '2023-06-10T06:38:44.964Z',
    created_at: '',
    status: 'received',
    order
  },
  returnCancelled: {
    type: 'returns',
    id: '',
    number: '123456',
    updated_at: '2023-06-10T06:38:44.964Z',
    created_at: '',
    status: 'cancelled',
    order
  },
  returnRejected: {
    type: 'returns',
    id: '',
    number: '123456',
    updated_at: '2023-06-10T06:38:44.964Z',
    created_at: '',
    status: 'rejected',
    order
  },
  returnRefunded: {
    type: 'returns',
    id: '',
    number: '123456',
    updated_at: '2023-06-10T06:38:44.964Z',
    created_at: '',
    status: 'refunded',
    order
  },
  customerProspect: {
    type: 'customers',
    id: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    created_at: '2023-06-09T11:00:00.000Z',
    status: 'prospect',
    email: 'john.doe@commercelayer.io',
    total_orders_count: 1
  },
  customerRepeat: {
    type: 'customers',
    id: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    created_at: '2023-06-09T11:00:00.000Z',
    status: 'repeat',
    email: 'john.doe@commercelayer.io',
    total_orders_count: 10
  },
  customerAcquired: {
    type: 'customers',
    id: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    created_at: '2023-06-09T11:00:00.000Z',
    status: 'acquired',
    email: 'john.doe@commercelayer.io',
    customer_group: {
      type: 'customer_groups',
      id: '',
      name: 'VIP',
      updated_at: '2023-06-10T06:38:44.964Z',
      created_at: '2023-06-09T11:00:00.000Z'
    }
  },
  skuListItemWithQuantity: {
    type: 'sku_list_items',
    id: '',
    quantity: 3,
    sku,
    created_at: '',
    updated_at: ''
  },
  stockTransferUpcoming: {
    type: 'stock_transfers',
    id: '',
    number: '3478',
    quantity: 1,
    updated_at: '2023-06-10T06:38:44.964Z',
    created_at: '2023-06-09T11:00:00.000Z',
    status: 'upcoming',
    origin_stock_location: originStockLocation,
    destination_stock_location: destinationStockLocation
  },
  stockTransferPicking: {
    type: 'stock_transfers',
    id: '',
    number: '3478',
    quantity: 1,
    updated_at: '2023-06-10T06:38:44.964Z',
    created_at: '2023-06-09T11:00:00.000Z',
    status: 'picking',
    origin_stock_location: originStockLocation,
    destination_stock_location: destinationStockLocation
  },
  stockTransferCompleted: {
    type: 'stock_transfers',
    id: '',
    number: '3478',
    quantity: 1,
    updated_at: '2023-06-10T06:38:44.964Z',
    created_at: '2023-06-09T11:00:00.000Z',
    completed_at: '2023-06-10T11:40:00.000Z',
    status: 'completed',
    origin_stock_location: originStockLocation,
    destination_stock_location: destinationStockLocation
  },
  shipmentUpcoming: {
    type: 'shipments',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    number: '30817130/S/0001',
    status: 'upcoming',
    stock_location: originStockLocation,
    shipping_method: shippingMethod
  },
  shipmentPicking: {
    type: 'shipments',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    number: '30817130/S/0001',
    status: 'picking',
    stock_location: originStockLocation,
    shipping_method: shippingMethod
  },
  shipmentPacking: {
    type: 'shipments',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    number: '30817130/S/0001',
    status: 'packing',
    stock_location: originStockLocation,
    shipping_method: shippingMethod
  },
  shipmentReadyToShip: {
    type: 'shipments',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    number: '30817130/S/0001',
    status: 'ready_to_ship',
    stock_location: originStockLocation,
    shipping_method: shippingMethod
  },
  shipmentOnHold: {
    type: 'shipments',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    number: '30817130/S/0001',
    status: 'on_hold',
    stock_location: originStockLocation,
    shipping_method: shippingMethod
  },
  shipmentShipped: {
    type: 'shipments',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    number: '30817130/S/0001',
    status: 'shipped',
    stock_location: originStockLocation,
    shipping_method: shippingMethod
  },
  shipmentDelivered: {
    type: 'shipments',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    number: '30817130/S/0001',
    status: 'delivered',
    stock_location: originStockLocation,
    shipping_method: shippingMethod
  },
  shipmentWithReference: {
    type: 'shipments',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    number: '30817130/S/0001',
    status: 'picking',
    reference: '34692GA',
    stock_location: originStockLocation,
    shipping_method: shippingMethod
  },
  shipmentWithStockTransfer: {
    type: 'shipments',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    number: '30817130/S/0001',
    status: 'upcoming',
    stock_location: originStockLocation,
    shipping_method: shippingMethod,
    stock_transfers: [stockTransfer]
  },
  promotionActive: {
    type: 'percentage_discount_promotions',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    starts_at: '2024-01-01T06:38:44.964Z',
    expires_at: '3033-01-01T06:38:44.964Z',
    name: 'Jan 30% off',
    percentage: 30,
    total_usage_limit: 3,
    active: true
  },
  promotionDisabled: {
    type: 'percentage_discount_promotions',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    starts_at: '2024-01-01T06:38:44.964Z',
    expires_at: '2033-01-01T06:38:44.964Z',
    disabled_at: '2023-01-01T06:38:44.964Z',
    name: 'Jan 50% off',
    percentage: 50,
    total_usage_limit: 3,
    active: false
  },
  promotionUpcoming: {
    type: 'free_shipping_promotions',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    starts_at: '2033-01-01T06:38:44.964Z',
    expires_at: '2043-01-01T06:38:44.964Z',
    name: 'Jan free shipping',
    total_usage_limit: 3,
    active: false
  },
  promotionDisabledAndUpcoming: {
    type: 'free_shipping_promotions',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    starts_at: '2033-01-01T06:38:44.964Z',
    expires_at: '2043-01-01T06:38:44.964Z',
    disabled_at: '2023-01-01T06:38:44.964Z',
    name: 'Jan free shipping (alternative test)',
    total_usage_limit: 3,
    active: false
  },
  promotionExpired: {
    type: 'free_gift_promotions',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    starts_at: '2023-01-01T06:38:44.964Z',
    expires_at: '2023-12-01T06:38:44.964Z',
    name: 'Free gift',
    total_usage_limit: 3,
    active: false
  },
  promotionUsed: {
    type: 'percentage_discount_promotions',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    starts_at: '2024-01-01T06:38:44.964Z',
    expires_at: '3033-01-01T06:38:44.964Z',
    name: 'Jan 30% off',
    percentage: 30,
    total_usage_count: 3, // count === limit
    total_usage_limit: 3,
    active: true
  },
  promotionWithCoupons: {
    type: 'percentage_discount_promotions',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    starts_at: '2024-01-01T06:38:44.964Z',
    expires_at: '3033-01-01T06:38:44.964Z',
    name: '50% off',
    percentage: 23,
    total_usage_limit: 3,
    active: true,
    coupon_codes_promotion_rule: {
      type: 'coupon_codes_promotion_rules',
      id: '',
      created_at: '',
      updated_at: '2023-06-10T06:38:44.964Z'
    }
  },
  promotionFlex: {
    type: 'flex_promotions',
    id: '',
    created_at: '2024-10-21T17:22:42.054Z',
    updated_at: '2024-10-22T09:06:14.517Z',
    name: '20% on the second item',
    starts_at: '2024-09-28T22:00:00.000Z',
    expires_at: '2024-11-01T23:00:00.000Z',
    rules: {
      rules: [
        {
          id: 'feaec315-062e-4542-b400-b9836a80a2f4',
          name: 'discount',
          actions: [
            {
              type: 'percentage',
              limit: {
                type: 'min',
                input: {
                  attribute: 'unit_amount_cents'
                },
                value: 2
              },
              value: '20%',
              groups: ['discountable_items'],
              selector: 'order.line_items.sku'
            }
          ],
          priority: 0,
          conditions: [
            {
              field: 'order.line_items.quantity',
              group: 'discountable_items',
              value: 2,
              nested: {
                conditions: [
                  {
                    field: 'order.line_items.unit_amount_cents',
                    group: 'discountable_items',
                    value: 13000,
                    matcher: 'gteq'
                  }
                ]
              },
              matcher: 'gteq'
            },
            {
              field: 'order.line_items.sku.name',
              group: '20007a73-173b-487c-a071-91eaccdfc022',
              value: 'Cap',
              matcher: 'matches'
            }
          ],
          conditions_logic: 'and'
        }
      ]
    }
  },
  promotionFlexWithCoupons: {
    type: 'flex_promotions',
    id: '',
    created_at: '2024-10-21T17:22:42.054Z',
    updated_at: '2024-10-22T09:06:14.517Z',
    name: '20% on the second item',
    starts_at: '2024-09-28T22:00:00.000Z',
    expires_at: '2024-11-01T23:00:00.000Z',
    rules: {
      rules: [
        {
          id: 'feaec315-062e-4542-b400-b9836a80a2f4',
          name: 'discount',
          actions: [
            {
              type: 'percentage',
              limit: {
                type: 'min',
                input: {
                  attribute: 'unit_amount_cents'
                },
                value: 2
              },
              value: '20%',
              groups: ['discountable_items'],
              selector: 'order.line_items.sku'
            }
          ],
          priority: 0,
          conditions: [
            {
              field: 'order.line_items.quantity',
              group: 'discountable_items',
              value: 2,
              nested: {
                conditions: [
                  {
                    field: 'order.line_items.unit_amount_cents',
                    group: 'discountable_items',
                    value: 13000,
                    matcher: 'gteq'
                  }
                ]
              },
              matcher: 'gteq'
            },
            {
              field: 'order.line_items.sku.name',
              group: '20007a73-173b-487c-a071-91eaccdfc022',
              value: 'Cap',
              matcher: 'matches'
            }
          ],
          conditions_logic: 'and'
        }
      ]
    },
    coupon_codes_promotion_rule: {
      type: 'coupon_codes_promotion_rules',
      id: '',
      created_at: '',
      updated_at: '2023-06-10T06:38:44.964Z'
    }
  },
  promotionWithPriority: {
    type: 'percentage_discount_promotions',
    id: '',
    created_at: '2024-10-21T17:22:42.054Z',
    updated_at: '2024-10-22T09:06:14.517Z',
    name: '12% on the second item',
    starts_at: '2024-09-28T22:00:00.000Z',
    expires_at: '2024-11-01T23:00:00.000Z',
    percentage: 12,
    priority: 1
  },
  promotionWithExclusive: {
    type: 'percentage_discount_promotions',
    id: '',
    created_at: '2024-10-21T17:22:42.054Z',
    updated_at: '2024-10-22T09:06:14.517Z',
    name: '12% on the second item',
    starts_at: '2024-09-28T22:00:00.000Z',
    expires_at: '2024-11-01T23:00:00.000Z',
    percentage: 12,
    exclusive: true
  },
  promotionWithPriorityAndExclusive: {
    type: 'percentage_discount_promotions',
    id: '',
    created_at: '2024-10-21T17:22:42.054Z',
    updated_at: '2024-10-22T09:06:14.517Z',
    name: '12% on the second item',
    starts_at: '2024-09-28T22:00:00.000Z',
    expires_at: '2024-11-01T23:00:00.000Z',
    percentage: 12,
    exclusive: true,
    priority: 3
  }
} satisfies Record<string, ResourceListItemProps['resource']>
