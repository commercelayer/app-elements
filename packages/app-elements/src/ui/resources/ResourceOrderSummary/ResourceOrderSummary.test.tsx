/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { MockTokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { presetLineItems } from '#ui/resources/ResourceLineItems/ResourceLineItems.mocks'
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
    presetLineItems.oneLine,
    presetLineItems.oneLine_2,
    presetLineItems.shipment,
    presetLineItems.paymentMethod,
    presetLineItems.percentageDiscountPromotionCoupon,
    presetLineItems.freeShippingPromotion,
    presetLineItems.withBundle,
    presetLineItems.adjustmentAdditionalService
  ]
}

describe('ResourceOrderSummary', () => {
  it('should render', async () => {
    const { queryByTestId } = await act(async () =>
      render(
        <MockTokenProvider kind='integration' appSlug='orders' devMode>
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
        </MockTokenProvider>
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

  it('should only show line_items with the item_type attribute equal to "skus" or "bundles"', async () => {
    const { queryAllByText } = render(
      <MockTokenProvider kind='integration' appSlug='orders' devMode>
        <ResourceOrderSummary order={order} />
      </MockTokenProvider>
    )
    await waitFor(() => {
      expect(queryAllByText('Gray Baby Bib with Black Logo').length).toEqual(1)
    })
    await waitFor(() => {
      expect(
        queryAllByText('Black Baseball Hat with White Logo').length
      ).toEqual(1)
    })
    expect(queryAllByText('Welcome KIT').length).toEqual(1)
    expect(queryAllByText('Shipment #45526430/S/001').length).toEqual(0)
  })

  it('should always show all `promotions` line items instead of the discount order attribute', async () => {
    const { queryByTestId, queryByText } = await act(async () =>
      render(
        <ResourceOrderSummary
          order={{
            ...order,
            discount_amount_cents: 1234567,
            formatted_discount_amount: '$1234567.00'
          }}
        />
      )
    )

    expect(queryByText('$1234567.00')).not.toBeInTheDocument()

    expect(
      queryByTestId('ResourceOrderSummary-10% OFF with coupon')
    ).toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-10% OFF with coupon-value')
    ).toHaveTextContent('-€13,00')

    expect(
      queryByTestId('ResourceOrderSummary-Free shipping promo')
    ).toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Free shipping promo-value')
    ).toHaveTextContent('-€12,00')
  })

  it('should always show all `adjustments` line items instead of the adjustment order attribute', async () => {
    const { queryByTestId, queryByText } = await act(async () =>
      render(
        <ResourceOrderSummary
          order={{
            ...order,
            adjustment_amount_cents: 1234567,
            formatted_adjustment_amount: '$1234567.00',
            adjustment_tax_amount_cents: 1234567,
            formatted_adjustment_tax_amount: '$1234567.00',
            adjustment_taxable_amount_cents: 1234567,
            formatted_adjustment_taxable_amount: '$1234567.00'
          }}
        />
      )
    )

    expect(queryByText('$1234567.00')).not.toBeInTheDocument()

    expect(
      queryByTestId('ResourceOrderSummary-Additional service (adjustment)')
    ).toBeInTheDocument()
    expect(
      queryByTestId(
        'ResourceOrderSummary-Additional service (adjustment)-value'
      )
    ).toHaveTextContent('€10,00')
  })

  it('should always show "subtotal", "shipping" and "total" even if the price is equal to 0 or undefined', async () => {
    const { queryByTestId } = await act(async () =>
      render(
        <MockTokenProvider kind='integration' appSlug='orders' devMode>
          <ResourceOrderSummary
            order={{
              ...order,
              subtotal_amount_cents: 0,
              formatted_subtotal_amount: '$0.00',
              discount_amount_cents: 0,
              formatted_discount_amount: '$0.00',
              shipping_amount_cents: 0,
              formatted_shipping_amount: '$0.00',
              payment_method_amount_cents: 0,
              formatted_payment_method_amount: '$0.00',
              total_tax_amount_cents: 0,
              formatted_total_tax_amount: '$0.00'
            }}
          />
        </MockTokenProvider>
      )
    )

    expect(queryByTestId('ResourceOrderSummary-Subtotal')).toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Discount')
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
        <MockTokenProvider kind='integration' appSlug='orders' devMode>
          <ResourceOrderSummary
            order={{
              ...order,
              subtotal_amount_cents: 500,
              formatted_subtotal_amount: '$5.00',
              discount_amount_cents: 500,
              formatted_discount_amount: '$5.00',
              adjustment_amount_cents: 500,
              formatted_adjustment_amount: '$5.00',
              shipping_amount_cents: 500,
              formatted_shipping_amount: '$5.00',
              payment_method_amount_cents: 500,
              formatted_payment_method_amount: '$5.00',
              total_tax_amount_cents: 500,
              formatted_total_tax_amount: '$5.00',
              gift_card_amount_cents: 3,
              formatted_gift_card_amount: '$0.03',
              total_amount_with_taxes_cents: 500,
              formatted_total_amount_with_taxes: '$5.00'
            }}
          />
        </MockTokenProvider>
      )
    )

    expect(queryByTestId('ResourceOrderSummary-Subtotal')).toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Subtotal-value')
    ).toHaveTextContent('$5.00')

    expect(
      queryByTestId('ResourceOrderSummary-Discount')
    ).not.toBeInTheDocument()

    expect(
      queryByTestId('ResourceOrderSummary-Adjustment')
    ).not.toBeInTheDocument()

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
    ).toHaveTextContent('$0.03')

    expect(queryByTestId('ResourceOrderSummary-Total')).toBeInTheDocument()
    expect(queryByTestId('ResourceOrderSummary-Total-value')).toHaveTextContent(
      '$5.00'
    )
  })

  it('should show "Adjust total" beside Adjustment as Button when `editable` prop is set to true and there is no a manual adjustment', async () => {
    const { queryByTestId } = await act(async () =>
      render(
        <MockTokenProvider kind='integration' appSlug='orders' devMode>
          <ResourceOrderSummary editable order={order} />
        </MockTokenProvider>
      )
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
        <MockTokenProvider kind='integration' appSlug='orders' devMode>
          <ResourceOrderSummary
            editable
            order={{
              ...order,
              line_items: [
                ...(order.line_items ?? []),
                presetLineItems.manualAdjustment
              ]
            }}
          />
        </MockTokenProvider>
      )
    )

    expect(queryByTestId('ResourceOrderSummary-Adjustment')).toBeInTheDocument()
    expect(
      queryByTestId('ResourceOrderSummary-Adjustment-value')?.children[0]
    ).toBeInstanceOf(HTMLButtonElement)
    expect(
      queryByTestId('ResourceOrderSummary-Adjustment-value')
    ).toHaveTextContent('-€8,00')
  })

  it('should not render the action buttons when not defined', async () => {
    const { queryByTestId } = await act(async () =>
      render(
        <MockTokenProvider kind='integration' appSlug='orders' devMode>
          <ResourceOrderSummary order={order} />
        </MockTokenProvider>
      )
    )

    expect(queryByTestId('action-buttons')).not.toBeInTheDocument()
  })

  it('should render the action buttons when defined', async () => {
    const mockedConsoleLog = vi
      .spyOn(console, 'log')
      .mockImplementation(() => {})

    const { getByText, getByTestId } = await act(async () =>
      render(
        <MockTokenProvider kind='integration' appSlug='orders' devMode>
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
        </MockTokenProvider>
      )
    )

    const actionContainer = getByTestId('action-buttons')
    expect(actionContainer).toBeInTheDocument()

    expect(actionContainer.children[0]).toHaveClass('md:basis-1/2 flex gap-3')
    expect(actionContainer.children[1]).toHaveClass(
      'md:basis-1/2 flex gap-3 justify-end'
    )

    const archiveButton = getByText('Archive')
    const approveButton = getByText('Approve')
    const cancelButton = getByText('Cancel')

    expect(archiveButton).toBeInTheDocument()
    expect(archiveButton.tagName).toEqual('BUTTON')
    await act(() => fireEvent.click(archiveButton))
    expect(mockedConsoleLog).not.toHaveBeenCalled()

    expect(approveButton).toBeInTheDocument()
    expect(approveButton.tagName).toEqual('BUTTON')
    await act(() => fireEvent.click(approveButton))
    expect(mockedConsoleLog).toHaveBeenCalledWith('approved!')

    expect(cancelButton).toBeInTheDocument()
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
        <MockTokenProvider kind='integration' appSlug='orders' devMode>
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
        </MockTokenProvider>
      )
    )

    const actionContainer = getByTestId('action-buttons')
    expect(actionContainer).toBeInTheDocument()

    expect(actionContainer.children[0]).not.toHaveClass(
      'md:basis-1/2 flex gap-3'
    )

    const approveButton = getByText('Approve')

    expect(approveButton).toBeInTheDocument()
    expect(approveButton.tagName).toEqual('BUTTON')
    await act(() => fireEvent.click(approveButton))
    expect(mockedConsoleLog).toHaveBeenCalledWith('approved!')
  })
})
