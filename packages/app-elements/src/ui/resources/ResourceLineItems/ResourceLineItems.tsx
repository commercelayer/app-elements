import { getStockTransferDisplayStatus } from '#dictionaries/stockTransfers'
import { navigateTo } from '#helpers/appsNavigation'
import { type CurrencyCode } from '#helpers/currencies'
import { formatDateWithPredicate } from '#helpers/date'
import { maskGiftCardCode } from '#helpers/giftCards'
import { useCoreApi, useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { useTranslation } from '#providers/I18NProvider'
import { useTokenProvider } from '#providers/TokenProvider'
import { Avatar } from '#ui/atoms/Avatar'
import { Badge } from '#ui/atoms/Badge'
import { Button } from '#ui/atoms/Button'
import { RemoveButton } from '#ui/atoms/RemoveButton'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { StatusIcon } from '#ui/atoms/StatusIcon'
import { Text } from '#ui/atoms/Text'
import { Tooltip } from '#ui/atoms/Tooltip'
import { formatCentsToCurrency } from '#ui/forms/InputCurrency'
import { InputSpinner } from '#ui/forms/InputSpinner'
import { FlexRow } from '#ui/internals/FlexRow'
import type {
  LineItem,
  ParcelLineItem,
  ReturnLineItem,
  StockTransfer
} from '@commercelayer/sdk'
import { Checks, Swap } from '@phosphor-icons/react'
import cn from 'classnames'
import isEmpty from 'lodash-es/isEmpty'
import {
  Fragment,
  useMemo,
  useState,
  type ComponentProps,
  type JSX
} from 'react'
import { z } from 'zod'
import { type StockLineItemWithStockTransfer } from './types'

interface LineItemSettings {
  showPrice: boolean
}

type Item =
  | LineItem
  | ParcelLineItem
  | StockLineItemWithStockTransfer
  | ReturnLineItem

const Edit = withSkeletonTemplate<{
  item: Item
  isLast: boolean
  onSwap?: (item: LineItem) => void
  onChange?: (item: LineItem | null) => void
}>(({ item, isLast, onChange, onSwap }) => {
  const { canUser } = useTokenProvider()
  const { sdkClient } = useCoreSdkProvider()
  const [disabled, setDisabled] = useState<boolean>(false)
  const { t } = useTranslation()

  const canUpdate =
    item.type === 'line_items' && canUser('update', 'line_items')
  const canRemove =
    canUpdate && item.type === 'line_items' && canUser('destroy', 'line_items')
  const canSwap =
    canRemove &&
    onSwap != null &&
    item.type === 'line_items' &&
    canUser('create', 'line_items')
  const removeDisabled = canSwap && isLast

  const removeButton = (
    <RemoveButton
      aria-label={t('common.remove')}
      disabled={disabled || removeDisabled}
      onClick={() => {
        if (!disabled) {
          setDisabled(true)
          void sdkClient.line_items.delete(item.id).then(() => {
            onChange?.(null)
            setDisabled(false)
          })
        }
      }}
    >
      {t('common.remove')}
    </RemoveButton>
  )

  return (
    <FlexRow className='pt-8' alignItems='center'>
      <div>
        {canUpdate && (
          <InputSpinner
            disabled={disabled}
            defaultValue={item.quantity}
            min={1}
            onChange={(value) => {
              setDisabled(true)
              void sdkClient.line_items
                .update({
                  id: item.id,
                  quantity: value
                })
                .then((newItem) => {
                  onChange?.(newItem)
                  setDisabled(false)
                })
            }}
          />
        )}
      </div>
      <div className='flex gap-4 flex-col md:flex-row'>
        {canSwap && (
          <Button
            variant='link'
            className={cn(['flex items-center'])}
            aria-label={t('common.swap')}
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                onSwap?.(item)
              }
            }}
          >
            <Swap size={18} weight='bold' />
            <span className='pl-1'>{t('common.swap')}</span>
          </Button>
        )}
        {canRemove && (
          <>
            {removeDisabled ? (
              <Tooltip
                label={removeButton}
                content="Can't remove the last item"
                direction='top-end'
              />
            ) : (
              removeButton
            )}
          </>
        )}
      </div>
    </FlexRow>
  )
})

