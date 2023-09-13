import type { Customer } from '@commercelayer/sdk'
import type { DisplayStatus } from './types'

export interface CustomerDisplayStatus extends DisplayStatus {}

export function getCustomerDisplayStatus(
  customerObj: Customer
): CustomerDisplayStatus {
  switch (customerObj.status) {
    case 'prospect':
      return {
        label: 'Prospect',
        icon: 'chatCircle',
        color: 'orange',
        task: 'Prospect'
      }

    case 'acquired':
      return {
        label: 'Acquired',
        icon: 'check',
        color: 'orange',
        task: 'Acquired'
      }

    case 'repeat':
      return {
        label: 'Repeat',
        icon: 'arrowUpRight',
        color: 'orange',
        task: 'Repeat'
      }
  }
}

export function getCustomerStatusName(status: Customer['status']): string {
  const dictionary: Record<typeof status, string> = {
    prospect: 'Prospect',
    acquired: 'Acquired',
    repeat: 'Repeat'
  }

  return dictionary[status]
}
