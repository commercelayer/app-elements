import { type StatusIconProps } from '#ui/atoms/StatusIcon'
import type { Return } from '@commercelayer/sdk'
import { t } from 'i18next'
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
        label: t('common.resources.returns.status.requested'),
        icon: 'chatCircle',
        color: 'orange',
        task: t('common.resources.returns.status.requested')
      }

    case 'approved':
      return {
        label: t('common.resources.returns.status.approved'),
        icon: 'check',
        color: 'orange',
        task: t('common.resources.returns.status.approved')
      }

    case 'shipped':
      return {
        label: t('common.resources.returns.status.shipped'),
        icon: 'arrowUpRight',
        color: 'orange',
        task: t('common.resources.returns.status.shipped')
      }

    case 'received':
      return {
        label: t('common.resources.returns.status.received'),
        icon: 'check',
        color: 'green'
      }

    case 'cancelled':
      return {
        label: t('common.resources.returns.status.cancelled'),
        icon: 'x',
        color: 'gray'
      }

    case 'rejected':
      return {
        label: t('common.resources.returns.status.rejected'),
        icon: 'x',
        color: 'red'
      }

    case 'refunded':
      return {
        label: t('common.resources.returns.status.refunded'),
        icon: 'creditCard',
        color: 'green'
      }

    default:
      return {
        label: `${t('common.resources.common.status.not_handled')}: (${returnObj.status})`,
        icon: 'warning',
        color: 'white'
      }
  }
}

export function getReturnStatusName(status: Return['status']): string {
  const dictionary: Record<typeof status, string> = {
    draft: t('common.resources.returns.status.draft'),
    requested: t('common.resources.returns.status.requested'),
    approved: t('common.resources.returns.status.approved'),
    shipped: t('common.resources.returns.status.shipped'),
    received: t('common.resources.returns.status.received'),
    cancelled: t('common.resources.returns.status.cancelled'),
    rejected: t('common.resources.returns.status.rejected'),
    refunded: t('common.resources.returns.status.refunded')
  }

  return dictionary[status]
}
