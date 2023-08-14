import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Text } from '#ui/atoms/Text'
import {
  ActionButtons,
  type ActionButtonsProps
} from '#ui/composite/ActionButtons'
import { FlexRow } from '#ui/internals/FlexRow'
import type { Order } from '@commercelayer/sdk'
import { LineItems } from './LineItems'

interface TotalRowProps {
  /** Displayed label */
  label: string
  /** Formatted amount */
  formattedAmount: string | undefined | null

  /**
   * When `true` the row will be always  printed.
   * @default false
   */
  force?: boolean
}

export const OrderSummary = withSkeletonTemplate<{
  editable?: boolean
  onChange?: () => void
  footerActions?: ActionButtonsProps['actions']
  order: Order
}>(({ order, onChange, footerActions = [], editable = false }) => {
  return (
    <div>
      <LineItems
        editable={editable}
        onChange={onChange}
        items={order.line_items ?? []}
        footer={
          <>
            {renderTotalRow({
              force: true,
              label: 'Subtotal',
              formattedAmount: order.formatted_subtotal_amount
            })}
            {renderTotalRow({
              label: 'Discount',
              formattedAmount: order.formatted_discount_amount
            })}
            {renderTotalRow({
              label: 'Adjustments',
              formattedAmount: order.formatted_adjustment_amount
            })}
            {renderTotalRow({
              force: true,
              label: 'Shipping method',
              formattedAmount:
                order.shipping_amount_cents !== 0
                  ? order.formatted_shipping_amount
                  : 'free'
            })}
            {renderTotalRow({
              label: 'Payment method',
              formattedAmount: order.formatted_payment_method_amount
            })}
            {renderTotalRow({
              label: 'Taxes',
              formattedAmount: order.formatted_total_tax_amount
            })}
            {renderTotalRow({
              label: 'Gift card',
              formattedAmount: order.formatted_gift_card_amount
            })}
            {renderTotalRow({
              force: true,
              label: 'Total',
              formattedAmount: order.formatted_total_amount
            })}
          </>
        }
      />
      <ActionButtons actions={footerActions} />
    </div>
  )
})

function renderTotalRow({
  label,
  formattedAmount,
  force = false
}: TotalRowProps): JSX.Element | null {
  if (formattedAmount == null) {
    formattedAmount = ''
  }

  const amountCents = parseInt(formattedAmount.replace(/[^0-9\-.,]+/g, ''))
  const showRow = force || amountCents < 0 || amountCents > 0

  return showRow ? (
    <FlexRow
      data-test-id={`OrderSummary-${label}`}
      className='my-4 first:mt-0 last:mb-0 font-medium last:font-bold'
    >
      <Text>{label}</Text>
      <Text data-test-id={`OrderSummary-${label}-amount`}>
        {formattedAmount}
      </Text>
    </FlexRow>
  ) : null
}

OrderSummary.displayName = 'OrderSummary'
