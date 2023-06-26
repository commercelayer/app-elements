import { ShipmentParcels } from '#ui/resources/ShipmentParcels'
import {
  shipmentWithMultipleTracking,
  shipmentWithSingleTracking,
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

export const SingleTracking: StoryFn<typeof ShipmentParcels> = (
  args
): JSX.Element => <ShipmentParcels {...args} />
SingleTracking.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithSingleTracking
}

export const MultipleTrackings: StoryFn<typeof ShipmentParcels> = (
  args
): JSX.Element => <ShipmentParcels {...args} />
MultipleTrackings.args = {
  onRemoveParcel: function (parcelId) {
    alert(`removed parcel "${parcelId}"`)
  },
  shipment: shipmentWithMultipleTracking
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