interface Props {
  /**
   * Array of supported line items to be rendered.
   */
  items: Item[]
  /**
   * Optional size of rendered items structure. This setting is going to change font size, spacings, icon size in a proportional way.
   */
  size?: 'small' | 'normal'
  /**
   * Optional footer slot to add bottom elements / actions.
   */
  footer?: Array<{
    key: string
    element: React.ReactNode
    fullWidth?: boolean
  }>
  /**
   * Make the line items editable.
   */
  editable?: boolean
  /**
   * Get triggered when a line item changes.
   */
  onChange?: (item: LineItem | null) => void
  /**
   * When defined, it adds a `swap` icon and disables the `remove` action when there's only one editable item in the order.
   *
   * Get triggered when a line item swaps (a line item can be swapped when it is the only editable item in the order).
   */
  onSwap?: (item: LineItem) => void
}

export type ResourceLineItemsProps = ComponentProps<typeof ResourceLineItems>

/**
 * This component renders a list of line items taking care of showing the right informations and structure depending of provided line item type.
 */
export const ResourceLineItems = withSkeletonTemplate<Props>(
  ({ items, size = 'normal', footer, editable = false, onChange, onSwap }) => {
    const { user } = useTokenProvider()
    const { t } = useTranslation()

    const settings = useMemo<LineItemSettings>(() => {
      return items.reduce<LineItemSettings>(
        (acc, lineItem): LineItemSettings => {
          return {
            showPrice:
              acc.showPrice ||
              (lineItem.type === 'line_items' &&
                lineItem.formatted_total_amount != null)
          }
        },
        { showPrice: false } satisfies LineItemSettings
      )
    }, [items])

    function isGiftCard(
      item: Item
    ): item is Exclude<LineItem, 'item_type'> & { item_type: 'gift_cards' } {
      return (
        item.type === 'line_items' &&
        item.item_type === 'gift_cards' &&
        item.unit_amount_cents != null &&
        item.unit_amount_cents > 0
      )
    }

    function isEditable(item: Item): boolean {
      return editable && item.type === 'line_items'
    }

    const validLineItems = items.filter((lineItem) => {
      if (
        lineItem.type === 'parcel_line_items' ||
        lineItem.type === 'return_line_items' ||
        lineItem.type === 'stock_line_items'
      ) {
        return true
      }

      return (
        lineItem.item_type === 'skus' ||
        lineItem.item_type === 'bundles' ||
        isGiftCard(lineItem)
      )
    })

    const editableLineItems = validLineItems.filter((lineItem) =>
      isEditable(lineItem)
    )

    return (
      <table className='w-full'>
        <tbody>
          {validLineItems.map((lineItem, index, arr) => {
            const isLastRow = index === arr.length - 1

            const code =
              lineItem.type === 'line_items'
                ? isGiftCard(lineItem) && lineItem.gift_card?.code != null
                  ? maskGiftCardCode(lineItem.gift_card.code)
                  : lineItem.item_type === 'skus'
                    ? lineItem.sku_code
                    : lineItem.bundle_code
                : lineItem.sku_code

            const name = lineItem.name

            const imageUrl = isGiftCard(lineItem)
              ? 'gift_card'
              : lineItem.image_url

            const hasLineItemOptions =
              lineItem.type === 'line_items' &&
              lineItem.line_item_options != null

            const hasReturnLineItemReason =
              lineItem.type === 'return_line_items' &&
              lineItem.return_reason != null

            const hasStockTransfer =
              lineItem.type === 'stock_line_items' &&
              lineItem.stockTransfer != null

            const hasBundle =
              lineItem.type === 'line_items' &&
              lineItem.item_type === 'bundles' &&
              lineItem.bundle_code != null

            const hasTaxes =
              'tax_amount_cents' in lineItem &&
              lineItem.tax_amount_cents != null &&
              lineItem.tax_amount_cents > 0

            const hasPriceTooltip =
              lineItem.type === 'line_items' &&
              (!isEmpty(lineItem.discount_breakdown) || hasTaxes)

            return (
              <Fragment key={lineItem.id}>
                <tr className='h-0'>
                  <td
                    className={cn('w-0', {
                      'pt-6': size === 'normal',
                      'pt-4': size === 'small'
                    })}
                    valign='top'
                    align='center'
                    rowSpan={3}
                  >
                    <Avatar
                      size={size}
                      src={imageUrl as `https://${string}`}
                      alt={name ?? ''}
                    />
                  </td>
                  <td
                    className={cn('pl-4', {
                      'pt-6': size === 'normal',
                      'pt-4': size === 'small'
                    })}
                    colSpan={settings.showPrice ? 3 : 2}
                  >
                    <Text
                      tag='div'
                      variant='info'
                      className={cn({
                        'text-sm font-semibold': size === 'normal',
                        'text-xs font-medium': size === 'small'
                      })}
                    >
                      {code}
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td className='px-4 w-full' valign='top'>
                    <Text
                      tag='div'
                      className={cn({
                        'font-bold': size === 'normal',
                        'text-sm font-bold': size === 'small'
                      })}
                    >
                      {name}
                    </Text>
                    {lineItem.type === 'line_items' &&
                      lineItem.formatted_unit_amount != null && (
                        <Spacer top='2'>
                          <Badge variant='secondary'>{`${t('common.unit_price')} ${lineItem.formatted_unit_amount}`}</Badge>
                        </Spacer>
                      )}
                    {lineItem.type === 'return_line_items' &&
                      lineItem.restocked_at != null && (
                        <Spacer top='2'>
                          <Badge variant='secondary'>
                            <div className='flex items-center gap-1'>
                              <Checks size={16} className='text-gray-500' />{' '}
                              {formatDateWithPredicate({
                                predicate: t('common.restocked'),
                                isoDate: lineItem.restocked_at,
                                timezone: user?.timezone,
                                locale: user?.locale
                              })}
                            </div>
                          </Badge>
                        </Spacer>
                      )}
                    {lineItem.type !== 'line_items' &&
                      'bundle_code' in lineItem &&
                      lineItem.bundle_code != null && (
                        <Badge variant='secondary'>{`${t('resources.bundles.name').toUpperCase()} ${lineItem.bundle_code}`}</Badge>
                      )}
                  </td>
                  <td valign='top' align='right'>
                    <Text
                      tag='div'
                      variant='info'
                      wrap='nowrap'
                      className={cn({
                        'font-medium': size === 'normal',
                        'text-sm': size === 'small',
                        hidden: isEditable(lineItem)
                      })}
                    >
                      x {lineItem.quantity}
                    </Text>
                  </td>
                  {settings.showPrice && (
                    <td className='pl-2' valign='top' align='right'>
                      {lineItem.type === 'line_items' && (
                        <Text
                          tag='div'
                          wrap='nowrap'
                          className={cn({
                            'font-semibold': size === 'normal',
                            'text-sm font-bold': size === 'small'
                          })}
                        >
                          {hasPriceTooltip ? (
                            <LineItemPriceTooltip lineItem={lineItem} />
                          ) : (
                            lineItem.formatted_total_amount
                          )}
                        </Text>
                      )}
                    </td>
                  )}
                </tr>
                <tr>
                  <td
                    className='p-0 pl-4 w-full'
                    colSpan={settings.showPrice ? 3 : 2}
                  >
                    {hasLineItemOptions && (
                      <LineItemOptions
                        delayMs={0}
                        lineItemOptions={lineItem.line_item_options}
                      />
                    )}
                    {hasReturnLineItemReason && (
                      <ReturnLineItemReason
                        delayMs={0}
                        reason={lineItem.return_reason}
                      />
                    )}
                    {hasBundle && (
                      <Bundle delayMs={0} code={lineItem.bundle_code} />
                    )}
                    {hasStockTransfer && (
                      <StockLineItemStockTransfer
                        stockTransfer={lineItem.stockTransfer}
                      />
                    )}
                    {isEditable(lineItem) && (
                      <Edit
                        item={lineItem}
                        isLast={editableLineItems.length === 1}
                        onChange={onChange}
                        onSwap={onSwap}
                      />
                    )}
                  </td>
                </tr>
                <tr
                  className={cn('border-b border-gray-100', {
                    'border-dashed': !isLastRow,
                    '[.boxed-container_&]:border-b-0':
                      isLastRow && footer == null
                  })}
                >
                  <td
                    className={cn('w-full p-0', {
                      'pb-6': size === 'normal',
                      'pb-4': size === 'small',
                      '[.boxed-container_&]:pb-0': isLastRow && footer == null
                    })}
                    colSpan={settings.showPrice ? 4 : 3}
                  />
                </tr>
              </Fragment>
            )
          })}

          {footer != null &&
            footer.length > 0 &&
            footer.map(({ key: id, element, fullWidth = false }) => (
              <tr
                key={id}
                className='border-b [.boxed-container_&]:last-of-type:border-b-0 border-gray-100'
              >
                {!fullWidth && <td />}
                <td
                  className={cn('pl-4')}
                  colSpan={(settings.showPrice ? 3 : 2) + (fullWidth ? 1 : 0)}
                >
                  <Text tag='div' size={size === 'normal' ? 'regular' : size}>
                    <div className='mt-4 mb-4 [.boxed-container_tr:last-of-type_&]:last-of-type:mb-0'>
                      {element}
                    </div>
                  </Text>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    )
  }
)

ResourceLineItems.displayName = 'ResourceLineItems'

const LineItemOptionsWrapper = withSkeletonTemplate<{
  title?: string
  quantity?: number
  children: React.ReactNode
}>(({ title, quantity, children }) => (
  <Spacer top='4' className='pb-2 last:pb-0'>
    <div className='flex gap-1'>
      {title != null && (
        <Text tag='div' weight='bold' size='small' className='mb-1'>
          {title}
        </Text>
      )}
      {quantity != null && (
        <Text tag='div' size='small' weight='bold'>
          x {quantity}
        </Text>
      )}
    </div>
    {children}
  </Spacer>
))

const LineItemOptionsItem = withSkeletonTemplate<{ title: string }>(
  ({ title }) => (
    <div className='flex items-center gap-1 mb-1'>
      <StatusIcon name='arrowBendDownRight' className='text-gray-500' />
      <Text variant='info' tag='div' size='small' weight='medium'>
        {title}
      </Text>
    </div>
  )
)

const LineItemOptions = withSkeletonTemplate<{
  lineItemOptions: LineItem['line_item_options']
}>(({ lineItemOptions }) => {
  if (lineItemOptions == null || lineItemOptions.length === 0) {
    return null
  }

  return (
    <Spacer top='4'>
      {lineItemOptions.map((item) => (
        <LineItemOptionsWrapper
          key={item.id}
          title={item.name ?? undefined}
          quantity={item.quantity}
        >
          {Object.entries(item.options).map(([optionName, optionValue]) => (
            <LineItemOptionsItem
              key={optionName}
              title={`${optionName}: ${normalizeLineItemOptionValue(
                optionValue
              )}`}
            />
          ))}
        </LineItemOptionsWrapper>
      ))}
    </Spacer>
  )
})

const ReturnLineItemReason = withSkeletonTemplate<{
  reason: ReturnLineItem['return_reason']
}>(({ reason }) => {
  if (reason == null || Object.keys(reason).length === 0) {
    return null
  }

  return (
    <Spacer top='4'>
      <LineItemOptionsWrapper title='Reason'>
        {Object.entries(reason).map(([reasonName, reasonValue]) => (
          <LineItemOptionsItem
            key={reasonName}
            title={`${reasonName}: ${reasonValue}`}
          />
        ))}
      </LineItemOptionsWrapper>
    </Spacer>
  )
})

const StockLineItemStockTransfer = withSkeletonTemplate<{
  stockTransfer?: StockTransfer
}>(({ stockTransfer }) => {
  const {
    canAccess,
    settings: { mode }
  } = useTokenProvider()

  if (stockTransfer === undefined) return <></>

  const displayStatus = getStockTransferDisplayStatus(stockTransfer)
  const status =
    displayStatus.task != null ? (
      <Text weight='semibold' size='small' variant='warning'>
        {displayStatus.task}
      </Text>
    ) : (
      displayStatus.label
    )
  const originStockLocationName =
    stockTransfer.origin_stock_location?.name != null ? (
      <Text variant='info' size='small'>
        {' '}
        · From {stockTransfer.origin_stock_location.name}{' '}
      </Text>
    ) : undefined

  const navigateToStockTransfer = canAccess('stock_transfers')
    ? navigateTo({
        destination: {
          app: 'stock_transfers',
          resourceId: stockTransfer.id,
          mode
        }
      })
    : {}

  const stockTransferLabel = `See transfer #${stockTransfer.number}`
  const stockTransferClickableLabel = canAccess('stock_transfers') ? (
    <a {...navigateToStockTransfer}>
      <Text size='small'>{stockTransferLabel}</Text>
    </a>
  ) : (
    <Text size='small' variant='info'>
      {stockTransferLabel}
    </Text>
  )

  return (
    <>
      {status}
      {originStockLocationName}
      <Text size='small' variant='info'>
        {' · '}
      </Text>
      {stockTransferClickableLabel}
    </>
  )
})

const Bundle = withSkeletonTemplate<{ code: LineItem['bundle_code'] }>(
  ({ code }): JSX.Element | null => {
    const { data: bundles, isLoading } = useCoreApi(
      'bundles',
      'list',
      code == null
        ? null
        : [
            {
              filters: {
                code_in: code
              },
              include: ['sku_list.sku_list_items.sku']
            }
          ]
    )

    if (isLoading || bundles == null || bundles.length === 0) {
      return null
    }

    return (
      <ul className='ml-1 mt-2.5'>
        {bundles[0]?.sku_list?.sku_list_items?.map((item) => (
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

function normalizeLineItemOptionValue(value: any): string {
  try {
    return typeof value === 'string' ? value : JSON.stringify(value)
  } catch {
    return 'Could not render option value'
  }
}

const LineItemPriceTooltip = withSkeletonTemplate<{
  lineItem: LineItem
}>(({ lineItem }) => {
  const { t } = useTranslation()
  const discountBreakdown = useMemo(
    () => getDiscountBreakdown(lineItem),
    [lineItem.id]
  )

  return (
    <Tooltip
      label={
        <span className='underline-dotted'>
          {lineItem.formatted_total_amount}
        </span>
      }
      direction='bottom-end'
      minWidth
      content={
        <div className='grid justify-between grid-cols-2 gap-4 gap-y-2 w-auto'>
          {discountBreakdown?.map((discountItem) => (
            <Fragment key={discountItem.id}>
              <Text size='small' weight='semibold' className='text-left'>
                {discountItem.name}
              </Text>
              <Text size='small' weight='semibold' className='text-right'>
                {formatCentsToCurrency(
                  discountItem.cents,
                  lineItem.currency_code as CurrencyCode
                )}
              </Text>
            </Fragment>
          ))}

          {lineItem.tax_amount_cents != null &&
            lineItem.tax_amount_cents > 0 && (
              <>
                <Text size='small' weight='semibold' className='text-left'>
                  {t('common.taxes')}
                </Text>
                <Text size='small' weight='semibold' className='text-right'>
                  {lineItem.formatted_tax_amount}
                </Text>
              </>
            )}
        </div>
      }
    />
  )
})

const discountBreakdownType = z
  .array(
    z.object({
      id: z.string(),
      name: z.string(),
      coupon_code: z.string().optional(),
      cents: z.number(),
      weight: z.number().optional().default(0)
    })
  )
  .optional()

function getDiscountBreakdown(
  lineItem: LineItem
): z.infer<typeof discountBreakdownType> {
  const discountBreakdownAttribute =
    lineItem.type === 'line_items' && lineItem.discount_breakdown != null
      ? Object.entries(lineItem.discount_breakdown).map(([key, val]) => ({
          id: key,
          ...val
        }))
      : undefined

  return discountBreakdownType
    .safeParse(discountBreakdownAttribute)
    ?.data?.sort((a, b) => b.weight - a.weight)
}
