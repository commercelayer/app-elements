import { getOrderTransactionPastTense } from '#dictionaries/orders'
import { isAttachmentValidNote, referenceOrigins } from '#helpers/attachments'
import { useCoreApi, useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { useTokenProvider } from '#providers/TokenProvider'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Text } from '#ui/atoms/Text'
import { Timeline, type TimelineEvent } from '#ui/composite/Timeline'
import type { Attachment, Order } from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'
import {
  useCallback,
  useEffect,
  useReducer,
  useState,
  type Reducer
} from 'react'

export const OrderTimeline = withSkeletonTemplate<{
  orderId?: string
  refresh?: boolean
  attachmentOption?: {
    onMessage?: (attachment: Attachment) => void
    referenceOrigin:
      | typeof referenceOrigins.appOrdersNote
      | typeof referenceOrigins.appShipmentsNote
  }
}>(({ orderId, attachmentOption, refresh, isLoading: isExternalLoading }) => {
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
  const { user } = useTokenProvider()

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
})

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useTimelineReducer = (order: Order) => {
  const [orderId, setOrderId] = useState<string>(order.id)

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
    function addPlaced() {
      if (order.placed_at != null) {
        dispatch({
          type: 'add',
          payload: {
            date: order.placed_at,
            message: (
              <>
                Order was <Text weight='bold'>placed</Text>
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
                Order was <Text weight='bold'>cancelled</Text>
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
                Order was <Text weight='bold'>archived</Text>
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
                Order was <Text weight='bold'>approved</Text>
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
              Order was <Text weight='bold'>fulfilled</Text>
            </>
          ),
          in_progress: (
            <>
              Order fulfillment is <Text weight='bold'>in progress</Text>
            </>
          ),
          not_required: (
            <>
              Order fulfillment is <Text weight='bold'>not required</Text>
            </>
          ),
          unfulfilled: (
            <>
              Order is <Text weight='bold'>unfulfilled</Text>
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
          const name = getOrderTransactionPastTense(transaction.type)
          const isFailedCapture =
            transaction.type === 'captures' && !transaction.succeeded

          dispatch({
            type: 'add',
            payload: {
              date: transaction.created_at,
              message: isFailedCapture ? (
                <>
                  Payment capture of {transaction.formatted_amount}{' '}
                  <Text weight='bold'>failed</Text>
                </>
              ) : (
                <>
                  Payment of {transaction.formatted_amount} was{' '}
                  <Text weight='bold'>{name}</Text>
                </>
              ),
              note:
                isFailedCapture && transaction.message != null
                  ? transaction.message
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
                      ? 'left a refund note'
                      : 'left a note'}
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

  useEffect(
    function addShipments() {
      order.shipments?.forEach((shipment) => {
        dispatchAttachments(shipment.attachments)

        if (
          'on_hold_at' in shipment &&
          typeof shipment.on_hold_at === 'string'
        ) {
          dispatch({
            type: 'add',
            payload: {
              date: shipment.on_hold_at,
              message: (
                <>
                  Shipment #{shipment.number} is on{' '}
                  <Text weight='bold'>hold</Text>
                </>
              )
            }
          })
        }

        if (
          'picking_at' in shipment &&
          typeof shipment.picking_at === 'string'
        ) {
          dispatch({
            type: 'add',
            payload: {
              date: shipment.picking_at,
              message: (
                <>
                  Shipment #{shipment.number} was{' '}
                  <Text weight='bold'>picked</Text>
                </>
              )
            }
          })
        }

        if (
          'packing_at' in shipment &&
          typeof shipment.packing_at === 'string'
        ) {
          dispatch({
            type: 'add',
            payload: {
              date: shipment.packing_at,
              message: (
                <>
                  Shipment #{shipment.number} is being{' '}
                  <Text weight='bold'>packed</Text>
                </>
              )
            }
          })
        }

        if (
          'ready_to_ship_at' in shipment &&
          typeof shipment.ready_to_ship_at === 'string'
        ) {
          dispatch({
            type: 'add',
            payload: {
              date: shipment.ready_to_ship_at,
              message: (
                <>
                  Shipment #{shipment.number} is{' '}
                  <Text weight='bold'>ready for shipping</Text>
                </>
              )
            }
          })
        }

        if (
          'shipped_at' in shipment &&
          typeof shipment.shipped_at === 'string'
        ) {
          dispatch({
            type: 'add',
            payload: {
              date: shipment.shipped_at,
              message: (
                <>
                  Shipment #{shipment.number} was{' '}
                  <Text weight='bold'>shipped</Text>
                </>
              )
            }
          })
        }
      })
    },
    [order.shipments]
  )

  return [events, dispatch] as const
}

OrderTimeline.displayName = 'OrderTimeline'
