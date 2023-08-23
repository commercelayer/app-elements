import { type Order } from '@commercelayer/sdk'
import { fireEvent, render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { vi } from 'vitest'
import { OrderSummary } from './OrderSummary'

const order: Order = {
  type: 'orders',
  id: '',
  created_at: '',
  updated_at: '',

  fulfillment_status: 'fulfilled',
  payment_status: 'authorized',
  status: 'approved',

  line_items: [
    ...Array(2).fill({
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
    }),
    {
      type: 'line_items',
      item_type: 'shipments',
      id: '',
      created_at: '',
      updated_at: '',
      sku_code: null,
      image_url: null,
      name: 'Shipment #2474021/S/001',
      quantity: 1,
      formatted_unit_amount: '30.00€',
      formatted_total_amount: '30.00€'
    },
    {
      type: 'line_items',
      item_type: 'bundles',
      id: '',
      created_at: '',
      updated_at: '',
      sku_code: null,
      bundle_code: 'TROPICALTREES',
      image_url: '',
      name: 'Tropical Trees',
      quantity: 1,
      formatted_unit_amount: '0.00€',
      formatted_total_amount: '0.00€'
    }
  ]
}

describe('OrderSummary', () => {
  it('should render', () => {
    const { queryByTestId } = render(
      <OrderSummary
        order={{
          ...order,
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
          total_amount_with_taxes_cents: 13245,
          formatted_total_amount_with_taxes: '$132.45'
        }}
      />
    )

    expect(queryByTestId('OrderSummary-Subtotal')).toBeInTheDocument()
    expect(queryByTestId('OrderSummary-Subtotal-value')).toHaveTextContent(
      '$141.60'
    )

    expect(queryByTestId('OrderSummary-Discount')).not.toBeInTheDocument()
    expect(queryByTestId('OrderSummary-Adjustments')).not.toBeInTheDocument()
    expect(queryByTestId('OrderSummary-Shipping method')).toBeInTheDocument()
    expect(
      queryByTestId('OrderSummary-Shipping method-value')
    ).toHaveTextContent('$12.00')
    expect(queryByTestId('OrderSummary-Payment method')).toBeInTheDocument()
    expect(
      queryByTestId('OrderSummary-Payment method-value')
    ).toHaveTextContent('$10.00')
    expect(queryByTestId('OrderSummary-Taxes')).toBeInTheDocument()
    expect(queryByTestId('OrderSummary-Taxes-value')).toHaveTextContent(
      '$31.15'
    )
    expect(queryByTestId('OrderSummary-Gift card')).not.toBeInTheDocument()
    expect(queryByTestId('OrderSummary-Total')).toBeInTheDocument()
    expect(queryByTestId('OrderSummary-Total-value')).toHaveTextContent(
      '$132.45'
    )
  })

  it('should only show line_items with an the item_type attribute equal to "skus" or "bundles"', () => {
    const { queryAllByText } = render(<OrderSummary order={order} />)

    expect(queryAllByText('Gray Baby Bib with Black Logo').length).toEqual(2)
    expect(queryAllByText('Tropical Trees').length).toEqual(1)
    expect(queryAllByText('Shipment #2474021/S/001').length).toEqual(0)
  })

  it('should always show "subtotal", "shipping" and "total" even if the price is equal to 0 or undefined', () => {
    const { queryByTestId } = render(
      <OrderSummary
        order={{
          ...order,
          subtotal_amount_cents: 0,
          formatted_subtotal_amount: '$0.00',
          discount_amount_cents: 0,
          formatted_discount_amount: '$0.00',
          adjustment_amount_cents: 0,
          formatted_adjustment_amount: '$0.00',
          shipping_amount_cents: 0,
          formatted_shipping_amount: '$0.00',
          payment_method_amount_cents: 0,
          formatted_payment_method_amount: '$0.00',
          total_tax_amount_cents: 0,
          formatted_total_tax_amount: '$0.00'
        }}
      />
    )

    expect(queryByTestId('OrderSummary-Subtotal')).toBeInTheDocument()
    expect(queryByTestId('OrderSummary-Discount')).not.toBeInTheDocument()
    expect(queryByTestId('OrderSummary-Adjustments')).not.toBeInTheDocument()
    expect(queryByTestId('OrderSummary-Shipping method')).toBeInTheDocument()
    expect(
      queryByTestId('OrderSummary-Shipping method-value')
    ).toHaveTextContent('free')
    expect(queryByTestId('OrderSummary-Payment method')).not.toBeInTheDocument()
    expect(queryByTestId('OrderSummary-Taxes')).not.toBeInTheDocument()
    expect(queryByTestId('OrderSummary-Gift card')).not.toBeInTheDocument()
    expect(queryByTestId('OrderSummary-Total')).toBeInTheDocument()
  })

  it('should show everything when price is greater or lower than 0', () => {
    const { queryByTestId } = render(
      <OrderSummary
        order={{
          ...order,
          subtotal_amount_cents: 5,
          formatted_subtotal_amount: '$5.00',
          discount_amount_cents: 5,
          formatted_discount_amount: '$5.00',
          adjustment_amount_cents: 5,
          formatted_adjustment_amount: '$5.00',
          shipping_amount_cents: 5,
          formatted_shipping_amount: '$5.00',
          payment_method_amount_cents: 5,
          formatted_payment_method_amount: '$5.00',
          total_tax_amount_cents: 5,
          formatted_total_tax_amount: '$5.00',
          gift_card_amount_cents: 5,
          formatted_gift_card_amount: '$5.00',
          total_amount_with_taxes_cents: 5,
          formatted_total_amount_with_taxes: '$5.00'
        }}
      />
    )

    expect(queryByTestId('OrderSummary-Subtotal')).toBeInTheDocument()
    expect(queryByTestId('OrderSummary-Subtotal-value')).toHaveTextContent(
      '$5.00'
    )

    expect(queryByTestId('OrderSummary-Discount')).toBeInTheDocument()
    expect(queryByTestId('OrderSummary-Discount-value')).toHaveTextContent(
      '$5.00'
    )

    expect(queryByTestId('OrderSummary-Adjustment')).toBeInTheDocument()
    expect(
      queryByTestId('OrderSummary-Adjustment-value')?.children[0]
    ).not.toBeInstanceOf(HTMLButtonElement)
    expect(queryByTestId('OrderSummary-Adjustment-value')).toHaveTextContent(
      '$5.00'
    )

    expect(queryByTestId('OrderSummary-Shipping method')).toBeInTheDocument()
    expect(
      queryByTestId('OrderSummary-Shipping method-value')
    ).toHaveTextContent('$5.00')

    expect(queryByTestId('OrderSummary-Payment method')).toBeInTheDocument()
    expect(
      queryByTestId('OrderSummary-Payment method-value')
    ).toHaveTextContent('$5.00')

    expect(queryByTestId('OrderSummary-Taxes')).toBeInTheDocument()
    expect(queryByTestId('OrderSummary-Taxes-value')).toHaveTextContent('$5.00')

    expect(queryByTestId('OrderSummary-Gift card')).toBeInTheDocument()
    expect(queryByTestId('OrderSummary-Gift card-value')).toHaveTextContent(
      '$5.00'
    )

    expect(queryByTestId('OrderSummary-Total')).toBeInTheDocument()
    expect(queryByTestId('OrderSummary-Total-value')).toHaveTextContent('$5.00')
  })

  it('should show "Adjust total" beside Adjustment as Button when `editable` prop is set to true', () => {
    const { queryByTestId } = render(<OrderSummary editable order={order} />)

    expect(queryByTestId('OrderSummary-Adjustment')).toBeInTheDocument()
    expect(
      queryByTestId('OrderSummary-Adjustment-value')?.children[0]
    ).toBeInstanceOf(HTMLButtonElement)
    expect(queryByTestId('OrderSummary-Adjustment-value')).toHaveTextContent(
      'Adjust total'
    )
  })

  it('should render the adjustment value as Button when `editable` prop is set to true', () => {
    const { queryByTestId } = render(
      <OrderSummary
        editable
        order={{
          ...order,
          adjustment_amount_cents: 5,
          formatted_adjustment_amount: '$5.00'
        }}
      />
    )

    expect(queryByTestId('OrderSummary-Adjustment')).toBeInTheDocument()
    expect(
      queryByTestId('OrderSummary-Adjustment-value')?.children[0]
    ).toBeInstanceOf(HTMLButtonElement)
    expect(queryByTestId('OrderSummary-Adjustment-value')).toHaveTextContent(
      '$5.00'
    )
  })

  it('should not render the action buttons when not defined', async () => {
    const { queryByTestId } = render(<OrderSummary order={order} />)

    expect(queryByTestId('action-buttons')).not.toBeInTheDocument()
  })

  it('should render the action buttons when defined', async () => {
    const mockedConsoleLog = vi.spyOn(console, 'log')
    const { getByText, getByTestId } = render(
      <OrderSummary
        order={order}
        footerActions={[
          {
            label: 'Archive',
            disabled: true,
            onClick: () => {
              console.log('archived!')
            }
          },
          {
            label: 'Approve',
            onClick: () => {
              console.log('approved!')
            }
          },
          {
            label: 'Cancel',
            variant: 'secondary',
            onClick: () => {
              console.log('cancelled!')
            }
          }
        ]}
      />
    )

    const actionContainer = getByTestId('action-buttons')
    expect(actionContainer).toBeInTheDocument()

    expect(actionContainer.children[0]).toHaveClass('basis-1/2 flex gap-3')
    expect(actionContainer.children[1]).toHaveClass(
      'basis-1/2 flex gap-3 justify-end'
    )

    const archiveButton = getByText('Archive')
    const approveButton = getByText('Approve')
    const cancelButton = getByText('Cancel')

    expect(archiveButton).toBeInTheDocument()
    expect(approveButton).not.toHaveClass('w-full')
    expect(archiveButton.tagName).toEqual('BUTTON')
    await act(() => fireEvent.click(archiveButton))
    expect(mockedConsoleLog).not.toHaveBeenCalled()

    expect(approveButton).toBeInTheDocument()
    expect(approveButton).not.toHaveClass('w-full')
    expect(approveButton.tagName).toEqual('BUTTON')
    await act(() => fireEvent.click(approveButton))
    expect(mockedConsoleLog).toHaveBeenCalledWith('approved!')

    expect(cancelButton).toBeInTheDocument()
    expect(approveButton).not.toHaveClass('w-full')
    expect(cancelButton.tagName).toEqual('BUTTON')
    await act(() => fireEvent.click(cancelButton))
    expect(mockedConsoleLog).toHaveBeenCalledWith('cancelled!')
  })

  it('should render a full-width button when there is only one primary action', async () => {
    const mockedConsoleLog = vi.spyOn(console, 'log')
    const { getByText, getByTestId } = render(
      <OrderSummary
        order={order}
        footerActions={[
          {
            label: 'Approve',
            onClick: () => {
              console.log('approved!')
            }
          }
        ]}
      />
    )

    const actionContainer = getByTestId('action-buttons')
    expect(actionContainer).toBeInTheDocument()

    expect(actionContainer.children[0]).not.toHaveClass('basis-1/2 flex gap-3')

    const approveButton = getByText('Approve')

    expect(approveButton).toBeInTheDocument()
    expect(approveButton).toHaveClass('w-full')
    expect(approveButton.tagName).toEqual('BUTTON')
    await act(() => fireEvent.click(approveButton))
    expect(mockedConsoleLog).toHaveBeenCalledWith('approved!')
  })
})
