import { type IconProps } from '#ui/atoms/Icon'
import type { StockTransfer } from '@commercelayer/sdk'
import type { DisplayStatus } from './types'

export interface StockTransferDisplayStatus extends DisplayStatus {
  label: string
  icon: IconProps['name']
  color: IconProps['background']
  task?: string
}

export function getStockTransferDisplayStatus(
  stockTransfer: StockTransfer
): StockTransferDisplayStatus {
  switch (stockTransfer.status) {
    case 'upcoming':
      return {
        label: 'Upcoming',
        icon: 'arrowUpRight',
        color: 'orange',
        task: 'Upcoming'
      }

    case 'on_hold':
      return {
        label: 'On hold',
        icon: 'hourglass',
        color: 'orange',
        task: 'On hold'
      }

    case 'picking':
      return {
        label: 'Picking',
        icon: 'arrowDown',
        color: 'orange',
        task: 'Picking'
      }

    case 'in_transit':
      return {
        label: 'In transit',
        icon: 'arrowsLeftRight',
        color: 'orange',
        task: 'In transit'
      }

    case 'completed':
      return {
        label: 'Completed',
        icon: 'check',
        color: 'green'
      }

    case 'cancelled':
      return {
        label: 'Cancelled',
        icon: 'x',
        color: 'gray'
      }

    default:
      return {
        label: `Not handled: (${stockTransfer.status})`,
        icon: 'warning',
        color: 'white'
      }
  }
}

export function getStockTransferStatusName(
  status: StockTransfer['status']
): string {
  const dictionary: Record<typeof status, string> = {
    draft: 'Draft',
    upcoming: 'Upcoming',
    on_hold: 'On hold',
    picking: 'Picking',
    in_transit: 'In transit',
    completed: 'Completed',
    cancelled: 'Cancelled'
  }

  return dictionary[status]
}
