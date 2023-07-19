import { isAttachmentValidNote, referenceOrigins } from '#helpers/attachments'
import type { Attachment, Order } from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'
import { useEffect, useReducer, type Reducer } from 'react'
import {
  Timeline,
  getOrderTransactionPastTense,
  useCoreApi,
  useCoreSdkProvider,
  useTokenProvider,
  withSkeletonTemplate,
  type TimelineEvent
} from '../../main'

export const OrderTimeline = withSkeletonTemplate<{
  orderId: string
  attachmentOption?: {
    onMessage?: (attachment: Attachment) => void
    referenceOrigin:
      | typeof referenceOrigins.appOrdersNote
      | typeof referenceOrigins.appShipmentsNote
  }
}>(({ orderId, attachmentOption, isLoading: isExternalLoading }) => {
  const { data: order, isLoading } = useCoreApi(
    'orders',
    'retrieve',
    [
      orderId,
      {
        include: [
          'shipments',
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
        id: 'fake-NMWYhbGorj',
        status: 'approved',
        payment_status: 'paid',
        fulfillment_status: 'in_progress',
        created_at: '2023-05-16T11:06:02.074Z',
        updated_at: '2023-05-16T14:18:35.572Z',
        placed_at: '2023-05-16T11:06:22.012Z',
        approved_at: '2023-05-16T14:18:16.775Z',
        fulfillment_updated_at: '2023-05-16T14:18:35.411Z'
      } satisfies Order
    }
  )

  const [events] = useTimelineReducer(order)
  const { sdkClient } = useCoreSdkProvider()
  const { user } = useTokenProvider()

  return (
    <Timeline
      isLoading={isExternalLoading === true || isLoading}
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
  const [events, dispatch] = useReducer<
    Reducer<
      TimelineEvent[],
      {
        type: 'add'
        payload: TimelineEvent
      }
    >
  >((state, action) => {
    switch (action.type) {
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
    function addPlaced() {
      if (order.placed_at != null) {
        dispatch({
          type: 'add',
          payload: {
            date: order.placed_at,
            message: 'Placed'
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
            message: 'Cancelled'
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
            message: 'Archived'
          }
        })
      }
    },
    [order.archived_at]
  )

  useEffect(
    function addFulfillmentStatus() {
      if (
        order.fulfillment_updated_at != null &&
        order.fulfillment_status !== 'unfulfilled'
      ) {
        const messages: Record<Order['fulfillment_status'], string> = {
          fulfilled: 'Fulfilled',
          in_progress: 'Fulfillment in progress',
          not_required: 'Fulfillment not required',
          unfulfilled: 'Unfulfilled'
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
              message: isFailedCapture
                ? `Failed capture`
                : `Payment of ${transaction.formatted_amount} ${name}`,
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

  useEffect(
    function addAttachments() {
      if (order.attachments != null) {
        order.attachments.forEach((attachment) => {
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
                message: (
                  <span>
                    <b>{attachment.name}</b>{' '}
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
    [order.attachments]
  )

  useEffect(
    function addApproved() {
      if (order.approved_at != null) {
        dispatch({
          type: 'add',
          payload: {
            date: order.approved_at,
            message: 'Approved'
          }
        })
      }
    },
    [order.approved_at]
  )

  return [events, dispatch] as const
}

OrderTimeline.displayName = 'OrderTimeline'
