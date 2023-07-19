import { type Attachment } from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'
import { type SetNonNullable, type SetRequired } from 'type-fest'

export const referenceOrigins = {
  appOrdersNote: 'app-orders--note',
  appOrdersRefundNote: 'app-orders--refund-note',
  appShipmentsNote: 'app-shipments--note'
} as const

export function isAttachmentValidNote(
  attachment: Attachment,
  validReferenceOrigins: Array<
    (typeof referenceOrigins)[keyof typeof referenceOrigins]
  >
): attachment is SetNonNullable<
  SetRequired<Attachment, 'description' | 'reference_origin'>,
  'description' | 'reference_origin'
> {
  if (
    attachment.reference_origin == null ||
    isEmpty(attachment.reference_origin)
  ) {
    return false
  }

  return (
    validReferenceOrigins.includes(attachment.reference_origin as any) &&
    attachment.description != null
  )
}
