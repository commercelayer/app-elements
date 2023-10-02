import { useCoreApi, useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { useTokenProvider } from '#providers/TokenProvider'
import { Avatar } from '#ui/atoms/Avatar'
import { Badge } from '#ui/atoms/Badge'
import { Button } from '#ui/atoms/Button'
import { Icon } from '#ui/atoms/Icon'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { InputSpinner } from '#ui/forms/InputSpinner'
import { FlexRow } from '#ui/internals/FlexRow'
import type {
  LineItem,
  ParcelLineItem,
  ReturnLineItem,
  StockLineItem
} from '@commercelayer/sdk'
import Trash from '@phosphor-icons/react/dist/icons/Trash'
import cn from 'classnames'
import { Fragment, useMemo, useState } from 'react'

interface LineItemSettings {
  showPrice: boolean
}

type Item = LineItem | ParcelLineItem | StockLineItem | ReturnLineItem

const Edit = withSkeletonTemplate<{
  item: Item
  onChange?: () => void
}>(({ item, onChange }) => {
  const { canUser } = useTokenProvider()
  const { sdkClient } = useCoreSdkProvider()
  const [disabled, setDisabled] = useState<boolean>(false)

  const canUpdate =
    item.type === 'line_items' && canUser('update', 'line_items')
  const canRemove =
    item.type === 'line_items' && canUser('destroy', 'line_items')

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
                .then(() => {
                  onChange?.()
                  setDisabled(false)
                })
            }}
          />
        )}
      </div>
      <div>
        {canRemove && (
          <Button
            aria-label='Delete'
            disabled={disabled}
            className='block'
            variant='link'
            onClick={() => {
              if (!disabled) {
                setDisabled(true)
                void sdkClient.line_items.delete(item.id).then(() => {
                  onChange?.()
                  setDisabled(false)
                })
              }
            }}
          >
            <Trash size={18} weight='bold' />
          </Button>
        )}
      </div>
    </FlexRow>
  )
})

interface ResourceLineItemsProps {
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
  footer?: React.ReactNode
  /**
   * Optional setting to define the visibility of line item Edit link.
   */
  editable?: boolean
  /**
   * Optional onChange function to define line item Edit callback.
   */
  onChange?: () => void
}

/**
 * This component renders a list of line items taking care of showing the right informations and structure depending of provided line item type.
 */
export const ResourceLineItems = withSkeletonTemplate<ResourceLineItemsProps>(
  ({ items, size = 'normal', footer, editable = false, onChange }) => {
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
    ): item is Extract<Item, LineItem> & { item_type: 'gift_cards' } {
      return (
        item.type === 'line_items' &&
        item.item_type === 'gift_cards' &&
        item.unit_amount_cents != null &&
        item.unit_amount_cents > 0
      )
    }

    return (
      <table className='w-full'>
        <tbody>
          {items
            .filter((lineItem) => {
              return lineItem.type !== 'line_items'
                ? true
                : lineItem.item_type === 'skus' ||
                    lineItem.item_type === 'bundles' ||
                    isGiftCard(lineItem)
            })
            .map((lineItem, index, arr) => {
              const isLastRow = index === arr.length - 1

              const code =
                lineItem.type === 'line_items'
                  ? lineItem.item_type === 'skus'
                    ? lineItem.sku_code
                    : lineItem.bundle_code
                  : lineItem.sku_code

              const name =
                lineItem.type === 'stock_line_items'
                  ? lineItem.sku?.name
                  : lineItem.name

              const imageUrl =
                lineItem.type === 'stock_line_items'
                  ? lineItem.sku?.image_url
                  : isGiftCard(lineItem)
                  ? 'gift_card'
                  : lineItem.image_url

              const hasLineItemOptions =
                lineItem.type === 'line_items' &&
                lineItem.line_item_options != null

              const hasReturnLineItemReason =
                lineItem.type === 'return_line_items' &&
                lineItem.return_reason != null

              const hasBundle =
                lineItem.type === 'line_items' &&
                lineItem.item_type === 'bundles' &&
                lineItem.bundle_code != null

              const isEditable = editable && lineItem.type === 'line_items'

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
                      {imageUrl != null && (
                        <Avatar
                          size={size}
                          src={imageUrl as `https://${string}`}
                          alt={name ?? ''}
                        />
                      )}
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
                            <Badge variant='secondary'>{`Unit price ${lineItem.formatted_unit_amount}`}</Badge>
                          </Spacer>
                        )}
                      {lineItem.type !== 'line_items' &&
                        lineItem.bundle_code != null && (
                          <Badge variant='secondary'>{`BUNDLE ${lineItem.bundle_code}`}</Badge>
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
                          hidden: isEditable
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
                              'font-bold': size === 'normal',
                              'text-sm font-bold': size === 'small'
                            })}
                          >
                            {lineItem.formatted_total_amount}
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
                      {isEditable && (
                        <Edit item={lineItem} onChange={onChange} />
                      )}
                    </td>
                  </tr>
                  <tr
                    className={cn('border-b border-gray-100', {
                      'border-dashed': !isLastRow
                    })}
                  >
                    <td
                      className={cn('w-full p-0', {
                        'pb-6': size === 'normal',
                        'pb-4': size === 'small'
                      })}
                      colSpan={settings.showPrice ? 4 : 3}
                    />
                  </tr>
                </Fragment>
              )
            })}

          {footer != null && (
            <tr className='border-b border-gray-100'>
              <td />
              <td
                className={cn('pl-4', {
                  'py-6': size === 'normal',
                  'py-4': size === 'small'
                })}
                colSpan={settings.showPrice ? 3 : 2}
              >
                <Text tag='div' size={size === 'normal' ? 'regular' : size}>
                  {footer}
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )
  }
)

ResourceLineItems.displayName = 'ResourceLineItems'

const LineItemOptionsWrapper = withSkeletonTemplate<{
  title?: string
  children: React.ReactNode
}>(({ title, children }) => (
  <Spacer top='4' className='pb-2 last:pb-0'>
    {title != null && (
      <Text tag='div' weight='bold' size='small' className='mb-1'>
        {title}
      </Text>
    )}
    {children}
  </Spacer>
))

const LineItemOptionsItem = withSkeletonTemplate<{ title: string }>(
  ({ title }) => (
    <div className='flex items-center gap-1 mb-1'>
      <Icon name='arrowBendDownRight' className='text-gray-500' />
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
        <LineItemOptionsWrapper key={item.id} title={item.name ?? undefined}>
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
  if (reason == null) {
    return null
  }

  return (
    <Spacer top='4'>
      <LineItemOptionsWrapper title='Reason'>
        {Object.entries(reason).map(([reasonName, reasonValue]) => (
          <LineItemOptionsItem key={reasonName} title={reasonValue} />
        ))}
      </LineItemOptionsWrapper>
    </Spacer>
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
