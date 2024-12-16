import { type StatusIconProps } from '#ui/atoms/StatusIcon'
import type { StockTransfer } from '@commercelayer/sdk'
import { t } from 'i18next'
import type { DisplayStatus } from './types'

export interface StockTransferDisplayStatus extends DisplayStatus {
  label: string
  icon: StatusIconProps['name']
  color: StatusIconProps['background']
  task?: string
}

export function getStockTransferDisplayStatus(
  stockTransfer: StockTransfer
): StockTransferDisplayStatus {
  switch (stockTransfer.status) {
    case 'upcoming':
      return {
        label: t('resources.stock_transfers.attributes.status.upcoming'),
        icon: 'arrowUpRight',
        color: 'orange',
        task: t('resources.stock_transfers.attributes.status.upcoming')
      }

    case 'on_hold':
      return {
        label: t('resources.stock_transfers.attributes.status.on_hold'),
        icon: 'hourglass',
        color: 'orange',
        task: t('resources.stock_transfers.attributes.status.on_hold')
      }

    case 'picking':
      return {
        label: t('resources.stock_transfers.attributes.status.picking'),
        icon: 'arrowDown',
        color: 'orange',
        task: t('resources.stock_transfers.attributes.status.picking')
      }

    case 'in_transit':
      return {
        label: t('resources.stock_transfers.attributes.status.in_transit'),
        icon: 'arrowsLeftRight',
        color: 'orange',
        task: t('resources.stock_transfers.attributes.status.in_transit')
      }

    case 'completed':
      return {
        label: t('resources.stock_transfers.attributes.status.completed'),
        icon: 'check',
        color: 'green'
      }

    case 'cancelled':
      return {
        label: t('resources.stock_transfers.attributes.status.cancelled'),
        icon: 'x',
        color: 'gray'
      }

    default:
      return {
        label: `${t('common.not_handled')}: (${stockTransfer.status})`,
        icon: 'warning',
        color: 'white'
      }
  }
}

export function getStockTransferStatusName(
  status: StockTransfer['status']
): string {
  const dictionary: Record<typeof status, string> = {
    cancelled: t('resources.stock_transfers.attributes.status.cancelled'),
    completed: t('resources.stock_transfers.attributes.status.completed'),
    draft: t('resources.stock_transfers.attributes.status.draft'),
    in_transit: t('resources.stock_transfers.attributes.status.in_transit'),
    on_hold: t('resources.stock_transfers.attributes.status.on_hold'),
    picking: t('resources.stock_transfers.attributes.status.picking'),
    upcoming: t('resources.stock_transfers.attributes.status.upcoming')
  }

  return dictionary[status]
}
