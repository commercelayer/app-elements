import { getReturnDisplayStatus } from '#dictionaries/returns'
import {
  ListItemDescription,
  ListItemIcon
} from '#ui/resources/ResourceListItem/common'
import type { Return } from '@commercelayer/sdk'
import { type ResourceToProps } from '../types'

export const returnToProps: ResourceToProps<Return> = ({ resource, user }) => {
  const displayStatus = getReturnDisplayStatus(resource)
  return {
    name: `${resource.order?.market?.name ?? ''} #${resource.number ?? ''}`,
    description: (
      <ListItemDescription
        displayStatus={displayStatus}
        date={resource.updated_at}
      />
    ),
    icon: <ListItemIcon icon={displayStatus.icon} color={displayStatus.color} />
  }
}
