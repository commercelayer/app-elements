import type { Customer } from '@commercelayer/sdk'
import { t } from 'i18next'
import type { DisplayStatus } from './types'

export interface CustomerDisplayStatus extends DisplayStatus {}

export function getCustomerDisplayStatus(
  customerObj: Customer
): CustomerDisplayStatus {
  switch (customerObj.status) {
    case 'prospect':
      return {
        label: t('resources.customers.attributes.status.prospect'),
        icon: 'chatCircle',
        color: 'orange',
        task: t('resources.customers.attributes.status.prospect')
      }

    case 'acquired':
      return {
        label: t('resources.customers.attributes.status.acquired'),
        icon: 'check',
        color: 'orange',
        task: t('resources.customers.attributes.status.acquired')
      }

    case 'repeat':
      return {
        label: t('resources.customers.attributes.status.repeat'),
        icon: 'arrowUpRight',
        color: 'orange',
        task: t('resources.customers.attributes.status.repeat')
      }
  }
}

export function getCustomerStatusName(status: Customer['status']): string {
  const dictionary: Record<typeof status, string> = {
    prospect: t('resources.customers.attributes.status.prospect'),
    acquired: t('resources.customers.attributes.status.acquired'),
    repeat: t('resources.customers.attributes.status.repeat')
  }

  return dictionary[status]
}
