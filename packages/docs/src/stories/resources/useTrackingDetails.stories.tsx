import type { Meta, StoryFn } from "@storybook/react-vite"
import type { JSX } from "react"
import { getShipmentRate } from "#helpers/tracking"
import { Button } from "#ui/atoms/Button"
import {
  parcelWithTracking1,
  shipmentWithSingleParcelSingleTracking,
} from "#ui/resources/ResourceShipmentParcels.mocks"
import { useTrackingDetails } from "#ui/resources/useTrackingDetails"

const setup: Meta = {
  title: "Resources/useTrackingDetails",
  parameters: {
    layout: "padded",
  },
}
export default setup

/**
 * Click the button to open the tracking details modal. Shows full tracking history with carrier info.
 */
export const Default: StoryFn = (): JSX.Element => {
  const rate = getShipmentRate(shipmentWithSingleParcelSingleTracking)
  const { TrackingDetailsModal, openTrackingDetails } = useTrackingDetails(
    parcelWithTracking1,
    rate,
  )

  return (
    <div>
      <TrackingDetailsModal />
      <Button onClick={openTrackingDetails}>Track shipment</Button>
    </div>
  )
}
