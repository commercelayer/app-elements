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
import { renderDiscounts, renderTotalRow, renderTotalRowAmount } from './utils'

export interface Props {
  editable?: boolean
  onChange?: () => void
  footerActions?: ActionButtonsProps['actions']
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
                            {order.adjustment_amount_cents != null &&
                            order.adjustment_amount_cents !== 0
                              ? order.formatted_adjustment_amount
                              : 'Adjust total'}
                          </Button>
                        )
                      })
                    : renderTotalRowAmount({
                        label: 'Adjustment',
                        formattedAmount: order.formatted_adjustment_amount
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