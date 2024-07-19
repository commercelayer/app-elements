import { type StatusIconProps } from '#ui/atoms/StatusIcon'
import type { Return } from '@commercelayer/sdk'
import type { DisplayStatus } from './types'

export interface ReturnDisplayStatus extends DisplayStatus {
  label: string
  icon: StatusIconProps['name']
  color: StatusIconProps['background']
  task?: string
}

export function getReturnDisplayStatus(returnObj: Return): ReturnDisplayStatus {
  switch (returnObj.status) {
    case 'requested':
      return {
        label: 'Requested',
        icon: 'chatCircle',
        color: 'orange',
        task: 'Requested'
      }

    case 'approved':
      return {
        label: 'Approved',
        icon: 'check',
        color: 'orange',
        task: 'Approved'
      }

    case 'shipped':
      return {
        label: 'Shipped',
        icon: 'arrowUpRight',
        color: 'orange',
        task: 'Shipped'
      }

    case 'received':
      return {
        label: 'Received',
        icon: 'check',
        color: 'green'
      }

    case 'cancelled':
      return {
        label: 'Cancelled',
        icon: 'x',
        color: 'gray'
      }

    case 'rejected':
      return {
        label: 'Rejected',
        icon: 'x',
        color: 'red'
      }

    default:
      return {
        label: `Not handled: (${returnObj.status})`,
        icon: 'warning',
        color: 'white'
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
    rejected: 'Rejected',
    refunded: 'Refunded'
  }

  return dictionary[status]
}
