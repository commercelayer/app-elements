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
import { HookedInput } from '#ui/forms/Input'
import { HookedInputCurrency } from '#ui/forms/InputCurrency'
import { type CurrencyCode } from '#ui/forms/InputCurrency/currencies'
import { FlexRow } from '#ui/internals/FlexRow'
import type { Order } from '@commercelayer/sdk'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from '@phosphor-icons/react'
import cn from 'classnames'
import { Fragment, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  ResourceLineItems,
  type ResourceLineItemsProps
} from './ResourceLineItems'

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

export interface ResourceOrderSummaryProps {
  editable?: boolean
  onChange?: () => void
  footerActions?: ActionButtonsProps['actions']
  order: Order
}

const DeleteCouponButton = withSkeletonTemplate<
  Pick<ResourceOrderSummaryProps, 'onChange' | 'order'>
>(({ order, onChange }) => {
  const { sdkClient } = useCoreSdkProvider()
  const [isDeleting, setIsDeleting] = useState(false)
  return (
    <Button
      disabled={isDeleting}
      variant='link'
      className='block'
      onClick={() => {
        setIsDeleting(true)
        void sdkClient.orders
          .update({
            id: order.id,
            coupon_code: null
          })
          .finally(() => {
            setIsDeleting(false)
            onChange?.()
          })
      }}
    >
      <Trash size={18} weight='bold' />
    </Button>
  )
})

export const ResourceOrderSummary =
  withSkeletonTemplate<ResourceOrderSummaryProps>(
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
                          <DeleteCouponButton
                            order={order}
                            onChange={onChange}
                          />
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
                    {/* {renderTotalRowAmount({
                      label: 'Discount',
                      formattedAmount: order.formatted_discount_amount
                    })} */}
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useAddCouponOverlay(order: Order, onChange?: () => void) {
  const { sdkClient } = useCoreSdkProvider()
  const { Overlay, open, close } = useOverlay()

  const validationSchema = useMemo(
    () =>
      z.object({
        couponCode: z
          .string({
            required_error: 'Please enter a valid coupon code.',
            invalid_type_error: 'Please enter a valid coupon code.'
          })
          .min(1, { message: 'Please enter a valid coupon code.' })
      }),
    []
  )

  const formMethods = useForm({
    defaultValues: {
      couponCode: null
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
            await sdkClient.orders
              .update({
                id: order.id,
                coupon_code: values.couponCode
              })
              .then(() => {
                onChange?.()
                formMethods.reset()
                close()
              })
              .finally(() => {
                formMethods.reset()
              })
          }}
        >
          <PageLayout
            title='Add coupon'
            onGoBack={() => {
              close()
            }}
          >
            <Spacer bottom='8'>
              <HookedInput
                disabled={isSubmitting}
                label='Coupon code'
                name='couponCode'
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

function renderTotalRowAmount({
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

// TODO: we wanna show all promotion line items. Before doing that we need to add the coupon_code and gift_card_code to the line_item
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function renderDiscounts(order: Order): JSX.Element | null {
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

ResourceOrderSummary.displayName = 'ResourceOrderSummary'
