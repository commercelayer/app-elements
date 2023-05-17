import { useCoreApi } from '#providers/CoreSdkProvider/useCoreApi'
import { Avatar } from '#ui/atoms/Avatar'
import { Badge } from '#ui/atoms/Badge'
import { Button, type ButtonVariant } from '#ui/atoms/Button'
import { Icon } from '#ui/atoms/Icon'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import type { LineItem, Order } from '@commercelayer/sdk'
import cn from 'classnames'
import { Fragment, useMemo, type MouseEventHandler } from 'react'

interface TotalRowProps {
  /** Displayed label */
  label: string
  /** Formatted amount */
  formattedAmount: string | undefined | null
  /** Whether the row is the first one (usually used to display the "**Subtotal** ") or the last one (usually used to display the "**Total** ") */
  position?: 'first' | 'last'

  /**
   * When `true` the row will be always  printed.
   * @default false
   */
  force?: boolean
}

interface FooterAction {
  label: string
  onClick: MouseEventHandler<HTMLButtonElement>
  variant?: ButtonVariant
  disabled?: boolean
}

const OrderSummary = withSkeletonTemplate<{
  order: Order
  footerActions?: FooterAction[]
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
                  <td className='py-6' valign='top' align='center' rowSpan={2}>
                    {lineItem.image_url != null && (
                      <Avatar
                        src={lineItem.image_url as `https://${string}`}
                        alt={lineItem.name ?? ''}
                      />
                    )}
                  </td>
                  <td className='pt-6 pl-4' colSpan={3}>
                    <Text
                      size='small'
                      weight='semibold'
                      variant='info'
                      tag='div'
                    >
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
                  <td className='px-4 pb-6' valign='top'>
                    <Text tag='div' weight='bold'>
                      {lineItem.name}
                    </Text>
                    <Spacer top='2' bottom='2'>
                      <Badge
                        label={`Unit price ${
                          lineItem.formatted_unit_amount ?? ''
                        }`}
                        variant='secondary'
                      />
                    </Spacer>
                    <LineItemOptions
                      lineItemOptions={lineItem.line_item_options}
                    />
                    {lineItem.item_type === 'bundles' &&
                      lineItem.bundle_code != null && (
                        <Bundle code={lineItem.bundle_code} />
                      )}
                  </td>
                  <td className='pr-2' valign='top' align='right'>
                    <Text
                      weight='medium'
                      variant='info'
                      tag='div'
                      wrap='nowrap'
                    >
                      x {lineItem.quantity}
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
      <FooterActions actions={footerActions} />
    </div>
  )
})

const FooterActions = withSkeletonTemplate<{
  actions: FooterAction[]
}>(({ actions }): JSX.Element | null => {
  const isPrimary = (action: FooterAction): boolean =>
    action.variant == null || action.variant === 'primary'

  const primaryActions = useMemo(
    () => actions.filter((action) => isPrimary(action)),
    [actions]
  )

  const secondaryActions = useMemo(
    () => actions.filter((action) => !isPrimary(action)),
    [actions]
  )

  if (actions.length === 0) {
    return null
  }

  return (
    <div
      data-test-id='order-summary-footer-actions'
      className='flex justify-end border-b border-gray-100 py-6'
    >
      {primaryActions.length === 1 && secondaryActions.length === 0 ? (
        <>
          {primaryActions.map(({ label, ...props }) => (
            <Button className='w-full' key={label} {...props}>
              {label}
            </Button>
          ))}
        </>
      ) : (
        <>
          <div className='basis-1/2 flex gap-3'>
            {secondaryActions.map(({ label, ...props }) => (
              <Button key={label} {...props}>
                {label}
              </Button>
            ))}
          </div>
          <div className='basis-1/2 flex gap-3 justify-end'>
            {primaryActions.map(({ label, ...props }) => (
              <Button key={label} {...props}>
                {label}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  )
})

function LineItemOptions({
  lineItemOptions
}: {
  lineItemOptions: LineItem['line_item_options']
}): JSX.Element | null {
  if (lineItemOptions == null || lineItemOptions.length === 0) {
    return null
  }

  return (
    <>
      {lineItemOptions.map((item) => (
        <Spacer key={item.id} top='4' className='pb-2 last:pb-0'>
          <Text tag='div' weight='bold' size='small' className='mb-1'>
            {item.name}
          </Text>
          {Object.entries(item.options).map(([optionName, optionValue]) => {
            return (
              <div key={optionName} className='flex items-center gap-1 mb-1'>
                <Icon name='arrowBendDownRight' className='text-gray-500' />
                <Text variant='info' tag='div' size='small' weight='medium'>
                  {optionName}: {normalizeLineItemOptionValue(optionValue)}
                </Text>
              </div>
            )
          })}
        </Spacer>
      ))}
    </>
  )
}

const Bundle = withSkeletonTemplate<{ code: string }>(
  ({ code }): JSX.Element | null => {
    const { data: bundles, isLoading } = useCoreApi('bundles', 'list', [
      {
        filters: {
          code_in: code
        },
        include: ['sku_list.sku_list_items.sku']
      }
    ])

    if (isLoading || bundles == null || bundles.length === 0) {
      return null
    }

    return (
      <ul className='mt-2.5'>
        {bundles[0].sku_list?.sku_list_items?.map((item) => (
          <li
            key={item.id}
            className='flex relative py-2 pl-4 before:absolute before:border-gray-100 before:left-0 before:h-4 before:w-4 before:top-[calc(50%-1rem)] before:border-b before:border-l before:rounded-bl-md after:absolute after:bg-gray-100 after:left-0 after:top-0 after:w-px after:h-full last:after:h-[calc(50%-1rem)]'
          >
            <Avatar
              src={item.sku?.image_url as `https://${string}`}
              size='x-small'
              alt={item.sku?.name ?? ''}
              className='ml-2'
            />
            <div className='flex flex-row gap-2 items-center ml-2'>
              <Text
                variant='info'
                size='small'
                weight='medium'
                className='whitespace-nowrap'
              >
                x {item.quantity}
              </Text>{' '}
              <Text size='small' weight='semibold' className='leading-4'>
                {item.sku?.name}
              </Text>
            </div>
          </li>
        ))}
      </ul>
    )
  }
)

function renderTotalRow({
  label,
  formattedAmount,
  force = false,
  position
}: TotalRowProps): JSX.Element | null {
  if (formattedAmount == null) {
    formattedAmount = ''
  }

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
        <Text weight={position === 'last' ? 'bold' : 'medium'}>{label}</Text>
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
          weight={position === 'last' ? 'bold' : 'medium'}
        >
          {formattedAmount}
        </Text>
      </td>
    </tr>
  ) : null
}

function normalizeLineItemOptionValue(value: any): string {
  try {
    return typeof value === 'string' ? value : JSON.stringify(value)
  } catch {
    return 'Could not render option value'
  }
}

OrderSummary.displayName = 'OrderSummary'
export { OrderSummary }
