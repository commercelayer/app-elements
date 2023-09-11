import type { Customer, Market, Order, Return } from '@commercelayer/sdk'

const market = {
  type: 'markets',
  id: '',
  name: 'Europe',
  created_at: '',
  updated_at: '',
  shared_secret: ''
} as const satisfies Market

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
    email: 'john.doe@commercelayer.io'
  },
  customerAcquired: {
    type: 'customers',
    id: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    created_at: '2023-06-09T11:00:00.000Z',
    status: 'acquired',
    email: 'john.doe@commercelayer.io'
  },
  customerRepeat: {
    type: 'customers',
    id: '',
    updated_at: '2023-06-10T06:38:44.964Z',
    created_at: '2023-06-09T11:00:00.000Z',
    status: 'repeat',
    email: 'john.doe@commercelayer.io'
  }
} satisfies Record<string, Order | Return | Customer>
