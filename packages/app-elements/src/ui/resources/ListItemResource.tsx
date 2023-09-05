import {
  getOrderDisplayStatus,
  getOrderPaymentStatusName,
  type OrderDisplayStatus
} from '#dictionaries/orders'
import {
  getReturnDisplayStatus,
  type ReturnDisplayStatus
} from '#dictionaries/returns'
import { formatDate } from '#helpers/date'
import { formatDisplayName } from '#helpers/name'
import { useTokenProvider } from '#providers/TokenProvider'
import { Icon } from '#ui/atoms/Icon'
import { RadialProgress } from '#ui/atoms/RadialProgress'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/lists/ListItem'
import type { Order, Return } from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'
import { useMemo } from 'react'

type ListItemEnabledResource = Order | Return

interface Props {
  resource: ListItemEnabledResource
  tag?: 'a' | 'div'
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement, MouseEvent>
  ) => void
}

type DisplayStatus = OrderDisplayStatus | ReturnDisplayStatus

const getDisplayStatus = (resource: ListItemEnabledResource): DisplayStatus => {
  switch (resource.type) {
    case 'orders':
      return getOrderDisplayStatus(resource)
    case 'returns':
      return getReturnDisplayStatus(resource)
  }
}

const ListItemIcon = (resource: ListItemEnabledResource): JSX.Element => {
  const displayStatus = getDisplayStatus(resource)
  return resource.type === 'orders' && resource.status === 'pending' ? (
    <RadialProgress icon={displayStatus.icon} />
  ) : (
    <Icon
      name={displayStatus.icon}
      background={displayStatus.color}
      gap='large'
    />
  )
}

const ListItemName = (resource: ListItemEnabledResource): JSX.Element => {
  return (
    <Text tag='div' weight='semibold' data-test-id='ListItemResource-number'>
      {resource.type === 'orders'
        ? `${resource.market?.name ?? ''} #${resource.number ?? ''}`
        : resource.type === 'returns'
        ? `${resource.order?.market?.name ?? ''} #${resource.number ?? ''}`
        : ''}
    </Text>
  )
}

const ListItemDescription = (
  resource: ListItemEnabledResource
): JSX.Element => {
  const displayStatus = getDisplayStatus(resource)
  const { user } = useTokenProvider()
  const descriptionDate =
    resource.type === 'orders'
      ? resource.placed_at ?? resource.updated_at
      : resource.updated_at
  let additionalInfos = ''
  if (resource.type === 'orders') {
    const billingAddress = resource.billing_address
    additionalInfos = useMemo<string>(
      () =>
        !isEmpty(billingAddress?.company)
          ? billingAddress?.company ?? ''
          : formatDisplayName(
              billingAddress?.first_name ?? '',
              billingAddress?.last_name ?? ''
            ),
      [billingAddress]
    )
  }

  return (
    <Text
      tag='div'
      weight='medium'
      size='small'
      variant='info'
      data-test-id='ListItemResource-content'
    >
      {formatDate({
        format: 'date',
        isoDate: descriptionDate,
        timezone: user?.timezone
      })}
      {!isEmpty(additionalInfos) ? ` · ${additionalInfos}` : ''}
      {' · '}
      {displayStatus.task != null ? (
        <Text weight='semibold' size='small' variant='warning'>
          {displayStatus.task}
        </Text>
      ) : (
        displayStatus.label
      )}
    </Text>
  )
}

const ListItemRightContent = (
  resource: ListItemEnabledResource
): JSX.Element => {
  return resource.type === 'orders' ? (
    <>
      <Text
        tag='div'
        weight='semibold'
        data-test-id='ListItemOrder-total'
        className='break-keep'
        wrap='nowrap'
      >
        {resource.formatted_total_amount}
      </Text>
      <Text
        tag='div'
        weight='medium'
        size='small'
        variant='info'
        data-test-id='ListItemOrder-payment'
        wrap='nowrap'
      >
        {getOrderPaymentStatusName(resource.payment_status)}
      </Text>
    </>
  ) : (
    <></>
  )
}

export const ListItemResource = withSkeletonTemplate<Props>(
  ({ resource, tag = 'div', isLoading, delayMs, onClick, ...rest }) => {
    return (
      <ListItem
        tag={tag}
        icon={ListItemIcon(resource)}
        alignItems='top'
        data-test-id='ListItemResource'
        onClick={onClick}
        {...rest}
      >
        <div>
          {ListItemName(resource)}
          {ListItemDescription(resource)}
        </div>
        <div>
          {tag === 'a' ? (
            <Icon name='caretRight' />
          ) : (
            ListItemRightContent(resource)
          )}
        </div>
      </ListItem>
    )
  }
)
