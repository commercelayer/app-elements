import { useTranslation } from '#providers/I18NProvider'
import { type StatusIconProps } from '#ui/atoms/StatusIcon'
import type { StockTransfer } from '@commercelayer/sdk'
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
  const { t } = useTranslation()

  switch (stockTransfer.status) {
    case 'upcoming':
      return {
        label: t('common.resources.stock_transfers.status.upcoming'),
        icon: 'arrowUpRight',
        color: 'orange',
        task: t('common.resources.stock_transfers.status.upcoming')
      }

    case 'on_hold':
      return {
        label: t('common.resources.stock_transfers.status.on_hold'),
        icon: 'hourglass',
        color: 'orange',
        task: t('common.resources.stock_transfers.status.on_hold')
      }

    case 'picking':
      return {
        label: t('common.resources.stock_transfers.status.picking'),
        icon: 'arrowDown',
        color: 'orange',
        task: t('common.resources.stock_transfers.status.picking')
      }

    case 'in_transit':
      return {
        label: t('common.resources.stock_transfers.status.in_transit'),
        icon: 'arrowsLeftRight',
        color: 'orange',
        task: t('common.resources.stock_transfers.status.in_transit')
      }

    case 'completed':
      return {
        label: t('common.resources.stock_transfers.status.completed'),
        icon: 'check',
        color: 'green'
      }

    case 'cancelled':
      return {
        label: t('common.resources.stock_transfers.status.cancelled'),
        icon: 'x',
        color: 'gray'
      }

    default:
      return {
        label: `${t('common.resources.common.status.not_handled')}: (${stockTransfer.status})`,
        icon: 'warning',
        color: 'white'
      }
  }
}

export function getStockTransferStatusName(
  status: StockTransfer['status']
): string {
  const { t } = useTranslation()

  const dictionary: Record<typeof status, string> = {
    cancelled: t('common.resources.stock_transfers.status.cancelled'),
    completed: t('common.resources.stock_transfers.status.completed'),
    draft: t('common.resources.stock_transfers.status.draft'),
    in_transit: t('common.resources.stock_transfers.status.in_transit'),
    on_hold: t('common.resources.stock_transfers.status.on_hold'),
    picking: t('common.resources.stock_transfers.status.picking'),
    upcoming: t('common.resources.stock_transfers.status.upcoming')
  }

  return dictionary[status]
}
