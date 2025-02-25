import { ResourceShipmentParcels } from '#ui/resources/ResourceShipmentParcels'
import {
  shipmentHasBeenPurchased,
  shipmentWithCustomsInfo,
  shipmentWithMultipleParcelsMultipleTrackings,
  shipmentWithMultipleParcelsSingleTracking,
  shipmentWithSingleParcelSingleTracking,
  shipmentWithSingleParcelSingleTrackingNoCarrier,
  shipmentWithStatusDifferentFromPacking,
  shipmentWithoutParcels,
  shipmentWithoutTracking,
  shipmentWithoutTrackingDetails
} from '#ui/resources/ResourceShipmentParcels.mocks'
import { type Meta, type StoryFn } from '@storybook/react'
import { type JSX } from 'react'

const setup: Meta = {
  title: 'Resources/ResourceShipmentParcels',
  component: ResourceShipmentParcels,
  parameters: {
    layout: 'padded'
  }
}
export default setup

export const Default: StoryFn<typeof ResourceShipmentParcels> = (
  args
): JSX.Element => <ResourceShipmentParcels {...args} />
Default.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithoutTracking
}

/**
 * User can remove and re-create parcels only when the shipment is not yet purchased (`shipment.purchase_started_at == null`) and `shipment.status` is equal to `packing`.
 */
export const NoTracking: StoryFn<typeof ResourceShipmentParcels> = (
  args
): JSX.Element => <ResourceShipmentParcels {...args} />
NoTracking.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithoutTracking
}

/**
 * When the `shipment.status` is different from `packing`, the parcel cannot be removed anymore.
 */
export const StatusDifferentFromPacking: StoryFn<
  typeof ResourceShipmentParcels
> = (args): JSX.Element => <ResourceShipmentParcels {...args} />
StatusDifferentFromPacking.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithStatusDifferentFromPacking
}

/**
 * When the `shipment.purchase_started_at` is defined, the parcel cannot be removed anymore.
 */
export const ShipmentHasBeenPurchased: StoryFn<
  typeof ResourceShipmentParcels
> = (args): JSX.Element => <ResourceShipmentParcels {...args} />
ShipmentHasBeenPurchased.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentHasBeenPurchased
}

/**
 * When there's only one parcel, the tracking information are shown on the carrier section.
 */
export const SingleParcelSingleTracking: StoryFn<
  typeof ResourceShipmentParcels
> = (args): JSX.Element => <ResourceShipmentParcels {...args} />
SingleParcelSingleTracking.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithSingleParcelSingleTracking
}

/**
 * When there's only one parcel, but carrier information is missing. We show tracking information in the parcel box.
 */
export const SingleParcelSingleTrackingWithoutCarrier: StoryFn<
  typeof ResourceShipmentParcels
> = (args): JSX.Element => <ResourceShipmentParcels {...args} />
SingleParcelSingleTrackingWithoutCarrier.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithSingleParcelSingleTrackingNoCarrier
}

/**
 * When there are many parcels, but with only one tracking information (e.g. DHL), this is shown in the carrier section.
 */
export const MultipleParcelSingleTracking: StoryFn<
  typeof ResourceShipmentParcels
> = (args): JSX.Element => <ResourceShipmentParcels {...args} />
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
  typeof ResourceShipmentParcels
> = (args): JSX.Element => <ResourceShipmentParcels {...args} />
MultipleParcelsMultipleTrackings.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithMultipleParcelsMultipleTrackings
}

/**
 * A just-created tracking usually has a tracking number and the label, but the **tracking details array is empty**.
 */
export const NoTrackingDetails: StoryFn<typeof ResourceShipmentParcels> = (
  args
): JSX.Element => <ResourceShipmentParcels {...args} />
NoTrackingDetails.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithoutTrackingDetails
}

/**
 * We show customs info, separated by a dashed line, if the parcel has it.
 */
export const WithCustomsInfo: StoryFn<typeof ResourceShipmentParcels> = (
  args
): JSX.Element => <ResourceShipmentParcels {...args} />
WithCustomsInfo.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithCustomsInfo
}

/**
 * When there's no parcel, there's nothing to show.
 */
export const NoParcels: StoryFn<typeof ResourceShipmentParcels> = (
  args
): JSX.Element => <ResourceShipmentParcels {...args} />
NoParcels.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithoutParcels
}
