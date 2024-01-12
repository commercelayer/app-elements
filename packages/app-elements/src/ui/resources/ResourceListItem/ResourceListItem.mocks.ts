import type {
  BuyXPayYPromotion,
  Customer,
  ExternalPromotion,
  FixedAmountPromotion,
  FixedPricePromotion,
  FreeGiftPromotion,
  FreeShippingPromotion,
  Market,
  Order,
  PercentageDiscountPromotion,
  Return,
  Shipment,
  StockLocation,
  StockTransfer
} from '@commercelayer/sdk'

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

const stockTransfer = {
  type: 'stock_transfers',
  id: '',
  number: 30817130,
  sku_code: 'BABYBIBXA19D9D000000XXXX',
  quantity: 1,
  status: 'upcoming',
  created_at: '',
  updated_at: ''
} as const satisfies StockTransfer

const order = {
  type: 'orders',
  id: '',
  updated_at: '2023-06-10T06:38:44.964Z',
  placed_at: '2023-06-09T11:00:00.000Z',
  created_at: '',
  formatted_total_amount: '$650.00',
  fulfillment_status: 'unfulfilled',
  number: 123456,
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
    number: 30817130,
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
    number: 30817130,
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
    number: 30817130,
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
  stockTransferUpcoming: {
    type: 'stock_transfers',
    id: '',
    number: 3478,
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
    number: 3478,
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
    number: 3478,
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
    stock_location: originStockLocation
  },
  shipmentPicking: {
    type: 'shipments',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    number: '30817130/S/0001',
    status: 'picking',
    stock_location: originStockLocation
  },
  shipmentPacking: {
    type: 'shipments',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    number: '30817130/S/0001',
    status: 'packing',
    stock_location: originStockLocation
  },
  shipmentReadyToShip: {
    type: 'shipments',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    number: '30817130/S/0001',
    status: 'ready_to_ship',
    stock_location: originStockLocation
  },
  shipmentOnHold: {
    type: 'shipments',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    number: '30817130/S/0001',
    status: 'on_hold',
    stock_location: originStockLocation
  },
  shipmentShipped: {
    type: 'shipments',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    number: '30817130/S/0001',
    status: 'shipped',
    stock_location: originStockLocation
  },
  shipmentWithStockTransfer: {
    type: 'shipments',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    number: '30817130/S/0001',
    status: 'upcoming',
    stock_location: originStockLocation,
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
    name: 'Free shipping',
    total_usage_limit: 3,
    active: true
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
    coupons: [
      { code: '1234', created_at: '', id: '', type: 'coupons', updated_at: '' }
    ]
  }
} satisfies Record<
  string,
  | Order
  | Return
  | Customer
  | StockTransfer
  | Shipment
  | BuyXPayYPromotion
  | ExternalPromotion
  | FixedAmountPromotion
  | FixedPricePromotion
  | FreeGiftPromotion
  | FreeShippingPromotion
  | PercentageDiscountPromotion
>
