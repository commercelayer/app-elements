import { useOverlay } from '#hooks/useOverlay'
import { useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { Button } from '#ui/atoms/Button'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import {
  ActionButtons,
  type ActionButtonsProps
} from '#ui/composite/ActionButtons'
import { PageLayout } from '#ui/composite/PageLayout'
import { HookedForm } from '#ui/forms/Form'
import { HookedInputCurrency } from '#ui/forms/InputCurrency'
import { type CurrencyCode } from '#ui/forms/InputCurrency/currencies'
import { FlexRow } from '#ui/internals/FlexRow'
import type { Order } from '@commercelayer/sdk'
import { zodResolver } from '@hookform/resolvers/zod'
import { Fragment, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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
  const { Overlay, open } = useAdjustTotalOverlay(order, onChange)

  return (
    <div>
      {editable && <Overlay />}
      <LineItems
        editable={editable}
        onChange={onChange}
        items={order.line_items ?? []}
        footer={
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
            {renderTotalRowAmount({
              label: 'Discount',
              formattedAmount: order.formatted_discount_amount
            })}
            {/* {renderDiscounts(order)} */}
            {editable
              ? renderTotalRow({
                  label: 'Adjustment',
                  value: (
                    <Button
                      variant='link'
                      onClick={() => {
                        open()
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
              formattedAmount: order.formatted_total_amount_with_taxes
            })}
          </>
        }
      />
      <ActionButtons actions={footerActions} />
    </div>
  )
})

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useAdjustTotalOverlay(order: Order, onChange?: () => void) {
  const currencyCode = order.currency_code as Uppercase<CurrencyCode>
  const { sdkClient } = useCoreSdkProvider()
  const { Overlay, open, close } = useOverlay()

  const validationSchema = useMemo(
    () =>
      z.object({
        adjustTotal: z
          .number({
            required_error: 'Please enter a negative or positive value.',
            invalid_type_error: 'Please enter a negative or positive value.'
          })
          .superRefine((val, ctx) => {
            if (val === 0) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Please enter a negative or positive value.'
              })
            }
          })
      }),
    []
  )
  const formMethods = useForm({
    defaultValues: {
      adjustTotal: 0
    },
    resolver: zodResolver(validationSchema)
  })
  const {
    formState: { isSubmitting }
  } = formMethods

  return {
    close,
    open,
    Overlay: () => (
      <Overlay>
        <HookedForm
          {...formMethods}
          onSubmit={async (values) => {
            await sdkClient.adjustments
              .create({
                currency_code: currencyCode,
                amount_cents: values.adjustTotal,
                name: 'Manual adjustment'
              })
              .then(async (adjustment) => {
                return await sdkClient.line_items.create({
                  order: sdkClient.orders.relationship(order.id),
                  quantity: 1,
                  item: adjustment
                })
              })
              .then(() => {
                onChange?.()
                formMethods.reset()
                close()
              })
          }}
        >
          <PageLayout
            title='Adjust total'
            onGoBack={() => {
              close()
            }}
          >
            <Spacer bottom='8'>
              <HookedInputCurrency
                isClearable
                allowNegativeValue
                disabled={isSubmitting}
                currencyCode={currencyCode}
                label='Amount'
                name='adjustTotal'
              />
            </Spacer>
            <Button type='submit' fullWidth disabled={isSubmitting}>
              Apply
            </Button>
          </PageLayout>
        </HookedForm>
      </Overlay>
    )
  }
}

function renderTotalRow({
  label,
  value
}: {
  label: string
  value: React.ReactNode
}): JSX.Element {
  return (
    <FlexRow
      data-testid={`OrderSummary-${label}`}
      className='my-4 first:mt-0 last:mb-0 font-medium last:font-bold'
    >
      <Text>{label}</Text>
      <Text data-testid={`OrderSummary-${label}-value`} wrap='nowrap'>
        {value}
      </Text>
    </FlexRow>
  )
}

function renderTotalRowAmount({
  label,
  formattedAmount,
  force = false
}: TotalRowProps): JSX.Element | null {
  if (formattedAmount == null) {
    formattedAmount = ''
  }

  const amountCents = parseInt(formattedAmount.replace(/[^0-9\-.,]+/g, ''))
  const showRow = force || (!isNaN(amountCents) && amountCents !== 0)

  return showRow ? renderTotalRow({ label, value: formattedAmount }) : null
}

// TODO: we wanna show all promotion line items. Before doing that we need to add the coupon_code and gift_card_code to the line_item
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function renderDiscounts(order: Order): JSX.Element | null {
  const validDiscounts: Array<
    NonNullable<Order['line_items']>[number]['item_type']
  > = [
    'external_promotions',
    'free_gift_promotions',
    'fixed_amount_promotions',
    'fixed_price_promotions',
    'free_shipping_promotions',
    'percentage_discount_promotions'
  ]

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

OrderSummary.displayName = 'OrderSummary'
