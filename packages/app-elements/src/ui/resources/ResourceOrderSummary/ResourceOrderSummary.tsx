import { useTokenProvider } from '#providers/TokenProvider'
import { Button } from '#ui/atoms/Button'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import {
  ActionButtons,
  type ActionButtonsProps
} from '#ui/composite/ActionButtons'
import {
  ResourceLineItems,
  type ResourceLineItemsProps
} from '#ui/resources/ResourceLineItems'
import type { Order } from '@commercelayer/sdk'
import { type ComponentProps } from 'react'
import { useAddCouponOverlay } from './AddCouponOverlay'
import { useAdjustTotalOverlay } from './AdjustTotalOverlay'
import { DeleteCouponButton } from './DeleteCouponButton'
import {
  getManualAdjustment,
  renderAdjustments,
  renderDiscounts,
  renderTotalRow,
  renderTotalRowAmount
} from './utils'

export interface Props {
  /** When `true` the order summary renders with editable components. You will be able to update line items quantity, delete a line item, add/remove coupon, and more. */
  editable?: boolean
  /** The event gets triggered every time a change occurs. (e.g. add/remove coupon, update/remove line items, etc.) */
  onChange?: () => void
  /** A list of `ActionButtons` components. */
  footerActions?: ActionButtonsProps['actions']
  /** The `Order` resource. */
  order: Order
}

export type ResourceOrderSummaryProps = ComponentProps<
  typeof ResourceOrderSummary
>

export const ResourceOrderSummary = withSkeletonTemplate<Props>(
  ({ order, onChange, footerActions = [], editable = false }) => {
    const { Overlay: AdjustTotalOverlay, open: openAdjustTotalOverlay } =
      useAdjustTotalOverlay(order, onChange)
    const { Overlay: AddCouponOverlay, open: openAddCouponOverlay } =
      useAddCouponOverlay(order, onChange)

    const { canUser } = useTokenProvider()

    const canEditOrder = editable && canUser('update', 'orders')

    const canEditManualAdjustment =
      canEditOrder &&
      canUser('update', 'adjustments') &&
      canUser('destroy', 'adjustments')

    const manualAdjustment = getManualAdjustment(order)

    const couponSummary: ResourceLineItemsProps['footer'] =
      order.coupon_code == null && !canEditOrder
        ? []
        : [
            {
              key: 'coupon',
              element: (
                <Spacer top='4' bottom='4'>
                  {renderTotalRow({
                    label: 'Coupon',
                    value:
                      order.coupon_code == null ? (
                        <Button
                          variant='link'
                          onClick={() => {
                            openAddCouponOverlay()
                          }}
                        >
                          Add coupon
                        </Button>
                      ) : (
                        <div className='flex gap-3'>
                          {order.coupon_code}
                          {canEditOrder && (
                            <DeleteCouponButton
                              order={order}
                              onChange={onChange}
                            />
                          )}
                        </div>
                      )
                  })}
                </Spacer>
              )
            }
          ]

    return (
      <div>
        {canEditOrder && (
          <>
            {canEditManualAdjustment && <AdjustTotalOverlay />}
            <AddCouponOverlay />
          </>
        )}
        <ResourceLineItems
          editable={canEditOrder}
          onChange={onChange}
          items={order.line_items ?? []}
          footer={[
            ...couponSummary,
            {
              key: 'summary',
              element: (
                <Spacer top='4' bottom='4'>
                  {renderTotalRowAmount({
                    force: true,
                    label: 'Subtotal',
                    amountCents: order.subtotal_amount_cents,
                    formattedAmount: order.formatted_subtotal_amount
                  })}
                  {renderTotalRowAmount({
                    force: true,
                    label: 'Shipping method',
                    amountCents: order.shipping_amount_cents,
                    formattedAmount:
                      order.shipping_amount_cents !== 0
                        ? order.formatted_shipping_amount
                        : 'free'
                  })}
                  {renderTotalRowAmount({
                    label: 'Payment method',
                    amountCents: order.payment_method_amount_cents,
                    formattedAmount: order.formatted_payment_method_amount
                  })}
                  {renderTotalRowAmount({
                    label: 'Taxes',
                    amountCents: order.total_tax_amount_cents,
                    formattedAmount: order.formatted_total_tax_amount
                  })}
                  {renderDiscounts(order)}
                  {renderAdjustments(order)}
                  {canEditManualAdjustment
                    ? renderTotalRow({
                        label: 'Adjustment',
                        value: (
                          <Button
                            variant='link'
                            onClick={() => {
                              openAdjustTotalOverlay()
                            }}
                          >
                            {manualAdjustment != null &&
                            manualAdjustment.total_amount_cents !== 0
                              ? manualAdjustment.formatted_total_amount
                              : 'Adjust total'}
                          </Button>
                        )
                      })
                    : manualAdjustment != null &&
                      renderTotalRowAmount({
                        label: 'Adjustment',
                        amountCents: manualAdjustment.total_amount_cents,
                        formattedAmount: manualAdjustment.formatted_total_amount
                      })}
                  {renderTotalRowAmount({
                    label: 'Gift card',
                    amountCents: order.gift_card_amount_cents,
                    formattedAmount: order.formatted_gift_card_amount
                  })}
                  {renderTotalRowAmount({
                    force: true,
                    label: 'Total',
                    amountCents: order.total_amount_with_taxes_cents,
                    formattedAmount: order.formatted_total_amount_with_taxes,
                    bold: true
                  })}
                </Spacer>
              )
            }
          ]}
        />
        {canUser('update', 'orders') && (
          <ActionButtons actions={footerActions} />
        )}
      </div>
    )
  }
)

ResourceOrderSummary.displayName = 'ResourceOrderSummary'
