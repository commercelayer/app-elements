import { getReturnDisplayStatus } from '#dictionaries/returns'
import {
  getListItemDescription,
  getListItemIcon
} from '#ui/resources/ResourceListItem/common'
import type { Return } from '@commercelayer/sdk'
import { type ResourceToProps } from '../types'

export const returnToProps: ResourceToProps<Return> = ({ resource, user }) => {
  const displayStatus = getReturnDisplayStatus(resource)
  return {
    name: `${resource.order?.market?.name ?? ''} #${resource.number ?? ''}`,
    description: getListItemDescription({
      displayStatus,
      user,
      date: resource.updated_at
    }),
    icon: getListItemIcon(displayStatus)
  }
}
