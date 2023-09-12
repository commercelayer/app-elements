import {
  getOrderDisplayStatus,
  getOrderPaymentStatusName
} from '#dictionaries/orders'
import { formatDisplayName } from '#helpers/name'
import { RadialProgress } from '#ui/atoms/RadialProgress'
import { Text } from '#ui/atoms/Text'
import {
  getListItemDescription,
  getListItemIcon
} from '#ui/resources/ResourceListItem/common'
import type { Order } from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'
import { type ResourceToProps } from '../types'

export const orderToProps: ResourceToProps<Order> = ({ resource, user }) => {
  const displayStatus = getOrderDisplayStatus(resource)

  const billingAddress = resource.billing_address
  const descriptionAdditionalInfos = !isEmpty(billingAddress?.company)
    ? billingAddress?.company ?? ''
    : formatDisplayName(
        billingAddress?.first_name ?? '',
        billingAddress?.last_name ?? ''
      )

  return {
    name: `${resource.market?.name ?? ''} #${resource.number ?? ''}`,
    description: getListItemDescription({
      displayStatus,
      user,
      date: resource.placed_at ?? resource.updated_at,
      additionalInfos: descriptionAdditionalInfos
    }),
    icon:
      resource.status === 'pending' ? (
        <RadialProgress icon={displayStatus.icon} />
      ) : (
        getListItemIcon(displayStatus)
      ),
    rightContent: (
      <>
        <Text
          tag='div'
          weight='semibold'
          data-test-id='ResourceListItem-total'
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
          data-test-id='ResourceListItem-payment'
          wrap='nowrap'
        >
          {getOrderPaymentStatusName(resource.payment_status)}
        </Text>
      </>
    )
  }
}
