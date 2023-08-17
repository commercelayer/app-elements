import { ListItemOrder } from '#ui/resources/ListItemOrder'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof ListItemOrder> = {
  title: 'Resources/ListItemOrder',
  component: ListItemOrder,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const market = {
  type: 'markets',
  id: '',
  name: 'Europe',
  created_at: '',
  updated_at: '',
  shared_secret: ''
} as const

const Template: StoryFn<typeof ListItemOrder> = (args) => (
  <ListItemOrder {...args} />
)

export const AwaitingApproval = Template.bind({})
AwaitingApproval.args = {
  isLoading: false,
  order: {
    type: 'orders',
    id: '',
    updated_at: '2023-06-10T06:38:44.964Z',
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
  }
}

export const Fulfilled = Template.bind({})
Fulfilled.args = {
  isLoading: false,
  order: {
    type: 'orders',
    id: '',
    created_at: '',
    updated_at: '2023-06-10T06:38:44.964Z',
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
  }
}

export const Pending = Template.bind({})
Pending.args = {
  isLoading: false,
  order: {
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
  }
}

export const Editing = Template.bind({})
Editing.args = {
  isLoading: false,
  order: {
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
  }
}
