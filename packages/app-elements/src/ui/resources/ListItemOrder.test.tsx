import { type Order } from '@commercelayer/sdk'
import { render } from '@testing-library/react'
import { ListItemOrder } from './ListItemOrder'

const order: Order = {
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

describe('ListItemOrder', () => {
  it('should render', () => {
    const { queryByTestId } = render(<ListItemOrder order={order} />)

    expect(queryByTestId('ListItemOrder-number')).toHaveTextContent('#123456')
    expect(queryByTestId('ListItemOrder-content')).toHaveTextContent(
      'Jun 10 · B. Wayne · Awaiting approval'
    )
    expect(queryByTestId('ListItemOrder-total')).toHaveTextContent('$650.00')
    expect(queryByTestId('ListItemOrder-payment')).toHaveTextContent(
      'Authorized'
    )
  })

  it('should render as div by default', () => {
    const { queryByTestId } = render(<ListItemOrder order={order} />)
    expect(queryByTestId('ListItemOrder')?.tagName).toBe('DIV')
  })

  it('should render as anchor tag', () => {
    const { queryByTestId } = render(<ListItemOrder order={order} tag='a' />)
    expect(queryByTestId('ListItemOrder')?.tagName).toBe('A')
  })
})
