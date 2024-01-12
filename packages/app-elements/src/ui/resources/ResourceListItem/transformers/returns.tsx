import { getReturnDisplayStatus } from '#dictionaries/returns'
import { formatDate } from '#helpers/date'
import {
  ListItemDescription,
  ListItemIcon
} from '#ui/resources/ResourceListItem/common'
import type { Return } from '@commercelayer/sdk'
import { type ResourceToProps } from '../types'

export const returnToProps: ResourceToProps<Return> = ({ resource, user }) => {
  const displayStatus = getReturnDisplayStatus(resource)
  const returnStockLocationName =
    resource.stock_location?.name != null
      ? `To ${resource.stock_location.name} `
      : ''
  const number = resource.number != null ? `#${resource.number}` : ''

  return {
    name: `Return ${number}`,
    description: (
      <ListItemDescription
        displayStatus={displayStatus}
        date={formatDate({
          format: 'date',
          isoDate: resource.updated_at,
          timezone: user?.timezone
        })}
        additionalInfos={returnStockLocationName}
      />
    ),
    icon: <ListItemIcon icon={displayStatus.icon} color={displayStatus.color} />
  }
}
