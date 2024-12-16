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
        label: t('resources.returns.attributes.status.requested'),
        icon: 'chatCircle',
        color: 'orange',
        task: t('resources.returns.attributes.status.requested')
      }

    case 'approved':
      return {
        label: t('resources.returns.attributes.status.approved'),
        icon: 'check',
        color: 'orange',
        task: t('resources.returns.attributes.status.approved')
      }

    case 'shipped':
      return {
        label: t('resources.returns.attributes.status.shipped'),
        icon: 'arrowUpRight',
        color: 'orange',
        task: t('resources.returns.attributes.status.shipped')
      }

    case 'received':
      return {
        label: t('resources.returns.attributes.status.received'),
        icon: 'check',
        color: 'green'
      }

    case 'cancelled':
      return {
        label: t('resources.returns.attributes.status.cancelled'),
        icon: 'x',
        color: 'gray'
      }

    case 'rejected':
      return {
        label: t('resources.returns.attributes.status.rejected'),
        icon: 'x',
        color: 'red'
      }

    case 'refunded':
      return {
        label: t('resources.returns.attributes.status.refunded'),
        icon: 'creditCard',
        color: 'green'
      }

    default:
      return {
        label: `${t('common.not_handled')}: (${returnObj.status})`,
        icon: 'warning',
        color: 'white'
      }
  }
}

export function getReturnStatusName(status: Return['status']): string {
  const dictionary: Record<typeof status, string> = {
    draft: t('resources.returns.attributes.status.draft'),
    requested: t('resources.returns.attributes.status.requested'),
    approved: t('resources.returns.attributes.status.approved'),
    shipped: t('resources.returns.attributes.status.shipped'),
    received: t('resources.returns.attributes.status.received'),
    cancelled: t('resources.returns.attributes.status.cancelled'),
    rejected: t('resources.returns.attributes.status.rejected'),
    refunded: t('resources.returns.attributes.status.refunded')
  }

  return dictionary[status]
}
