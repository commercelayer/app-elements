import { Avatar } from '#ui/atoms/Avatar'
import { Button, type ButtonVariant } from '#ui/atoms/Button'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Text } from '#ui/atoms/Text'
import type { Order } from '@commercelayer/sdk'
import cn from 'classnames'
import { Fragment, type MouseEventHandler } from 'react'

interface TotalRowProps {
  /** Displayed label */
  label: string
  /** Formatted amount */
  formattedAmount?: string
  /** Whether the row is the first one (usually used to display the "**Subtotal** ") or the last one (usually used to display the "**Total** ") */
  position?: 'first' | 'last'

  /**
   * When `true` the row will be always  printed.
   * @default false
   */
  force?: boolean
}

const renderTotalRow = ({
  label,
  formattedAmount = '',
  force = false,
  position
}: TotalRowProps): JSX.Element | null => {
  const amountCents = parseInt(formattedAmount.replace(/[^0-9\-.,]+/g, ''))
  const showRow = force || amountCents < 0 || amountCents > 0

  return showRow ? (
    <tr
      data-test-id={`OrderSummary-${label}`}
      className={cn({ 'border-b border-gray-100': position === 'last' })}
    >
      <td className='pt-4 pl-4' />
      <td
        className={cn(
          'pt-4 pl-4',
          { 'pt-6': position === 'first' },
          { 'pb-6': position === 'last' }
        )}
      >
        <Text weight={position === 'last' ? 'bold' : 'regular'}>{label}</Text>
      </td>
      <td
        className={cn(
          'pt-4 pl-4',
          { 'pt-6': position === 'first' },
          { 'pb-6': position === 'last' }
        )}
        colSpan={2}
        align='right'
      >
        <Text
          data-test-id={`OrderSummary-${label}-amount`}
          weight={position === 'last' ? 'bold' : 'regular'}
        >
          {formattedAmount}
        </Text>
      </td>
    </tr>
  ) : null
}

const OrderSummary = withSkeletonTemplate<{
  order: Order
  footerActions?: Array<{
    label: string
    onClick: MouseEventHandler<HTMLButtonElement>
    variant?: ButtonVariant
    disabled?: boolean
  }>
}>(({ order, footerActions = [] }) => {
  return (
    <div>
      <table className='w-full'>
        <tbody>
          {order.line_items?.map((lineItem, index, arr) => {
            if (
              lineItem.item_type != null &&
              !['skus', 'bundles'].includes(lineItem.item_type)
            ) {
              return null
            }

            const isLastRow = index === arr.length - 1

            return (
              <Fragment key={lineItem.sku_code}>
                <tr className='h-0'>
                  <td className='py-6' valign='top' rowSpan={2}>
                    <Avatar
                      src={lineItem.image_url ?? ''}
                      alt={lineItem.name ?? ''}
                    />
                  </td>
                  <td className='pt-6 pl-4' colSpan={3}>
                    <Text size='small' weight='medium' variant='info' tag='div'>
                      {lineItem.item_type === 'skus'
                        ? lineItem.sku_code
                        : lineItem.bundle_code}
                    </Text>
                  </td>
                </tr>
                <tr
                  className={cn('border-b border-gray-100', {
                    'border-dashed': !isLastRow
                  })}
                >
                  <td className='px-6 pb-6' valign='top'>
                    <Text tag='div' weight='bold'>
                      {lineItem.name}
                    </Text>
                  </td>
                  <td className='px-6' valign='top' align='right'>
                    <Text
                      weight='medium'
                      variant='info'
                      tag='div'
                      wrap='nowrap'
                    >
                      {lineItem.formatted_unit_amount} x {lineItem.quantity}
                    </Text>
                  </td>
                  <td valign='top' align='right'>
                    <Text weight='bold' tag='div'>
                      {lineItem.formatted_total_amount}
                    </Text>
                  </td>
                </tr>
              </Fragment>
            )
          })}
          {renderTotalRow({
            force: true,
            label: 'Subtotal',
            formattedAmount: order.formatted_subtotal_amount,
            position: 'first'
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
            formattedAmount: order.formatted_total_amount,
            position: 'last'
          })}
        </tbody>
      </table>
      {footerActions.length > 0 && (
        <div
          data-test-id='order-summary-footer-actions'
          className='flex gap-6 justify-end border-b border-gray-100 py-6'
        >
          {footerActions.map(({ label, ...props }) => (
            <Button key={label} {...props}>
              {label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
})

OrderSummary.displayName = 'OrderSummary'
export { OrderSummary }
