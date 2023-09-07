import { getReturnDisplayStatus } from '#dictionaries/returns'
import {
  getListItemDescription,
  getListItemIcon
} from '#ui/resources/ListItemResource/common'
import type { Return } from '@commercelayer/sdk'
import type { ListItemResourceComponentProps } from '../ListItemResource'

export const returnToProps = (
  resource: Return
): ListItemResourceComponentProps => {
  const displayStatus = getReturnDisplayStatus(resource)
  return {
    name: `${resource.order?.market?.name ?? ''} #${resource.number ?? ''}`,
    description: getListItemDescription({
      resource,
      displayStatus
    }),
    icon: getListItemIcon(displayStatus)
  }
}
