import { useTranslation } from '#providers/I18NProvider'
import type { Customer } from '@commercelayer/sdk'
import type { DisplayStatus } from './types'

export interface CustomerDisplayStatus extends DisplayStatus {}

export function getCustomerDisplayStatus(
  customerObj: Customer
): CustomerDisplayStatus {
  const { t } = useTranslation()

  switch (customerObj.status) {
    case 'prospect':
      return {
        label: t('common.resources.customers.status.prospect'),
        icon: 'chatCircle',
        color: 'orange',
        task: t('common.resources.customers.status.prospect')
      }

    case 'acquired':
      return {
        label: t('common.resources.customers.status.acquired'),
        icon: 'check',
        color: 'orange',
        task: t('common.resources.customers.status.acquired')
      }

    case 'repeat':
      return {
        label: t('common.resources.customers.status.repeat'),
        icon: 'arrowUpRight',
        color: 'orange',
        task: t('common.resources.customers.status.repeat')
      }
  }
}

export function getCustomerStatusName(status: Customer['status']): string {
  const { t } = useTranslation()

  const dictionary: Record<typeof status, string> = {
    prospect: t('common.resources.customers.status.prospect'),
    acquired: t('common.resources.customers.status.acquired'),
    repeat: t('common.resources.customers.status.repeat')
  }

  return dictionary[status]
}
