/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { type Order } from '@commercelayer/sdk'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { vi } from 'vitest'
import { ResourceOrderSummary } from './ResourceOrderSummary'

const order: Order = {
  type: 'orders',
  id: '',
  created_at: '',
  updated_at: '',

  fulfillment_status: 'fulfilled',
  payment_status: 'authorized',
  status: 'approved',

  line_items: [
    {
      type: 'line_items',
      item_type: 'skus',
      id: '1',
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
      tax_amount_float: 3.915
    },
    {
      type: 'line_items',
      item_type: 'skus',
      id: '2',
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
      tax_amount_float: 3.915
    },
    {
      type: 'line_items',
      item_type: 'shipments',
      id: '3',
      created_at: '',
      updated_at: '',
      sku_code: null,
      image_url: null,
      name: 'Shipment #2474021/S/001',
      quantity: 1,
      formatted_unit_amount: '30.00€',
      formatted_total_amount: '30.00€',
      total_amount_float: 30.0,
      tax_amount_float: 0
    },
    {
      type: 'line_items',
      item_type: 'bundles',
      id: '3',
      created_at: '',
      updated_at: '',
      sku_code: null,
      bundle_code: 'TROPICALTREES',
      image_url: '',
      name: 'Tropical Trees',
      quantity: 1,
      formatted_unit_amount: '0.00€',
      formatted_total_amount: '0.00€',
      total_amount_float: 30.0,
      tax_amount_float: 0
    }
  ]
}

describe('ResourceOrderSummary', () => {
  it('should render', async () => {
    const { queryByTestId } = await act(async () =>
      render(
        <ResourceOrderSummary
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
    )

    expect(queryByTestId('ResourceOrderSummary-Subtotal')).toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Subtotal-value')
    ).toHaveTextContent('$141.60')

    expect(
      queryByTestId('ResourceOrderSummary-Discount')
    ).not.toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Adjustments')
    ).not.toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Shipping method')
    ).toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Shipping method-value')
    ).toHaveTextContent('$12.00')
    expect(
      queryByTestId('ResourceOrderSummary-Payment method')
    ).toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Payment method-value')
    ).toHaveTextContent('$10.00')
    expect(queryByTestId('ResourceOrderSummary-Taxes')).toBeInTheDocument()
    expect(queryByTestId('ResourceOrderSummary-Taxes-value')).toHaveTextContent(
      '$31.15'
    )
    expect(
      queryByTestId('ResourceOrderSummary-Gift card')
    ).not.toBeInTheDocument()
    expect(queryByTestId('ResourceOrderSummary-Total')).toBeInTheDocument()
    expect(queryByTestId('ResourceOrderSummary-Total-value')).toHaveTextContent(
      '$132.45'
    )
  })

  it('should only show line_items with an the item_type attribute equal to "skus" or "bundles"', async () => {
    const { queryAllByText } = render(<ResourceOrderSummary order={order} />)
    await waitFor(() => {
      expect(queryAllByText('Gray Baby Bib with Black Logo').length).toEqual(2)
    })
    expect(queryAllByText('Tropical Trees').length).toEqual(1)
    expect(queryAllByText('Shipment #2474021/S/001').length).toEqual(0)
  })

  it('should always show "subtotal", "shipping" and "total" even if the price is equal to 0 or undefined', async () => {
    const { queryByTestId } = await act(async () =>
      render(
        <ResourceOrderSummary
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
    )

    expect(queryByTestId('ResourceOrderSummary-Subtotal')).toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Discount')
    ).not.toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Adjustments')
    ).not.toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Shipping method')
    ).toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Shipping method-value')
    ).toHaveTextContent('free')
    expect(
      queryByTestId('ResourceOrderSummary-Payment method')
    ).not.toBeInTheDocument()
    expect(queryByTestId('ResourceOrderSummary-Taxes')).not.toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Gift card')
    ).not.toBeInTheDocument()
    expect(queryByTestId('ResourceOrderSummary-Total')).toBeInTheDocument()
  })

  it('should show everything when price is greater or lower than 0', async () => {
    const { queryByTestId } = await act(async () =>
      render(
        <ResourceOrderSummary
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
    )

    expect(queryByTestId('ResourceOrderSummary-Subtotal')).toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Subtotal-value')
    ).toHaveTextContent('$5.00')

    expect(queryByTestId('ResourceOrderSummary-Discount')).toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Discount-value')
    ).toHaveTextContent('$5.00')

    expect(queryByTestId('ResourceOrderSummary-Adjustment')).toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Adjustment-value')?.children[0]
    ).not.toBeInstanceOf(HTMLButtonElement)
    expect(
      queryByTestId('ResourceOrderSummary-Adjustment-value')
    ).toHaveTextContent('$5.00')

    expect(
      queryByTestId('ResourceOrderSummary-Shipping method')
    ).toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Shipping method-value')
    ).toHaveTextContent('$5.00')

    expect(
      queryByTestId('ResourceOrderSummary-Payment method')
    ).toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Payment method-value')
    ).toHaveTextContent('$5.00')

    expect(queryByTestId('ResourceOrderSummary-Taxes')).toBeInTheDocument()
    expect(queryByTestId('ResourceOrderSummary-Taxes-value')).toHaveTextContent(
      '$5.00'
    )

    expect(queryByTestId('ResourceOrderSummary-Gift card')).toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Gift card-value')
    ).toHaveTextContent('$5.00')

    expect(queryByTestId('ResourceOrderSummary-Total')).toBeInTheDocument()
    expect(queryByTestId('ResourceOrderSummary-Total-value')).toHaveTextContent(
      '$5.00'
    )
  })

  it('should show "Adjust total" beside Adjustment as Button when `editable` prop is set to true', async () => {
    const { queryByTestId } = await act(async () =>
      render(<ResourceOrderSummary editable order={order} />)
    )

    expect(queryByTestId('ResourceOrderSummary-Adjustment')).toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Adjustment-value')?.children[0]
    ).toBeInstanceOf(HTMLButtonElement)
    expect(
      queryByTestId('ResourceOrderSummary-Adjustment-value')
    ).toHaveTextContent('Adjust total')
  })

  it('should render the adjustment value as Button when `editable` prop is set to true', async () => {
    const { queryByTestId } = await act(async () =>
      render(
        <ResourceOrderSummary
          editable
          order={{
            ...order,
            adjustment_amount_cents: 5,
            formatted_adjustment_amount: '$5.00'
          }}
        />
      )
    )

    expect(queryByTestId('ResourceOrderSummary-Adjustment')).toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Adjustment-value')?.children[0]
    ).toBeInstanceOf(HTMLButtonElement)
    expect(
      queryByTestId('ResourceOrderSummary-Adjustment-value')
    ).toHaveTextContent('$5.00')
  })

  it('should not render the action buttons when not defined', async () => {
    const { queryByTestId } = await act(async () =>
      render(<ResourceOrderSummary order={order} />)
    )

    expect(queryByTestId('action-buttons')).not.toBeInTheDocument()
  })

  it('should render the action buttons when defined', async () => {
    const mockedConsoleLog = vi
      .spyOn(console, 'log')
      .mockImplementation(() => {})

    const { getByText, getByTestId } = await act(async () =>
      render(
        <ResourceOrderSummary
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
    const mockedConsoleLog = vi
      .spyOn(console, 'log')
      .mockImplementation(() => {})
    const { getByText, getByTestId } = await act(async () =>
      render(
        <ResourceOrderSummary
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
