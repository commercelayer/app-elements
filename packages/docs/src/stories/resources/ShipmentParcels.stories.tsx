import { ShipmentParcels } from '#ui/resources/ShipmentParcels'
import {
  shipmentWithMultipleParcelsMultipleTrackings,
  shipmentWithMultipleParcelsSingleTracking,
  shipmentWithSingleParcelSingleTracking,
  shipmentWithoutParcels,
  shipmentWithoutTracking
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

export const NoTracking: StoryFn<typeof ShipmentParcels> = (
  args
): JSX.Element => <ShipmentParcels {...args} />
NoTracking.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithoutTracking
}

export const SingleParcelSingleTracking: StoryFn<typeof ShipmentParcels> = (
  args
): JSX.Element => <ShipmentParcels {...args} />
SingleParcelSingleTracking.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithSingleParcelSingleTracking
}

export const MultipleParcelSingleTracking: StoryFn<typeof ShipmentParcels> = (
  args
): JSX.Element => <ShipmentParcels {...args} />
MultipleParcelSingleTracking.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithMultipleParcelsSingleTracking
}

export const MultipleParcelsMultipleTrackings: StoryFn<
  typeof ShipmentParcels
> = (args): JSX.Element => <ShipmentParcels {...args} />
MultipleParcelsMultipleTrackings.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithMultipleParcelsMultipleTrackings
}

export const NoParcels: StoryFn<typeof ShipmentParcels> = (
  args
): JSX.Element => <ShipmentParcels {...args} />
NoParcels.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithoutParcels
}
