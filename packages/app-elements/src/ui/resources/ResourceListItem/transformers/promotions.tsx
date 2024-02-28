import { getPromotionDisplayStatus } from '#dictionaries/promotions'
import { formatDateRange } from '#helpers/date'
import { Badge } from '#ui/atoms/Badge'
import { RadialProgress } from '#ui/atoms/RadialProgress'
import {
  ListItemDescription,
  ListItemIcon
} from '#ui/resources/ResourceListItem/common'
import type { Promotion } from '@commercelayer/sdk'
import { type ResourceToProps } from '../types'

export const referenceOrigins = {
  appPromotions: 'app-promotions'
} as const

export const promotionToProps: ResourceToProps<Omit<Promotion, 'type'>> = ({
  resource,
  user
}) => {
  const displayStatus = getPromotionDisplayStatus(resource)
  const hasCoupons = (resource.coupons ?? []).length > 0
  const createdFromApi =
    resource.reference_origin !== referenceOrigins.appPromotions

  return {
    name: (
      <>
        {resource.name}{' '}
        {createdFromApi && (
          <Badge className='ml-1' variant='warning'>
            API
          </Badge>
        )}
        {hasCoupons && (
          <Badge className='ml-1' variant='teal'>
            coupons
          </Badge>
        )}
      </>
    ),
    description: (
      <ListItemDescription
        displayStatus={displayStatus}
        date={formatDateRange({
          rangeFrom: resource.starts_at,
          rangeTo: resource.expires_at,
          timezone: user?.timezone
        })}
      />
    ),
    icon:
      displayStatus.status === 'upcoming' ? (
        <RadialProgress icon='calendarBlank' />
      ) : (
        <ListItemIcon icon={displayStatus.icon} color={displayStatus.color} />
      )
  }
}
