import { Button } from '#ui/atoms/Button'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
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

    const manualAdjustment = getManualAdjustment(order)

    const couponSummary: ResourceLineItemsProps['footer'] =
      order.coupon_code == null && !editable
        ? []
        : [
            {
              key: 'coupon',
              element: renderTotalRow({
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
                      {editable && (
                        <DeleteCouponButton order={order} onChange={onChange} />
                      )}
                    </div>
                  )
              })
            }
          ]

    return (
      <div>
        {editable && (
          <>
            <AdjustTotalOverlay />
            <AddCouponOverlay />
          </>
        )}
        <ResourceLineItems
          editable={editable}
          onChange={onChange}
          items={order.line_items ?? []}
          footer={[
            ...couponSummary,
            {
              key: 'summary',
              element: (
                <>
                  {renderTotalRowAmount({
                    force: true,
                    label: 'Subtotal',
                    formattedAmount: order.formatted_subtotal_amount
                  })}
                  {renderTotalRowAmount({
                    force: true,
                    label: 'Shipping method',
                    formattedAmount:
                      order.shipping_amount_cents !== 0
                        ? order.formatted_shipping_amount
                        : 'free'
                  })}
                  {renderTotalRowAmount({
                    label: 'Payment method',
                    formattedAmount: order.formatted_payment_method_amount
                  })}
                  {renderTotalRowAmount({
                    label: 'Taxes',
                    formattedAmount: order.formatted_total_tax_amount
                  })}
                  {renderDiscounts(order)}
                  {renderAdjustments(order)}
                  {editable
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
                        formattedAmount: manualAdjustment.formatted_total_amount
                      })}
                  {renderTotalRowAmount({
                    label: 'Gift card',
                    formattedAmount: order.formatted_gift_card_amount
                  })}
                  {renderTotalRowAmount({
                    force: true,
                    label: 'Total',
                    formattedAmount: order.formatted_total_amount_with_taxes,
                    bold: true
                  })}
                </>
              )
            }
          ]}
        />
        <ActionButtons actions={footerActions} />
      </div>
    )
  }
)

ResourceOrderSummary.displayName = 'ResourceOrderSummary'
