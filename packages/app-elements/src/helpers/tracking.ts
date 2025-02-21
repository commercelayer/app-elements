import { type AvatarProps } from '#ui/atoms/Avatar'
import { type Parcel, type Shipment } from '@commercelayer/sdk'
import orderBy from 'lodash-es/orderBy'
import { type SetNonNullable } from 'type-fest'
import { z } from 'zod'

export function getAvatarSrcFromRate(rate: Rate): AvatarProps['src'] {
  switch (rate.carrier) {
    case 'DHLEcommerceAsia':
    case 'DhlEcs':
    case 'DHLExpress':
    case 'DHLPaket':
    case 'DHLSmartmail':
      return 'carriers:dhl'
    case 'FedEx':
    case 'FedExCrossBorder':
    case 'FedExMailview':
    case 'FedexSmartPost':
      return 'carriers:fedex'
    case 'UPS':
    case 'UPSIparcel':
    case 'UPSMailInnovations':
      return 'carriers:ups'
    default:
      return 'carriers:generic'
  }
}

/**
 * Get tracking details descending sorted from a parcel.
 */
export function getParcelTrackingDetails(parcel?: Parcel): TrackingDetail[] {
  const details = parcelTrackingDetailsSchema.safeParse(
    parcel?.tracking_details
  )

  if (!details.success) {
    return []
  }

  return orderBy(details.data, ['datetime'], ['desc'])
}

/**
 * Get latest tracking details from a parcel.
 */
export function getParcelTrackingDetail(
  parcel?: Parcel
): TrackingDetail | undefined {
  return getParcelTrackingDetails(parcel)[0]
}

/**
 * Get all available rates.
 */
export function getShipmentRates(shipment: Shipment): Rate[] {
  const rates = shipmentRatesSchema.safeParse(shipment.rates)

  if (!rates.success) {
    return []
  }

  return rates.data
}

/**
 * Get selected shipment rate if any.
 */
export function getShipmentRate(shipment: Shipment): Rate | undefined {
  const rate = getShipmentRates(shipment)

  return rate.find((rate) => rate.id === shipment.selected_rate_id)
}

/**
 * Check whether the `shipment` has just one tracking number.
 * @param shipment Shipment
 */
export function hasSingleTracking(shipment: Shipment): boolean {
  return (
    shipment.parcels?.length === 1 ||
    shipment.parcels?.find((parcel) => parcel.tracking_number == null) != null
  )
}

/**
 * Check whether the `shipment` has been purchased.
 * @param shipment Shipment
 */
export function hasBeenPurchased(shipment: Shipment): boolean {
  return shipment.purchase_started_at != null
}

/**
 * @docs https://www.easypost.com/docs/api#tracking-detail-object
 */
const trackingDetailSchema = z.object({
  /** "TrackingDetail" */
  object: z.literal('TrackingDetail'),
  /** Description of the scan event */
  message: z.string().nullable(),
  /** Status of the package at the time of the scan event, possible values are "unknown", "pre_transit", "in_transit", "out_for_delivery", "delivered", "available_for_pickup", "return_to_sender", "failure", "cancelled" or "error" */
  status: z.string().nullable(),
  /** Additional details about the current status, possible values are "unknown", "status_update", "departed_facility", "arrived_at_facility", "out_for_delivery", "arrived_at_destination" */
  status_detail: z.string().nullable(),
  /** The timestamp when the tracking scan occurred */
  datetime: z.string().nullable(),
  /** The original source of the information for this scan event, usually the carrier */
  source: z.string().nullable(),
  /** The location associated with the scan event */
  tracking_location: z
    .object({
      /** "TrackingLocation" */
      object: z.literal('TrackingLocation'),
      /** The city where the scan event occurred (if available) */
      city: z.string().nullable(),
      /** The state where the scan event occurred (if available) */
      state: z.string().nullable(),
      /** The country where the scan event occurred (if available) */
      country: z.string().nullable(),
      /** The postal code where the scan event occurred (if available) */
      zip: z.string().nullable()
    })
    .transform((loc) =>
      loc.city != null ? (loc as SetNonNullable<typeof loc, 'city'>) : null
    ),
  description: z.string().nullable(),
  carrier_code: z.string().nullable()
})

/**
 * @docs https://www.easypost.com/docs/api#rates
 */
const rateSchema = z.object({
  /** unique, begins with 'rate_' */
  id: z.string(),
  /** "test" or "production" */
  mode: z.literal('test').or(z.literal('production')),
  /** service level/name @docs https://www.easypost.com/docs/api#service-levels */
  service: z.string(),
  /** name of carrier */
  carrier: z.string(),
  /** ID of the CarrierAccount record used to generate this rate */
  carrier_account_id: z.string(),
  /** ID of the Shipment this rate belongs to */
  shipment_id: z.string(),
  /** the actual rate quote for this service */
  rate: z.number(),
  /** currency for the rate */
  currency: z.string(),
  /** delivery days for this service */
  delivery_days: z.number().optional(),
  /** date for delivery */
  delivery_date: z.string().optional(),
  /** *This field is deprecated and should be ignored. @deprecated */
  est_delivery_days: z.number().optional(),
  /** formatted date for delivery */
  formatted_delivery_date: z.string().optional(),
  /** the actual formatted rate quote for this service */
  formatted_rate: z.string()
})

const parcelTrackingDetailsSchema = z.array(trackingDetailSchema)
const shipmentRatesSchema = z.array(rateSchema)

export type TrackingDetail = z.infer<typeof trackingDetailSchema>
export type Rate = z.infer<typeof rateSchema>
