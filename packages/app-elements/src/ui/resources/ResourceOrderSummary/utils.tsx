import { Text } from '#ui/atoms/Text'
import { FlexRow } from '#ui/internals/FlexRow'
import type { LineItem, Order } from '@commercelayer/sdk'
import cn from 'classnames'
import { Fragment } from 'react'

interface TotalRowProps {
  /** Displayed label */
  label: string
  /** Formatted amount */
  formattedAmount: string | undefined | null
  /** Set font-weight to bold */
  bold?: boolean

  /**
   * When `true` the row will be always  printed.
   * @default false
   */
  force?: boolean
}

export function renderTotalRow({
  label,
  value,
  bold = false
}: {
  label: string
  value: React.ReactNode
  bold?: boolean
}): JSX.Element {
  return (
    <FlexRow
      data-testid={`ResourceOrderSummary-${label}`}
      className={cn('my-4 first:mt-0 last:mb-0', {
        'font-bold': bold,
        'font-medium': !bold
      })}
    >
      <Text>{label}</Text>
      <Text data-testid={`ResourceOrderSummary-${label}-value`} wrap='nowrap'>
        {value}
      </Text>
    </FlexRow>
  )
}

export function renderTotalRowAmount({
  label,
  formattedAmount,
  force = false,
  bold = false
}: TotalRowProps): JSX.Element | null {
  if (formattedAmount == null) {
    formattedAmount = ''
  }

  const amountCents = parseInt(formattedAmount.replace(/[^0-9\-.,]+/g, ''))
  const showRow = force || (!isNaN(amountCents) && amountCents !== 0)

  return showRow
    ? renderTotalRow({ label, value: formattedAmount, bold })
    : null
}

export function renderDiscounts(order: Order): JSX.Element | null {
  type ItemType = NonNullable<Order['line_items']>[number]['item_type']
  type PromotionItemType = Extract<ItemType, `${string}_promotions`>

  const validDiscounts = Object.keys({
    external_promotions: undefined,
    fixed_amount_promotions: undefined,
    fixed_price_promotions: undefined,
    free_gift_promotions: undefined,
    free_shipping_promotions: undefined,
    percentage_discount_promotions: undefined
  } satisfies Record<PromotionItemType, undefined>) as ItemType[]

  const promotionLineItems =
    order.line_items?.filter((lineItem) =>
      validDiscounts.includes(lineItem.item_type)
    ) ?? []

  return (
    <>
      {promotionLineItems.map((promotionLineItem) => (
        <Fragment key={promotionLineItem.id}>
          {renderTotalRowAmount({
            label:
              promotionLineItem.name ??
              promotionLineItem.item_type ??
              'Discount',
            formattedAmount: promotionLineItem.formatted_total_amount
          })}
        </Fragment>
      ))}
    </>
  )
}

export const manualAdjustmentReferenceOrigin = 'app-orders--manual-adjustment'

export function getManualAdjustment(order: Order): LineItem | undefined {
  const [manualAdjustment] =
    order.line_items?.filter(
      (lineItem) =>
        lineItem.item_type === 'adjustments' &&
        lineItem.reference_origin === manualAdjustmentReferenceOrigin
    ) ?? []

  return manualAdjustment
}

export function renderAdjustments(order: Order): JSX.Element | null {
  const adjustmentLineItems =
    order.line_items?.filter(
      (lineItem) =>
        lineItem.item_type === 'adjustments' &&
        lineItem.reference_origin !== manualAdjustmentReferenceOrigin
    ) ?? []

  return (
    <>
      {adjustmentLineItems.map((adjustmentLineItem) => (
        <Fragment key={adjustmentLineItem.id}>
          {renderTotalRowAmount({
            label:
              adjustmentLineItem.name ??
              adjustmentLineItem.item_type ??
              'Discount',
            formattedAmount: adjustmentLineItem.formatted_total_amount
          })}
        </Fragment>
      ))}
    </>
  )
}
