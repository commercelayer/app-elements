import { type TriggerAttribute } from '#helpers/resources'
import { type IconProps } from '#ui/atoms/Icon'
import type { Return, ReturnUpdate } from '@commercelayer/sdk'

type UITriggerAttributes = Extract<
  TriggerAttribute<ReturnUpdate>,
  | '_approve'
  | '_cancel'
  | '_ship'
  | '_reject'
  | '_receive'
  | '_restock'
  | '_archive'
  | '_unarchive'
>

export interface ReturnDisplayStatus {
  label: string
  icon: IconProps['name']
  color: IconProps['background']
  task?: string
  triggerAttributes: UITriggerAttributes[]
}

export function getReturnDisplayStatus(returnObj: Return): ReturnDisplayStatus {
  const archiveTriggerAttribute: Extract<
    UITriggerAttributes,
    '_archive' | '_unarchive'
  > = returnObj.archived_at == null ? '_archive' : '_unarchive'

  switch (returnObj.status) {
    case 'requested':
      return {
        label: 'Requested',
        icon: 'chatCircle',
        color: 'orange',
        task: 'Requested',
        triggerAttributes: ['_approve', '_cancel']
      }

    case 'approved':
      return {
        label: 'Approved',
        icon: 'check',
        color: 'orange',
        task: 'Approved',
        triggerAttributes: ['_ship']
      }

    case 'shipped':
      return {
        label: 'Shipped',
        icon: 'arrowUpRight',
        color: 'orange',
        task: 'Shipped',
        triggerAttributes: ['_receive', '_reject']
      }

    case 'received':
      return {
        label: 'Received',
        icon: 'check',
        color: 'green',
        triggerAttributes: []
      }

    case 'cancelled':
      return {
        label: 'Cancelled',
        icon: 'x',
        color: 'gray',
        triggerAttributes: [archiveTriggerAttribute]
      }

    case 'rejected':
      return {
        label: 'Rejected',
        icon: 'x',
        color: 'red',
        triggerAttributes: ['_cancel']
      }

    default:
      return {
        label: `Not handled: (${returnObj.status})`,
        icon: 'warning',
        color: 'white',
        triggerAttributes: []
      }
  }
}

export function getReturnStatusName(status: Return['status']): string {
  const dictionary: Record<typeof status, string> = {
    draft: 'Draft',
    requested: 'Requested',
    approved: 'Approved',
    shipped: 'Shipped',
    received: 'Received',
    cancelled: 'Cancelled',
    rejected: 'Rejected'
  }

  return dictionary[status]
}

export function getReturnTriggerAttributeName(
  triggerAttribute: UITriggerAttributes
): string {
  const dictionary: Record<typeof triggerAttribute, string> = {
    _approve: 'Approve',
    _reject: 'Reject',
    _cancel: 'Cancel',
    _ship: 'Ship',
    _receive: 'Receive',
    _restock: 'Restock',
    _archive: 'Archive',
    _unarchive: 'Unarchive'
  }

  return dictionary[triggerAttribute]
}
