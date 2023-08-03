import {
  getOrderDisplayStatus,
  getOrderPaymentStatusName
} from '#dictionaries/orders'
import { formatDate } from '#helpers/date'
import { formatDisplayName } from '#helpers/name'
import { useTokenProvider } from '#providers/TokenProvider'
import { Icon } from '#ui/atoms/Icon'
import { RadialProgress } from '#ui/atoms/RadialProgress'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/lists/ListItem'
import type { Order } from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'
import { useMemo } from 'react'

interface Props {
  order: Order
  tag?: 'a' | 'div'
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement, MouseEvent>
  ) => void
}

export const ListItemOrder = withSkeletonTemplate<Props>(
  ({ order, tag = 'div', isLoading, delayMs, onClick, ...rest }) => {
    const { user } = useTokenProvider()
    const displayStatus = getOrderDisplayStatus(order)
    const billingAddress = order.billing_address

    const name = useMemo<string>(
      () =>
        !isEmpty(billingAddress?.company)
          ? billingAddress?.company ?? ''
          : formatDisplayName(
              billingAddress?.first_name ?? '',
              billingAddress?.last_name ?? ''
            ),
      [billingAddress]
    )

    return (
      <ListItem
        tag={tag}
        icon={
          order.status === 'pending' ? (
            <RadialProgress icon={displayStatus.icon} />
          ) : (
            <Icon
              name={displayStatus.icon}
              background={displayStatus.color}
              gap='large'
            />
          )
        }
        data-test-id='ListItemOrder'
        onClick={onClick}
        {...rest}
      >
        <div>
          <Text tag='div' weight='semibold' data-test-id='ListItemOrder-number'>
            {order.market?.name} #{order.number}
          </Text>
          <Text
            tag='div'
            weight='medium'
            size='small'
            variant='info'
            data-test-id='ListItemOrder-content'
          >
            {formatDate({
              format: 'date',
              isoDate: order.updated_at,
              timezone: user?.timezone
            })}
            {!isEmpty(name) ? ` · ${name}` : ''}
            {' · '}
            {displayStatus.task != null ? (
              <Text weight='semibold' size='small' variant='warning'>
                {displayStatus.task}
              </Text>
            ) : (
              displayStatus.label
            )}
          </Text>
        </div>
        <div>
          <Text tag='div' weight='semibold' data-test-id='ListItemOrder-total'>
            {order.formatted_total_amount}
          </Text>
          <Text
            tag='div'
            weight='medium'
            size='small'
            variant='info'
            data-test-id='ListItemOrder-payment'
          >
            {getOrderPaymentStatusName(order.payment_status)}
          </Text>
        </div>
      </ListItem>
    )
  }
)
