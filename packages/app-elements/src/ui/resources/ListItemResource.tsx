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

interface ListItemDescriptionConfig {
  resource: ListItemEnabledResource
  date?: string
  additionalInfos?: JSX.Element
}

const getListItemDescription = ({
  resource,
  date = resource.updated_at,
  additionalInfos
}: ListItemDescriptionConfig): JSX.Element => {
  const displayStatus = getDisplayStatus(resource)
  const { user } = useTokenProvider()
  return (
    <>
      {formatDate({
        format: 'date',
        isoDate: date,
        timezone: user?.timezone
      })}
      {additionalInfos}
      {' · '}
      {displayStatus.task != null ? (
        <Text weight='semibold' size='small' variant='warning'>
          {displayStatus.task}
        </Text>
      ) : (
        displayStatus.label
      )}
    </>
  )
}

const getLisrItemIcon = (displayStatus: DisplayStatus): JSX.Element => (
  <Icon
    name={displayStatus.icon}
    background={displayStatus.color}
    gap='large'
  />
)

interface ListItemResourceComponentProps {
  name: string
  description: JSX.Element | string
  icon: JSX.Element
  rightContent?: JSX.Element
  showArrow?: boolean
}
type ListItemResourceConfig = Pick<Props, 'tag' | 'onClick'> &
  ListItemResourceComponentProps

const ListItemResourceComponent: React.FC<ListItemResourceConfig> = (props) => {
  const {
    name,
    description,
    icon,
    rightContent,
    showArrow = false,
    tag = 'div',
    onClick,
    ...rest
  } = props
  return (
    <ListItem
      tag={tag}
      icon={icon}
      alignItems='top'
      data-test-id='ListItemResource'
      onClick={onClick}
      {...rest}
    >
      <div>
        <Text
          tag='div'
          weight='semibold'
          data-test-id='ListItemResource-number'
        >
          {name}
        </Text>
        <Text
          tag='div'
          weight='medium'
          size='small'
          variant='info'
          data-test-id='ListItemResource-content'
        >
          {description}
        </Text>
      </div>
      <div>
        {rightContent != null && !showArrow ? (
          rightContent
        ) : (
          <Icon name='caretRight' />
        )}
      </div>
    </ListItem>
  )
}

function orderToProps(resource: Order): ListItemResourceComponentProps {
  const displayStatus = getDisplayStatus(resource)

  const billingAddress = resource.billing_address
  const descriptionAdditionalInfos = useMemo<JSX.Element>(
    () => (
      <>
        {!isEmpty(billingAddress?.company)
          ? billingAddress?.company ?? ''
          : formatDisplayName(
              billingAddress?.first_name ?? '',
              billingAddress?.last_name ?? ''
            )}
      </>
    ),
    [billingAddress]
  )

  return {
    name: `${resource.market?.name ?? ''} #${resource.number ?? ''}`,
    description: getListItemDescription({
      resource,
      date: resource.placed_at ?? resource.updated_at,
      additionalInfos: descriptionAdditionalInfos
    }),
    icon:
      resource.status === 'pending' ? (
        <RadialProgress icon={displayStatus.icon} />
      ) : (
        getLisrItemIcon(displayStatus)
      ),
    rightContent: (
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
    )
  }
}

function returnToProps(resource: Return): ListItemResourceComponentProps {
  const displayStatus = getDisplayStatus(resource)
  return {
    name: `${resource.order?.market?.name ?? ''} #${resource.number ?? ''}`,
    description: '',
    icon: getLisrItemIcon(displayStatus)
  }
}

export const ListItemResource = withSkeletonTemplate<Props>((props) => {
  const { resource, tag = 'div', isLoading, delayMs, onClick, ...rest } = props
  const listItemProps = useMemo(() => {
    switch (resource.type) {
      case 'orders':
        return orderToProps(resource)
      case 'returns':
        return returnToProps(resource)
    }
  }, [resource])
  return (
    <ListItemResourceComponent
      {...listItemProps}
      tag={tag}
      onClick={onClick}
      {...rest}
    />
  )
})
