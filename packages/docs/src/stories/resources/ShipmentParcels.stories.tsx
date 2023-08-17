import { ShipmentParcels } from '#ui/resources/ShipmentParcels'
import {
  shipmentHasBeenPurchased,
  shipmentWithMultipleParcelsMultipleTrackings,
  shipmentWithMultipleParcelsSingleTracking,
  shipmentWithSingleParcelSingleTracking,
  shipmentWithStatusDifferentFromPacking,
  shipmentWithoutParcels,
  shipmentWithoutTracking,
  shipmentWithoutTrackingDetails
} from '#ui/resources/ShipmentParcels.mocks'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta = {
  title: 'Resources/Shipment Parcels',
  component: ShipmentParcels,
  parameters: {
    layout: 'padded'
  }
}
export default setup

/**
 * User can remove and re-create parcels only when the shipment is not yet purchased (`shipment.purchase_started_at == null`) and `shipment.status` is equal to `packing`.
 */
export const NoTracking: StoryFn<typeof ShipmentParcels> = (
  args
): JSX.Element => <ShipmentParcels {...args} />
NoTracking.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithoutTracking
}

/**
 * When the `shipment.status` is different from `packing`, the parcel cannot be removed anymore.
 */
export const StatusDifferentFromPacking: StoryFn<typeof ShipmentParcels> = (
  args
): JSX.Element => <ShipmentParcels {...args} />
StatusDifferentFromPacking.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithStatusDifferentFromPacking
}

/**
 * When the `shipment.purchase_started_at` is defined, the parcel cannot be removed anymore.
 */
export const ShipmentHasBeenPurchased: StoryFn<typeof ShipmentParcels> = (
  args
): JSX.Element => <ShipmentParcels {...args} />
ShipmentHasBeenPurchased.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentHasBeenPurchased
}

/**
 * When there's only one parcel, the tracking information are shown on the carrier section.
 */
export const SingleParcelSingleTracking: StoryFn<typeof ShipmentParcels> = (
  args
): JSX.Element => <ShipmentParcels {...args} />
SingleParcelSingleTracking.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithSingleParcelSingleTracking
}

/**
 * When there are many parcels, but with only one tracking information (e.g. DHL), this is shown in the carrier section.
 */
export const MultipleParcelSingleTracking: StoryFn<typeof ShipmentParcels> = (
  args
): JSX.Element => <ShipmentParcels {...args} />
MultipleParcelSingleTracking.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithMultipleParcelsSingleTracking
}

/**
 * When there are many parcels, and each one has its own tracking information, these are shown on each parcel.
 */
export const MultipleParcelsMultipleTrackings: StoryFn<
  typeof ShipmentParcels
> = (args): JSX.Element => <ShipmentParcels {...args} />
MultipleParcelsMultipleTrackings.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithMultipleParcelsMultipleTrackings
}

/**
 * A just-created tracking usually has a tracking number and the label, but the **tracking details array is empty**.
 */
export const NoTrackingDetails: StoryFn<typeof ShipmentParcels> = (
  args
): JSX.Element => <ShipmentParcels {...args} />
NoTrackingDetails.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithoutTrackingDetails
}

/**
 * When there's no parcel, there's nothing to show.
 */
export const NoParcels: StoryFn<typeof ShipmentParcels> = (
  args
): JSX.Element => <ShipmentParcels {...args} />
NoParcels.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithoutParcels
}
