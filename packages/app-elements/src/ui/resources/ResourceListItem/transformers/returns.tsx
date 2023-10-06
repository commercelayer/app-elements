import { getReturnDisplayStatus } from '#dictionaries/returns'
import {
  ListItemDescription,
  ListItemIcon
} from '#ui/resources/ResourceListItem/common'
import type { Return } from '@commercelayer/sdk'
import { type ResourceToProps } from '../types'

export const returnToProps: ResourceToProps<Return> = ({ resource, user }) => {
  const displayStatus = getReturnDisplayStatus(resource)
  const returnStockLocationName =
    resource.order?.market?.name != null
      ? `to ${resource.order.market.name} `
      : ''
  const returnNumber = resource.number != null ? `#${resource.number}` : ''

  return {
    name: `Return ${returnStockLocationName}${returnNumber}`,
    description: (
      <ListItemDescription
        displayStatus={displayStatus}
        date={resource.updated_at}
      />
    ),
    icon: <ListItemIcon icon={displayStatus.icon} color={displayStatus.color} />
  }
}
