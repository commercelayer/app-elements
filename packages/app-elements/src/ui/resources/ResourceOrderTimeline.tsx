import { getOrderTransactionName } from '#dictionaries/orders'
import { navigateTo } from '#helpers/appsNavigation'
import { isAttachmentValidNote, referenceOrigins } from '#helpers/attachments'
import { useCoreApi, useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { t } from '#providers/I18NProvider'
import { useTokenProvider } from '#providers/TokenProvider'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Text } from '#ui/atoms/Text'
import { Timeline, type TimelineEvent } from '#ui/composite/Timeline'
import type { Attachment, Order, StockTransfer } from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'
import {
  useCallback,
  useEffect,
  useReducer,
  useState,
  type Reducer
} from 'react'

export interface ResourceOrderTimelineProps {
  orderId?: string
  refresh?: boolean
  attachmentOption?: {
    onMessage?: (attachment: Attachment) => void
    referenceOrigin:
      | typeof referenceOrigins.appOrdersNote
      | typeof referenceOrigins.appShipmentsNote
  }
}

export const ResourceOrderTimeline =
  withSkeletonTemplate<ResourceOrderTimelineProps>(
    ({ orderId, attachmentOption, refresh, isLoading: isExternalLoading }) => {
      const fakeOrderId = 'fake-NMWYhbGorj'
      const {
        data: order,
        isLoading,
        mutate: mutateOrder
      } = useCoreApi(
        'orders',
        'retrieve',
        orderId == null || isEmpty(orderId)
          ? null
          : [
              orderId,
              {
                include: [
                  'shipments',
                  'shipments.attachments',
                  'shipments.stock_transfers',
                  'shipments.stock_transfers.origin_stock_location',
                  'returns',
                  'transactions',
                  'payment_method',
                  'payment_source',
                  'attachments'
                ]
              }
            ],
        {
          fallbackData: {
            type: 'orders',
            id: fakeOrderId,
            status: 'approved',
            payment_status: 'paid',
            fulfillment_status: 'in_progress',
            created_at: '2020-05-16T11:06:02.074Z',
            updated_at: '2020-05-16T14:18:35.572Z',
            placed_at: '2020-05-16T11:06:22.012Z',
            approved_at: '2020-05-16T14:18:16.775Z',
            fulfillment_updated_at: '2020-05-16T14:18:35.411Z'
          } satisfies Order
        }
      )

      const [events] = useTimelineReducer(order)
      const { sdkClient } = useCoreSdkProvider()
      const { user, canUser } = useTokenProvider()

      useEffect(
        function refreshOrder() {
          if (refresh === true) {
            void mutateOrder()
          }
        },
        [refresh]
      )

      return (
        <Timeline
          disabled={!canUser('create', 'attachments')}
          isLoading={
            isExternalLoading === true || isLoading || order.id === fakeOrderId
          }
          events={events}
          timezone={user?.timezone}
          onKeyDown={(event) => {
            if (event.code === 'Enter' && event.currentTarget.value !== '') {
              if (
                attachmentOption?.referenceOrigin == null ||
                ![
                  referenceOrigins.appOrdersNote,
                  referenceOrigins.appShipmentsNote
                ].includes(attachmentOption.referenceOrigin)
              ) {
                console.warn(
                  `Cannot create the attachment: "referenceOrigin" is not valid.`
                )
                return
              }

              if (user?.displayName == null || isEmpty(user.displayName)) {
                console.warn(
                  `Cannot create the attachment: token does not contain a valid "user".`
                )
                return
              }

              void sdkClient.attachments
                .create({
                  reference_origin: attachmentOption.referenceOrigin,
                  name: user.displayName,
                  description: event.currentTarget.value,
                  attachable: { type: 'orders', id: order.id }
                })
                .then((attachment) => {
                  void mutateOrder()
                  attachmentOption?.onMessage?.(attachment)
                })

              event.currentTarget.value = ''
            }
          }}
        />
      )
    }
  )

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useTimelineReducer = (order: Order) => {
  const [orderId, setOrderId] = useState<string>(order.id)
  const {
    canAccess,
    settings: { mode }
  } = useTokenProvider()

  const [events, dispatch] = useReducer<
    Reducer<
      TimelineEvent[],
      | {
          type: 'add'
          payload: TimelineEvent
        }
      | {
          type: 'clear'
        }
    >
  >((state, action) => {
    switch (action.type) {
      case 'clear':
        return []
      case 'add':
        if (state.find((s) => s.date === action.payload.date) != null) {
          return state
        }

        return [...state, action.payload]
      default:
        return state
    }
  }, [])

  useEffect(
    function clearState() {
      if (order.id !== orderId) {
        dispatch({ type: 'clear' })
        setOrderId(order.id)
      }
    },
    [order.id]
  )

  useEffect(
    function addCreated() {
      if (order.created_at != null) {
        dispatch({
          type: 'add',
          payload: {
            date: order.created_at,
            message: (
              <>
                {t('common.timeline.resources.order_was')}{' '}
                <Text weight='bold'>
                  {t('common.timeline.resources.order_created')}
                </Text>
              </>
            )
          }
        })
      }
    },
    [order.created_at]
  )

  useEffect(
    function addPlaced() {
      if (order.placed_at != null) {
        dispatch({
          type: 'add',
          payload: {
            date: order.placed_at,
            message: (
              <>
                {t('common.timeline.resources.order_was')}{' '}
                <Text weight='bold'>
                  {t('common.timeline.resources.order_placed')}
                </Text>
              </>
            )
          }
        })
      }
    },
    [order.placed_at]
  )

  useEffect(
    function addCancelled() {
      if (order.cancelled_at != null) {
        dispatch({
          type: 'add',
          payload: {
            date: order.cancelled_at,
            message: (
              <>
                {t('common.timeline.resources.order_was')}{' '}
                <Text weight='bold'>
                  {t('common.timeline.resources.order_cancelled')}
                </Text>
              </>
            )
          }
        })
      }
    },
    [order.cancelled_at]
  )

  useEffect(
    function addArchived() {
      if (order.archived_at != null) {
        dispatch({
          type: 'add',
          payload: {
            date: order.archived_at,
            message: (
              <>
                {t('common.timeline.resources.order_was')}{' '}
                <Text weight='bold'>
                  {t('common.timeline.resources.order_archived')}
                </Text>
              </>
            )
          }
        })
      }
    },
    [order.archived_at]
  )

  useEffect(
    function addApproved() {
      if (order.approved_at != null) {
        dispatch({
          type: 'add',
          payload: {
            date: order.approved_at,
            message: (
              <>
                {t('common.timeline.resources.order_was')}{' '}
                <Text weight='bold'>
                  {t('common.timeline.resources.order_approved')}
                </Text>
              </>
            )
          }
        })
      }
    },
    [order.approved_at]
  )

  useEffect(
    function addFulfillmentStatus() {
      if (
        order.fulfillment_updated_at != null &&
        order.fulfillment_status !== 'unfulfilled'
      ) {
        const messages: Record<Order['fulfillment_status'], React.ReactNode> = {
          fulfilled: (
            <>
              {t('common.timeline.resources.order_is')}{' '}
              <Text weight='bold'>
                {t('common.timeline.resources.order_fulfilled')}
              </Text>
            </>
          ),
          in_progress: (
            <>
              {t('common.timeline.resources.order_fulfillment_is')}{' '}
              <Text weight='bold'>
                {t('common.timeline.resources.order_fulfillment_in_progress')}
              </Text>
            </>
          ),
          not_required: (
            <>
              {t('common.timeline.resources.order_fulfillment_is')}{' '}
              <Text weight='bold'>
                {t('common.timeline.resources.order_fulfillment_not_required')}
              </Text>
            </>
          ),
          unfulfilled: (
            <>
              {t('common.timeline.resources.order_is')}{' '}
              <Text weight='bold'>
                {t('common.timeline.resources.order_unfulfilled')}
              </Text>
            </>
          )
        }

        dispatch({
          type: 'add',
          payload: {
            date: order.fulfillment_updated_at,
            message: messages[order.fulfillment_status]
          }
        })
      }
    },
    [order.fulfillment_updated_at, order.fulfillment_status]
  )

  useEffect(
    function addTransactions() {
      if (order.transactions != null) {
        order.transactions.forEach((transaction) => {
          const name = getOrderTransactionName(transaction.type)
          const isFailedCapture =
            transaction.type === 'captures' && !transaction.succeeded
          const isFailedAuthorization =
            transaction.type === 'authorizations' && !transaction.succeeded

          dispatch({
            type: 'add',
            payload: {
              date: transaction.created_at,
              message: transaction.succeeded ? (
                <>
                  {t('common.timeline.resources.payment_of_was', {
                    amount: transaction.formatted_amount
                  })}{' '}
                  <Text weight='bold'>{name.pastTense}</Text>
                </>
              ) : (
                <>
                  {/* `Payment capture of xxxx failed` or `Authorization of xxxx failed`, etc... */}
                  {t('common.timeline.resources.transaction_of', {
                    transaction: name.singular,
                    amount: transaction.formatted_amount
                  })}{' '}
                  <Text weight='bold'>
                    {t('common.timeline.resources.transaction_failed')}
                  </Text>
                </>
              ),
              note:
                isFailedCapture && transaction.message != null
                  ? transaction.message
                  : isFailedAuthorization && !isEmpty(transaction.error_detail)
                    ? (transaction.error_detail ?? '')
                    : undefined
            }
          })
        })
      }
    },
    [order.transactions]
  )

  const dispatchAttachments = useCallback(
    (attachments?: Attachment[] | null | undefined) => {
      if (attachments != null) {
        attachments.forEach((attachment) => {
          if (
            isAttachmentValidNote(attachment, [
              referenceOrigins.appOrdersNote,
              referenceOrigins.appOrdersRefundNote,
              referenceOrigins.appShipmentsNote
            ])
          ) {
            dispatch({
              type: 'add',
              payload: {
                date: attachment.updated_at,
                author: attachment.name,
                message: (
                  <span>
                    {attachment.reference_origin ===
                    referenceOrigins.appOrdersRefundNote
                      ? t('common.timeline.left_a_refund_note')
                      : t('common.timeline.left_a_note')}
                  </span>
                ),
                note: attachment.description
              }
            })
          }
        })
      }
    },
    []
  )

  useEffect(
    function addAttachments() {
      dispatchAttachments(order.attachments)
    },
    [order.attachments]
  )

  const dispatchStockTransfers = useCallback(
    (stockTransfers?: StockTransfer[] | null | undefined) => {
      if (stockTransfers != null) {
        stockTransfers.forEach((stockTransfer) => {
          if (stockTransfer.completed_at != null) {
            const navigateToStockTransfer = canAccess('stock_transfers')
              ? navigateTo({
                  destination: {
                    app: 'stock_transfers',
                    resourceId: stockTransfer.id,
                    mode
                  }
                })
              : {}

            const stockTransferLabel = `Transfer #${stockTransfer.number}`
            const stockTransferClickableLabel = canAccess('stock_transfers') ? (
              <a {...navigateToStockTransfer}>
                <Text>{stockTransferLabel}</Text>
              </a>
            ) : (
              <Text variant='info'>{stockTransferLabel}</Text>
            )
            const stockTransferFrom =
              stockTransfer.origin_stock_location != null
                ? `from ${stockTransfer.origin_stock_location?.name} `
                : ''
            dispatch({
              type: 'add',
              payload: {
                date: stockTransfer.completed_at,
                message: (
                  <>
                    {stockTransferClickableLabel} {stockTransferFrom}
                    <Text weight='bold'>
                      {t('common.timeline.resources.stock_transfer_completed')}
                    </Text>
                  </>
                )
              }
            })
          }
        })
      }
    },
    []
  )

  useEffect(
    function addShipments() {
      order.shipments?.forEach((shipment) => {
        dispatchAttachments(shipment.attachments)
        dispatchStockTransfers(shipment.stock_transfers)

        if (shipment.on_hold_at != null) {
          dispatch({
            type: 'add',
            payload: {
              date: shipment.on_hold_at,
              message: (
                <>
                  {t('common.timeline.resources.shipment_number_is', {
                    number: shipment.number
                  })}{' '}
                  <Text weight='bold'>
                    {t('common.timeline.resources.shipment_on_hold')}
                  </Text>
                </>
              )
            }
          })
        }

        if (shipment.picking_at != null) {
          dispatch({
            type: 'add',
            payload: {
              date: shipment.picking_at,
              message: (
                <>
                  {t('common.timeline.resources.shipment_number_was', {
                    number: shipment.number
                  })}{' '}
                  <Text weight='bold'>
                    {t('common.timeline.resources.shipment_picked')}
                  </Text>
                </>
              )
            }
          })
        }

        if (shipment.packing_at != null) {
          dispatch({
            type: 'add',
            payload: {
              date: shipment.packing_at,
              message: (
                <>
                  {t('common.timeline.resources.shipment_number_isbeing', {
                    number: shipment.number,
                    interpolation: { escapeValue: false }
                  })}{' '}
                  <Text weight='bold'>
                    {t('common.timeline.resources.shipment_packed')}
                  </Text>
                </>
              )
            }
          })
        }

        if (shipment.ready_to_ship_at != null) {
          dispatch({
            type: 'add',
            payload: {
              date: shipment.ready_to_ship_at,
              message: (
                <>
                  {t('common.timeline.resources.shipment_number_is', {
                    number: shipment.number,
                    interpolation: { escapeValue: false }
                  })}{' '}
                  <Text weight='bold'>
                    {t('common.timeline.resources.shipment_ready_to_ship')}
                  </Text>
                </>
              )
            }
          })
        }

        if (shipment.shipped_at != null) {
          dispatch({
            type: 'add',
            payload: {
              date: shipment.shipped_at,
              message: (
                <>
                  {t('common.timeline.resources.shipment_number_was', {
                    number: shipment.number
                  })}{' '}
                  <Text weight='bold'>
                    {t('common.timeline.resources.shipment_shipped')}
                  </Text>
                </>
              )
            }
          })
        }
      })
    },
    [order.shipments]
  )

  useEffect(
    function addReturns() {
      order.returns?.forEach((returnObj) => {
        dispatchAttachments(returnObj.attachments)

        if (returnObj.approved_at != null) {
          dispatch({
            type: 'add',
            payload: {
              date: returnObj.approved_at,
              message: (
                <>
                  {t('common.timeline.resources.return_number_was', {
                    number: returnObj.number
                  })}{' '}
                  <Text weight='bold'>
                    {t('common.timeline.resources.return_approved')}
                  </Text>
                </>
              )
            }
          })
        }

        if (returnObj.cancelled_at != null) {
          dispatch({
            type: 'add',
            payload: {
              date: returnObj.cancelled_at,
              message: (
                <>
                  {t('common.timeline.resources.return_number_was', {
                    number: returnObj.number
                  })}{' '}
                  <Text weight='bold'>
                    {t('common.timeline.resources.return_cancelled')}
                  </Text>
                </>
              )
            }
          })
        }

        if (returnObj.shipped_at != null) {
          dispatch({
            type: 'add',
            payload: {
              date: returnObj.shipped_at,
              message: (
                <>
                  {t('common.timeline.resources.return_number_was', {
                    number: returnObj.number
                  })}{' '}
                  <Text weight='bold'>
                    {t('common.timeline.resources.return_shipped')}
                  </Text>
                </>
              )
            }
          })
        }

        if (returnObj.rejected_at != null) {
          dispatch({
            type: 'add',
            payload: {
              date: returnObj.rejected_at,
              message: (
                <>
                  {t('common.timeline.resources.return_number_was', {
                    number: returnObj.number
                  })}{' '}
                  <Text weight='bold'>
                    {t('common.timeline.resources.return_rejected')}
                  </Text>
                </>
              )
            }
          })
        }

        if (returnObj.received_at != null) {
          dispatch({
            type: 'add',
            payload: {
              date: returnObj.received_at,
              message: (
                <>
                  {t('common.timeline.resources.return_number_was', {
                    number: returnObj.number
                  })}{' '}
                  <Text weight='bold'>
                    {t('common.timeline.resources.return_received')}
                  </Text>
                </>
              )
            }
          })
        }
      })
    },
    [order.returns]
  )

  return [events, dispatch] as const
}
