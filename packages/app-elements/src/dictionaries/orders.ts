import { type IconProps } from '#ui/atoms/Icon'
import type { Order } from '@commercelayer/sdk'

type UITriggerAttributes =
  | '_approve'
  | '_cancel'
  | '_capture'
  | '_refund'
  | '_return'
  | '_archive'
  | '_unarchive'

type UIStatus =
  | 'pending'
  | 'placed'
  | 'approved'
  | 'in_progress'
  | 'paid'
  | 'fulfilled'
  | 'error'
  | 'cancelled'
  | 'refunded'
  | 'part_refunded'
  | 'not_handled'

interface OrderDisplayStatus {
  status: UIStatus
  label: string
  icon: IconProps['name']
  color: IconProps['background']
  task?: string
  triggerAttributes: UITriggerAttributes[]
}

export function getOrderDisplayStatus(order: Order): OrderDisplayStatus {
  const archiveTriggerAttribute: Extract<
    UITriggerAttributes,
    '_archive' | '_unarchive'
  > = order.archived_at == null ? '_archive' : '_unarchive'

  const combinedStatus =
    `${order.status}:${order.payment_status}:${order.fulfillment_status}` as const

  switch (combinedStatus) {
    case 'placed:authorized:unfulfilled':
      return {
        status: 'placed',
        label: 'Placed',
        icon: 'arrowDown',
        color: 'orange',
        task: 'Awaiting approval',
        triggerAttributes: ['_approve', '_cancel']
      }

    case 'placed:authorized:not_required':
      return {
        status: 'placed',
        label: 'Placed',
        icon: 'arrowDown',
        color: 'orange',
        task: 'Awaiting approval',
        triggerAttributes: ['_approve', '_cancel']
      }

    case 'placed:paid:unfulfilled':
      return {
        status: 'placed',
        label: 'Placed',
        icon: 'arrowDown',
        color: 'orange',
        task: 'Awaiting approval',
        triggerAttributes: ['_approve', '_cancel']
      }

    case 'placed:free:unfulfilled':
      return {
        status: 'placed',
        label: 'Placed',
        icon: 'arrowDown',
        color: 'orange',
        task: 'Awaiting approval',
        triggerAttributes: ['_approve', '_cancel']
      }

    case 'placed:free:not_required':
      return {
        status: 'placed',
        label: 'Placed',
        icon: 'arrowDown',
        color: 'orange',
        task: 'Awaiting approval',
        triggerAttributes: ['_approve', '_cancel']
      }

    case 'approved:authorized:unfulfilled':
      return {
        status: 'approved',
        label: 'Approved',
        icon: 'creditCard',
        color: 'orange',
        task: 'Payment to capture',
        triggerAttributes: ['_capture']
      }

    case 'approved:authorized:not_required':
      return {
        status: 'approved',
        label: 'Approved',
        icon: 'creditCard',
        color: 'orange',
        task: 'Payment to capture',
        triggerAttributes: ['_capture']
      }

    case 'approved:paid:in_progress':
      return {
        status: 'paid',
        label: 'In progress',
        icon: 'arrowClockwise',
        color: 'orange',
        task: 'Fulfillment in progress',
        triggerAttributes: ['_refund']
      }

    case 'approved:partially_refunded:in_progress':
      return {
        status: 'part_refunded',
        label: 'In progress',
        icon: 'arrowClockwise',
        color: 'orange',
        task: 'Fulfillment in progress',
        triggerAttributes: ['_refund']
      }

    case 'approved:authorized:in_progress':
      return {
        status: 'in_progress',
        label: 'In progress (Manual)',
        icon: 'arrowClockwise',
        color: 'orange',
        task: 'Fulfillment in progress',
        triggerAttributes: ['_capture']
      }

    case 'approved:paid:fulfilled':
      return {
        status: 'fulfilled',
        label: 'Fulfilled',
        icon: 'check',
        color: 'green',
        triggerAttributes: ['_refund', '_return', archiveTriggerAttribute]
      }

    // TODO: This could be a gift-card and what If i do return?
    case 'approved:free:fulfilled':
      return {
        status: 'approved',
        label: 'Fulfilled',
        icon: 'check',
        color: 'green',
        triggerAttributes: ['_return', archiveTriggerAttribute]
      }

    case 'approved:paid:not_required':
      return {
        status: 'approved',
        label: 'Approved',
        icon: 'check',
        color: 'green',
        triggerAttributes: ['_refund', archiveTriggerAttribute]
      }

    case 'approved:free:not_required':
      return {
        status: 'approved',
        label: 'Approved',
        icon: 'check',
        color: 'green',
        triggerAttributes: [archiveTriggerAttribute]
      }

    case 'approved:partially_refunded:fulfilled':
      return {
        status: 'part_refunded',
        label: 'Part. refunded',
        icon: 'check',
        color: 'green',
        triggerAttributes: ['_refund', '_return', archiveTriggerAttribute]
      }

    case 'cancelled:voided:unfulfilled':
      return {
        status: 'cancelled',
        label: 'Cancelled',
        icon: 'x',
        color: 'gray',
        triggerAttributes: [archiveTriggerAttribute]
      }

    case 'cancelled:refunded:unfulfilled':
      return {
        status: 'refunded',
        label: 'Cancelled',
        icon: 'x',
        color: 'gray',
        triggerAttributes: [archiveTriggerAttribute]
      }

    case 'cancelled:refunded:fulfilled':
      return {
        status: 'refunded',
        label: 'Cancelled',
        icon: 'x',
        color: 'gray',
        triggerAttributes: ['_return', archiveTriggerAttribute]
      }

    case 'placed:unpaid:unfulfilled':
      return {
        status: 'error',
        label: 'Placed',
        icon: 'x',
        color: 'red',
        task: 'Error to cancel',
        triggerAttributes: ['_cancel']
      }

    case 'pending:unpaid:unfulfilled':
      return {
        status: 'pending',
        label: 'Pending',
        icon: 'shoppingBag',
        color: 'white',
        triggerAttributes: []
      }

    case 'pending:authorized:unfulfilled':
      return {
        status: 'pending',
        label: 'Pending',
        icon: 'shoppingBag',
        color: 'white',
        triggerAttributes: []
      }

    case 'pending:free:unfulfilled':
      return {
        status: 'pending',
        label: 'Pending',
        icon: 'shoppingBag',
        color: 'white',
        triggerAttributes: []
      }

    default:
      return {
        status: 'not_handled',
        label: `Not handled: (${combinedStatus})`,
        icon: 'warning',
        color: 'white',
        triggerAttributes: []
      }
  }
}

export function getOrderTransactionPastTense(
  type: NonNullable<Order['transactions']>[number]['type']
): string {
  const dictionary: Record<typeof type, string> = {
    authorizations: 'authorized',
    captures: 'captured',
    refunds: 'refunded',
    voids: 'voided'
  }

  return dictionary[type]
}

export function getOrderStatusName(status: Order['status']): string {
  const dictionary: Record<typeof status, string> = {
    approved: 'Approved',
    cancelled: 'Cancelled',
    draft: 'Draft',
    editing: 'Editing',
    pending: 'Pending',
    placed: 'Placed'
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

export function getOrderTriggerAttributeName(
  triggerAttribute: UITriggerAttributes
): string {
  const dictionary: Record<typeof triggerAttribute, string> = {
    _approve: 'Approve',
    _archive: 'Archive',
    _cancel: 'Cancel',
    _capture: 'Capture payment',
    _refund: 'Refund',
    _return: 'Return',
    _unarchive: 'Unarchive'
  }

  return dictionary[triggerAttribute]
}
