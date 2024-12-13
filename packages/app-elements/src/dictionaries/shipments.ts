import { type StatusIconProps } from '#ui/atoms/StatusIcon'
import type { Shipment } from '@commercelayer/sdk'
import { t } from 'i18next'
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
        label: t('common.resources.shipments.status.upcoming'),
        icon: 'truck',
        color: 'gray'
      }

    case 'cancelled':
      return {
        label: t('common.resources.shipments.status.cancelled'),
        icon: 'x',
        color: 'gray'
      }

    case 'draft':
      return {
        label: t('common.resources.shipments.status.draft'),
        icon: 'minus',
        color: 'gray'
      }

    case 'on_hold':
      return {
        label: t('common.resources.shipments.status.on_hold'),
        icon: 'hourglass',
        color: 'orange',
        task: t('common.resources.shipments.status.on_hold')
      }

    case 'packing':
      return {
        label: t('common.resources.shipments.status.packing'),
        icon: 'package',
        color: 'orange',
        task: t('common.resources.shipments.status.packing')
      }

    case 'picking':
      return {
        label: t('common.resources.shipments.status.picking'),
        icon: 'arrowDown',
        color: 'orange',
        task: t('common.resources.shipments.status.picking')
      }

    case 'ready_to_ship':
      return {
        label: t('common.resources.shipments.status.ready_to_ship'),
        icon: 'arrowUpRight',
        color: 'orange',
        task: t('common.resources.shipments.status.ready_to_ship')
      }

    case 'shipped':
      return {
        label: t('common.resources.shipments.status.shipped'),
        icon: 'arrowUpRight',
        color: 'green'
      }

    case 'delivered':
      return {
        label: t('common.resources.shipments.status.delivered'),
        icon: 'check',
        color: 'green'
      }

    case 'awaiting_stock_transfer':
      return {
        label: t('common.resources.shipments.status.awaiting_stock_transfer'),
        icon: 'hourglass',
        color: 'orange',
        task: 'Awaiting stock transfers'
      }

    default:
      return {
        label: `${t('common.resources.common.status.not_handled')}: (${shipment.status})`,
        icon: 'warning',
        color: 'white'
      }
  }
}

export function getShipmentStatusName(status: Shipment['status']): string {
  const dictionary: Record<typeof status, string> = {
    draft: t('common.resources.shipments.status.draft'),
    on_hold: t('common.resources.shipments.status.on_hold'),
    upcoming: t('common.resources.shipments.status.upcoming'),
    packing: t('common.resources.shipments.status.packing'),
    picking: t('common.resources.shipments.status.picking'),
    ready_to_ship: t('common.resources.shipments.status.ready_to_ship'),
    shipped: t('common.resources.shipments.status.shipped'),
    cancelled: t('common.resources.shipments.status.cancelled'),
    delivered: t('common.resources.shipments.status.delivered')
  }

  return dictionary[status]
}
