import {
  getOrderDisplayStatus,
  getOrderPaymentStatusName
} from '#dictionaries/orders'
import { formatDate } from '#helpers/date'
import { formatDisplayName } from '#helpers/name'
import { Icon } from '#ui/atoms/Icon'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/lists/ListItem'
import type { Order } from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'

interface Props {
  order: Order
  tag?: 'a' | 'div'
  timezone?: string
}

export const ListItemOrder = withSkeletonTemplate<Props>(
  ({ order, tag = 'div', timezone, isLoading, delayMs, ...rest }) => {
    const displayStatus = getOrderDisplayStatus(order)
    const billingAddress = order.billing_address

    return (
      <ListItem
        tag={tag}
        icon={
          <Icon
            name={displayStatus.icon}
            background={displayStatus.color}
            gap='large'
          />
        }
        data-test-id='ListItemOrder'
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
              timezone
            })}
            {' · '}
            {!isEmpty(billingAddress?.company)
              ? billingAddress?.company
              : formatDisplayName(
                  billingAddress?.first_name ?? '',
                  billingAddress?.last_name ?? ''
                )}
            {' · '}
            {displayStatus.task != null ? (
              <Text weight='bold' size='small' variant='warning'>
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
