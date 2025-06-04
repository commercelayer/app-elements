import type { Authorization, Capture, Refund, Void } from '@commercelayer/sdk'
import isEmpty from 'lodash-es/isEmpty'

/**
 * Check if the transaction is an async capture
 * We assume that async pending captures are those
 * that are not succeeded and have no message or error code.
 */
export function orderTransactionIsAnAsyncCapture(
  transaction: Authorization | Void | Capture | Refund
): boolean {
  return (
    transaction.type === 'captures' &&
    !transaction.succeeded &&
    isEmpty(transaction.message) &&
    isEmpty(transaction.error_code)
  )
}
