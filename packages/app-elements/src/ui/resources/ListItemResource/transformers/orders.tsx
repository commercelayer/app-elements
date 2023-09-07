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
} from '#ui/resources/ListItemResource/common'
import type { Order } from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'
import { useMemo } from 'react'
import type { ListItemResourceComponentProps } from '../ListItemResource'

export const orderToProps = (
  resource: Order
): ListItemResourceComponentProps => {
  const displayStatus = getOrderDisplayStatus(resource)

  const billingAddress = resource.billing_address
  const descriptionAdditionalInfos = useMemo<string>(
    () =>
      !isEmpty(billingAddress?.company)
        ? billingAddress?.company ?? ''
        : formatDisplayName(
            billingAddress?.first_name ?? '',
            billingAddress?.last_name ?? ''
          ),
    [billingAddress]
  )

  return {
    name: `${resource.market?.name ?? ''} #${resource.number ?? ''}`,
    description: getListItemDescription({
      resource,
      displayStatus,
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
