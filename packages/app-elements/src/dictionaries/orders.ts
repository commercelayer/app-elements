import type { StatusIconProps } from '#ui/atoms/StatusIcon'
import type { Order } from '@commercelayer/sdk'
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
      label: 'Editing',
      icon: 'pencilSimple',
      color: 'orange',
      task: 'Editing'
    }
  }

  switch (combinedStatus) {
    case 'placed:authorized:unfulfilled':
    case 'placed:authorized:not_required':
    case 'placed:paid:unfulfilled':
    case 'placed:paid:not_required':
    case 'placed:paid:in_progress':
    case 'placed:partially_refunded:unfulfilled':
    case 'placed:partially_refunded:not_required':
    case 'placed:free:unfulfilled':
    case 'placed:free:not_required':
      return {
        label: 'Placed',
        icon: 'arrowDown',
        color: 'orange',
        task: 'Awaiting approval'
      }

    case 'placed:unpaid:unfulfilled':
      return {
        label: 'Placed',
        icon: 'x',
        color: 'red',
        task: 'Error to cancel'
      }

    case 'approved:authorized:unfulfilled':
    case 'approved:authorized:not_required':
      return {
        label: 'Approved',
        icon: 'creditCard',
        color: 'orange',
        task: 'Payment to capture'
      }

    case 'approved:paid:in_progress':
    case 'approved:partially_refunded:in_progress':
      return {
        label: 'In progress',
        icon: 'arrowClockwise',
        color: 'orange',
        task: 'Fulfillment in progress'
      }

    case 'approved:authorized:in_progress':
      return {
        label: 'In progress (Manual)',
        icon: 'arrowClockwise',
        color: 'orange',
        task: 'Fulfillment in progress'
      }

    case 'approved:paid:fulfilled':
      return {
        label: 'Fulfilled',
        icon: 'check',
        color: 'green'
      }

    // TODO: This could be a gift-card and what If i do return?
    case 'approved:free:fulfilled':
      return {
        label: 'Fulfilled',
        icon: 'check',
        color: 'green'
      }

    case 'approved:paid:not_required':
    case 'approved:partially_refunded:not_required':
      return {
        label: 'Approved',
        icon: 'check',
        color: 'green'
      }

    case 'approved:free:not_required':
      return {
        label: 'Approved',
        icon: 'check',
        color: 'green'
      }

    case 'approved:partially_refunded:fulfilled':
      return {
        label: 'Part. refunded',
        icon: 'check',
        color: 'green'
      }

    case 'cancelled:voided:unfulfilled':
    case 'cancelled:refunded:unfulfilled':
    case 'cancelled:refunded:not_required':
    case 'cancelled:unpaid:unfulfilled':
    case 'cancelled:free:unfulfilled':
      return {
        label: 'Cancelled',
        icon: 'x',
        color: 'gray'
      }

    case 'cancelled:refunded:fulfilled':
      return {
        label: 'Cancelled',
        icon: 'x',
        color: 'gray'
      }

    case 'pending:unpaid:unfulfilled':
    case 'pending:authorized:unfulfilled':
    case 'pending:free:unfulfilled':
      return {
        label: 'Pending',
        icon: 'shoppingBag',
        color: 'white'
      }

    default:
      return {
        label: `Not handled: (${combinedStatus})`,
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
    approved: 'Approved',
    cancelled: 'Cancelled',
    draft: 'Draft',
    editing: 'Editing',
    pending: 'Pending',
    placed: 'Placed',
    placing: 'Placing'
  }

  return dictionary[status]
}

export function getOrderPaymentStatusName(
  status: Order['payment_status']
): string {
  const dictionary: Record<typeof status, string> = {
    authorized: 'Authorized',
    paid: 'Paid',
    unpaid: 'Unpaid',
    free: 'Free',
    voided: 'Voided',
    refunded: 'Refunded',
    partially_authorized: 'Part. authorized',
    partially_paid: 'Part. paid',
    partially_refunded: 'Part. refunded',
    partially_voided: 'Part. voided'
  }

  return dictionary[status]
}

export function getOrderFulfillmentStatusName(
  status: Order['fulfillment_status']
): string {
  const dictionary: Record<typeof status, string> = {
    unfulfilled: 'Unfulfilled',
    in_progress: 'In progress',
    fulfilled: 'Fulfilled',
    not_required: 'Not required'
  }

  return dictionary[status]
}
