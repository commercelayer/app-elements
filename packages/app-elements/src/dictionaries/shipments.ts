import { type StatusIconProps } from '#ui/atoms/StatusIcon'
import type { Shipment } from '@commercelayer/sdk'
import type { DisplayStatus } from './types'

export interface ShipmentDisplayStatus extends DisplayStatus {
  label: string
  icon: StatusIconProps['name']
  color: StatusIconProps['background']
  task?: string
}

export function getShipmentDisplayStatus(
  shipment: Shipment,
  awaitingStockTransfer: boolean = false
): ShipmentDisplayStatus {
  const shipmentStatus = awaitingStockTransfer
    ? 'awaiting_stock_transfer'
    : shipment.status

  switch (shipmentStatus) {
    case 'upcoming':
      return {
        label: 'Upcoming',
        icon: 'truck',
        color: 'gray'
      }

    case 'cancelled':
      return {
        label: 'Cancelled',
        icon: 'x',
        color: 'gray'
      }

    case 'draft':
      return {
        label: 'Draft',
        icon: 'minus',
        color: 'gray'
      }

    case 'on_hold':
      return {
        label: 'On hold',
        icon: 'hourglass',
        color: 'orange',
        task: 'On hold'
      }

    case 'packing':
      return {
        label: 'Packing',
        icon: 'package',
        color: 'orange',
        task: 'Packing'
      }

    case 'picking':
      return {
        label: 'Picking',
        icon: 'arrowDown',
        color: 'orange',
        task: 'Picking'
      }

    case 'ready_to_ship':
      return {
        label: 'Ready to ship',
        icon: 'arrowUpRight',
        color: 'orange',
        task: 'Ready to ship'
      }

    case 'shipped':
      return {
        label: 'Shipped',
        icon: 'check',
        color: 'green'
      }

    case 'awaiting_stock_transfer':
      return {
        label: 'Awaiting stock transfers',
        icon: 'hourglass',
        color: 'orange',
        task: 'Awaiting stock transfers'
      }

    default:
      return {
        label: `Not handled: (${shipment.status})`,
        icon: 'warning',
        color: 'white'
      }
  }
}

export function getShipmentStatusName(status: Shipment['status']): string {
  const dictionary: Record<typeof status, string> = {
    draft: 'Draft',
    on_hold: 'On hold',
    upcoming: 'Upcoming',
    packing: 'Packing',
    picking: 'Picking',
    ready_to_ship: 'Ready to ship',
    shipped: 'Shipped',
    cancelled: 'Cancelled'
  }

  return dictionary[status]
}
