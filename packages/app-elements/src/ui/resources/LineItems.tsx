import { useCoreApi, useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { useTokenProvider } from '#providers/TokenProvider'
import { A } from '#ui/atoms/A'
import { Avatar } from '#ui/atoms/Avatar'
import { Badge } from '#ui/atoms/Badge'
import { Icon } from '#ui/atoms/Icon'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { InputSpinner } from '#ui/forms/InputSpinner'
import { FlexRow } from '#ui/internals/FlexRow'
import type {
  LineItem,
  ParcelLineItem,
  StockLineItem
} from '@commercelayer/sdk'
import Trash from '@phosphor-icons/react/dist/icons/Trash'
import cn from 'classnames'
import { Fragment, useMemo } from 'react'

interface LineItemSettings {
  showPrice: boolean
}

type Item = LineItem | ParcelLineItem | StockLineItem

const Edit = withSkeletonTemplate<{
  item: Item
  onChange?: () => void
}>(({ item, onChange }) => {
  const { canUser } = useTokenProvider()
  const { sdkClient } = useCoreSdkProvider()

  const canUpdate =
    item.type === 'line_items' && canUser('update', 'line_items')
  const canRemove =
    item.type === 'line_items' && canUser('destroy', 'line_items')

  console.log(item.id)

  return (
    <FlexRow className='pt-8' alignItems='center'>
      <div>
        {canUpdate && (
          <InputSpinner
            defaultValue={item.quantity}
            min={1}
            onChange={(value) => {
              void sdkClient.line_items
                .update({
                  id: item.id,
                  quantity: value
                })
                .then(() => {
                  onChange?.()
                })
            }}
          />
        )}
      </div>
      <div>
        {canRemove && (
          <A
            onClick={() => {
              void sdkClient.line_items.delete(item.id).then(() => {
                onChange?.()
              })
            }}
          >
            <Text weight='bold'>
              <Trash size={18} weight='bold' />
            </Text>
          </A>
        )}
      </div>
    </FlexRow>
  )
})

export const LineItems = withSkeletonTemplate<{
  items: Item[]
  size?: 'small' | 'normal'
  footer?: React.ReactNode
  editable?: boolean
  onChange?: () => void
}>(({ items, size = 'normal', footer, editable = false, onChange }) => {
  const settings = useMemo<LineItemSettings>(() => {
    const a = items.reduce<LineItemSettings>(
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
    return a
  }, [items])

  return (
    <table className='w-full'>
      <tbody>
        {items
          .filter((lineItem) => {
            return lineItem.type !== 'line_items'
              ? true
              : lineItem.item_type === 'skus' ||
                  lineItem.item_type === 'bundles'
          })
          .map((lineItem, index, arr) => {
            const isLastRow = index === arr.length - 1

            const code =
              (lineItem.type === 'line_items'
                ? lineItem.item_type === 'skus'
                  ? lineItem.sku_code
                  : lineItem.bundle_code
                : lineItem.sku_code) ?? ' '

            const name =
              lineItem.type === 'stock_line_items'
                ? lineItem.sku?.name
                : lineItem.name

            const imageUrl =
              lineItem.type === 'stock_line_items'
                ? lineItem.sku?.image_url
                : lineItem.image_url

            const hasLineItemOptions =
              lineItem.type === 'line_items' &&
              lineItem.line_item_options != null

            const hasBundle =
              lineItem.type === 'line_items' &&
              lineItem.item_type === 'bundles' &&
              lineItem.bundle_code != null

            const isEditable = editable && lineItem.type === 'line_items'

            return (
              <Fragment key={`${lineItem.type}-${code}`}>
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
                    className={cn('pl-4 h-full', {
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
                          <Badge
                            label={`Unit price ${lineItem.formatted_unit_amount}`}
                            variant='secondary'
                          />
                        </Spacer>
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
                        lineItemOptions={lineItem.line_item_options}
                      />
                    )}
                    {hasBundle && <Bundle code={lineItem.bundle_code} />}
                    {isEditable && <Edit item={lineItem} onChange={onChange} />}
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
})

LineItems.displayName = 'LineItems'

const LineItemOptions = ({
  lineItemOptions
}: {
  lineItemOptions: LineItem['line_item_options']
}): JSX.Element | null => {
  if (lineItemOptions == null || lineItemOptions.length === 0) {
    return null
  }

  return (
    <Spacer top='4'>
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
    </Spacer>
  )
}

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

function normalizeLineItemOptionValue(value: any): string {
  try {
    return typeof value === 'string' ? value : JSON.stringify(value)
  } catch {
    return 'Could not render option value'
  }
}
