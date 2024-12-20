import type { StatusIconProps } from '#ui/atoms/StatusIcon'
import type { Order } from '@commercelayer/sdk'
import { t } from 'i18next'
import type { DisplayStatus } from './types'
export interface OrderDisplayStatus extends DisplayStatus {
  label: string
  icon: StatusIconProps['name']
  color: StatusIconProps['background']
  task?: string
}

export function getOrderDisplayStatus(order: Order): OrderDisplayStatus {
  const combinedStatus =
    `${order.status}:${order.payment_status}:${order.fulfillment_status}` as const

  if (order.status === 'editing') {
    return {
      label: t('resources.orders.attributes.status.editing'),
      icon: 'pencilSimple',
      color: 'orange',
      task: t('resources.orders.attributes.status.editing')
    }
  }

  switch (combinedStatus) {
    case 'placed:authorized:unfulfilled':
    case 'placed:authorized:not_required':
    case 'placed:paid:unfulfilled':
    case 'placed:paid:not_required':
    case 'placed:partially_refunded:unfulfilled':
    case 'placed:partially_refunded:not_required':
    case 'placed:free:unfulfilled':
    case 'placed:free:not_required':
      return {
        label: t('resources.orders.attributes.status.placed'),
        icon: 'arrowDown',
        color: 'orange',
        task: t('apps.orders.tasks.awaiting_approval')
      }

    case 'placed:unpaid:unfulfilled':
      return {
        label: t('resources.orders.attributes.status.placed'),
        icon: 'x',
        color: 'red',
        task: t('apps.orders.tasks.error_to_cancel')
      }

    case 'approved:authorized:unfulfilled':
    case 'approved:authorized:not_required':
      return {
        label: t('resources.orders.attributes.status.approved'),
        icon: 'creditCard',
        color: 'orange',
        task: t('apps.orders.tasks.payment_to_capture')
      }

    case 'approved:paid:in_progress':
    case 'approved:partially_refunded:in_progress':
      return {
        label: t('apps.orders.display_status.in_progress'),
        icon: 'arrowClockwise',
        color: 'orange',
        task: t('apps.orders.tasks.fulfillment_in_progress')
      }

    case 'approved:authorized:in_progress':
      return {
        label: t('apps.orders.display_status.in_progress_manual'),
        icon: 'arrowClockwise',
        color: 'orange',
        task: t('apps.orders.tasks.fulfillment_in_progress')
      }

    case 'approved:paid:fulfilled':
      return {
        label: t('resources.orders.attributes.fulfillment_status.fulfilled'),
        icon: 'check',
        color: 'green'
      }

    // TODO: This could be a gift-card and what If i do return?
    case 'approved:free:fulfilled':
      return {
        label: t('resources.orders.attributes.fulfillment_status.fulfilled'),
        icon: 'check',
        color: 'green'
      }

    case 'approved:paid:not_required':
    case 'approved:partially_refunded:not_required':
      return {
        label: t('resources.orders.attributes.status.approved'),
        icon: 'check',
        color: 'green'
      }

    case 'approved:free:not_required':
      return {
        label: t('resources.orders.attributes.status.approved'),
        icon: 'check',
        color: 'green'
      }

    case 'approved:partially_refunded:fulfilled':
      return {
        label: t(
          'resources.orders.attributes.payment_status.partially_refunded'
        ),
        icon: 'check',
        color: 'green'
      }

    case 'cancelled:voided:unfulfilled':
    case 'cancelled:refunded:unfulfilled':
    case 'cancelled:refunded:not_required':
    case 'cancelled:unpaid:unfulfilled':
    case 'cancelled:free:unfulfilled':
      return {
        label: t('resources.orders.attributes.status.cancelled'),
        icon: 'x',
        color: 'gray'
      }

    case 'cancelled:refunded:fulfilled':
      return {
        label: t('resources.orders.attributes.status.cancelled'),
        icon: 'x',
        color: 'gray'
      }

    case 'pending:unpaid:unfulfilled':
    case 'pending:authorized:unfulfilled':
    case 'pending:free:unfulfilled':
      return {
        label: t('resources.orders.attributes.status.pending'),
        icon: 'shoppingBag',
        color: 'white'
      }

    default:
      return {
        label: `${t('common.not_handled')}: (${combinedStatus})`,
        icon: 'warning',
        color: 'white'
      }
  }
}

export function getOrderTransactionName(
  type: NonNullable<Order['transactions']>[number]['type']
): { pastTense: string; singular: string } {
  const pastTenseDictionary: Record<typeof type, string> = {
    authorizations: 'authorized',
    captures: 'captured',
    refunds: 'refunded',
    voids: 'voided'
  }
  const singularDictionary: Record<typeof type, string> = {
    authorizations: 'Payment authorization',
    captures: 'Payment capture',
    refunds: 'Refund',
    voids: 'Void'
  }

  return {
    pastTense: pastTenseDictionary[type],
    singular: singularDictionary[type]
  }
}

export function getOrderStatusName(status: Order['status']): string {
  const dictionary: Record<typeof status, string> = {
    approved: t('resources.orders.attributes.status.approved'),
    cancelled: t('resources.orders.attributes.status.cancelled'),
    draft: t('resources.orders.attributes.status.draft'),
    editing: t('resources.orders.attributes.status.editing'),
    pending: t('resources.orders.attributes.status.pending'),
    placed: t('resources.orders.attributes.status.placed'),
    placing: t('resources.orders.attributes.status.placing')
  }

  return dictionary[status]
}

export function getOrderPaymentStatusName(
  status: Order['payment_status']
): string {
  const dictionary: Record<typeof status, string> = {
    authorized: t('resources.orders.attributes.payment_status.authorized'),
    paid: t('resources.orders.attributes.payment_status.paid'),
    unpaid: t('resources.orders.attributes.payment_status.unpaid'),
    free: t('resources.orders.attributes.payment_status.free'),
    voided: t('resources.orders.attributes.payment_status.voided'),
    refunded: t('resources.orders.attributes.payment_status.refunded'),
    partially_authorized: t(
      'resources.orders.attributes.payment_status.partially_authorized'
    ),
    partially_paid: t(
      'resources.orders.attributes.payment_status.partially_paid'
    ),
    partially_refunded: t(
      'resources.orders.attributes.payment_status.partially_refunded'
    ),
    partially_voided: t(
      'resources.orders.attributes.payment_status.partially_voided'
    )
  }

  return dictionary[status]
}

export function getOrderFulfillmentStatusName(
  status: Order['fulfillment_status']
): string {
  const dictionary: Record<typeof status, string> = {
    unfulfilled: t(
      'resources.orders.attributes.fulfillment_status.unfulfilled'
    ),
    in_progress: t(
      'resources.orders.attributes.fulfillment_status.in_progress'
    ),
    fulfilled: t('resources.orders.attributes.fulfillment_status.fulfilled'),
    not_required: t(
      'resources.orders.attributes.fulfillment_status.not_required'
    )
  }

  return dictionary[status]
}
