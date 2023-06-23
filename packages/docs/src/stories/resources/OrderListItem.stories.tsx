import { ListItemOrder } from '#ui/resources/ListItemOrder'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof ListItemOrder> = {
  title: 'Resources/ListItem Order',
  component: ListItemOrder,
  parameters: {
    layout: 'padded'
  }
}
export default setup

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
