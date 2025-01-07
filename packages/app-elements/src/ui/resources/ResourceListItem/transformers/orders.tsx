import {
  getOrderDisplayStatus,
  getOrderPaymentStatusName
} from '#dictionaries/orders'
import { formatDate } from '#helpers/date'
import { formatDisplayName } from '#helpers/name'
import { type I18NLocale } from '#providers/I18NProvider'
import { RadialProgress } from '#ui/atoms/RadialProgress'
import { Text } from '#ui/atoms/Text'
import {
  ListItemDescription,
  ListItemIcon
} from '#ui/resources/ResourceListItem/common'
import type { Order } from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'
import { type ResourceToProps } from '../types'

export const orderToProps: ResourceToProps<Order> = ({ resource, user }) => {
  const displayStatus = getOrderDisplayStatus(resource)
  const locale = (user?.locale.split('-')[0] as I18NLocale) ?? 'en'

  const billingAddress = resource.billing_address
  const descriptionAdditionalInfos = !isEmpty(billingAddress?.company)
    ? (billingAddress?.company ?? '')
    : formatDisplayName(
        billingAddress?.first_name ?? '',
        billingAddress?.last_name ?? ''
      )

  return {
    name: `${resource.market?.name ?? ''} #${resource.number ?? ''}`,
    description: (
      <ListItemDescription
        displayStatus={displayStatus}
        date={formatDate({
          format: 'full',
          isoDate: resource.placed_at ?? resource.updated_at,
          timezone: user?.timezone,
          locale
        })}
        additionalInfos={descriptionAdditionalInfos}
      />
    ),
    icon:
      resource.status === 'pending' ? (
        <RadialProgress icon={displayStatus.icon} />
      ) : (
        <ListItemIcon icon={displayStatus.icon} color={displayStatus.color} />
      ),
    showRightContent: true,
    rightContent: (
      <>
        <Text
          tag='div'
          weight='semibold'
          data-testid='ResourceListItem-total'
          className='break-keep'
          wrap='nowrap'
        >
          {resource.formatted_total_amount_with_taxes}
        </Text>
        <Text
          tag='div'
          weight='medium'
          size='small'
          variant='info'
          data-testid='ResourceListItem-payment'
          wrap='nowrap'
        >
          {getOrderPaymentStatusName(resource.payment_status)}
        </Text>
      </>
    )
  }
}
