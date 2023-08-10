import { render, within } from '@testing-library/react'
import { ShipmentParcels } from './ShipmentParcels'
import {
  shipmentWithMultipleParcelsMultipleTrackings,
  shipmentWithMultipleParcelsSingleTracking,
  shipmentWithSingleParcelSingleTracking,
  shipmentWithoutParcels,
  shipmentWithoutTracking
} from './ShipmentParcels.mocks'

function getValueByDetailName(
  withinNode: HTMLElement,
  text: string
): ChildNode | null | undefined {
  return within(withinNode).getByText(text).parentNode?.nextSibling
}

describe('ShipmentParcels', () => {
  it('Should not be rendered when no parcels', () => {
    const { getByTestId } = render(
      <ShipmentParcels shipment={shipmentWithoutParcels} />
    )

    const shipmentParcels = getByTestId(
      'shipment-parcels-shipment-without-parcels'
    )

    expect(shipmentParcels).toBeVisible()
    expect(shipmentParcels.children.length).toEqual(0)
  })

  it('Should be rendered without tracking information', () => {
    const { getByTestId } = render(
      <ShipmentParcels shipment={shipmentWithoutTracking} />
    )

    const shipmentParcels = getByTestId(
      'shipment-parcels-shipment-without-tracking'
    )

    expect(shipmentParcels).toBeVisible()
    expect(shipmentParcels.children.length).toEqual(2)

    expect(() => getByTestId('carrier-box-shipment-without-tracking')).toThrow()
    expect(getByTestId('parcel-box-parcel-without-tracking-1')).toBeVisible()
    expect(getByTestId('parcel-box-parcel-without-tracking-2')).toBeVisible()
  })

  it('Should be rendered with a single parcel and a single tracking information', () => {
    const { getByTestId } = render(
      <ShipmentParcels shipment={shipmentWithSingleParcelSingleTracking} />
    )

    const shipmentParcels = getByTestId(
      'shipment-parcels-shipment-with-single-parcel-single-tracking'
    )

    expect(shipmentParcels).toBeVisible()
    expect(shipmentParcels.children.length).toEqual(2)

    const carrierBox = getByTestId(
      'carrier-box-shipment-with-single-parcel-single-tracking'
    )
    const parcelBox1 = getByTestId('parcel-box-parcel-with-tracking-1')

    expect(carrierBox).toBeVisible()
    expect(parcelBox1).toBeVisible()

    expect(carrierBox).toHaveTextContent('€89,01')
    expect(getValueByDetailName(carrierBox, 'Status')).toHaveTextContent(
      'delivered'
    )
    expect(getValueByDetailName(carrierBox, 'Tracking')).toHaveTextContent(
      '42314321ASD4545'
    )
    expect(
      getValueByDetailName(carrierBox, 'Estimated delivery')
    ).toHaveTextContent('Jun 23, 2023 12:00 AM')

    expect(() => getValueByDetailName(parcelBox1, 'Status')).toThrow()
    expect(() => getValueByDetailName(parcelBox1, 'Tracking')).toThrow()
    expect(() =>
      getValueByDetailName(parcelBox1, 'Estimated delivery')
    ).toThrow()
  })

  it('Should be rendered with multiple parcels and a single tracking information', () => {
    const { getByTestId } = render(
      <ShipmentParcels shipment={shipmentWithMultipleParcelsSingleTracking} />
    )

    const shipmentParcels = getByTestId(
      'shipment-parcels-shipment-with-multiple-parcels-single-tracking'
    )

    expect(shipmentParcels).toBeVisible()
    expect(shipmentParcels.children.length).toEqual(3)

    const carrierBox = getByTestId(
      'carrier-box-shipment-with-multiple-parcels-single-tracking'
    )
    const parcelBox1 = getByTestId('parcel-box-parcel-with-tracking-1')
    const parcelBox2 = getByTestId('parcel-box-parcel-without-tracking-1')

    expect(carrierBox).toBeVisible()
    expect(parcelBox1).toBeVisible()
    expect(parcelBox2).toBeVisible()

    expect(carrierBox).toHaveTextContent('€89,01')
    expect(getValueByDetailName(carrierBox, 'Status')).toHaveTextContent(
      'delivered'
    )
    expect(getValueByDetailName(carrierBox, 'Tracking')).toHaveTextContent(
      '42314321ASD4545'
    )
    expect(
      getValueByDetailName(carrierBox, 'Estimated delivery')
    ).toHaveTextContent('Jun 23, 2023 12:00 AM')

    expect(() => getValueByDetailName(parcelBox1, 'Status')).toThrow()
    expect(() => getValueByDetailName(parcelBox2, 'Status')).toThrow()
    expect(() => getValueByDetailName(parcelBox1, 'Tracking')).toThrow()
    expect(() => getValueByDetailName(parcelBox2, 'Tracking')).toThrow()
    expect(() =>
      getValueByDetailName(parcelBox1, 'Estimated delivery')
    ).toThrow()
    expect(() =>
      getValueByDetailName(parcelBox2, 'Estimated delivery')
    ).toThrow()
  })

  it('Should be rendered with multiple parcels and multiple tracking information', () => {
    const { getByTestId } = render(
      <ShipmentParcels
        shipment={shipmentWithMultipleParcelsMultipleTrackings}
      />
    )

    const shipmentParcels = getByTestId(
      'shipment-parcels-shipment-with-multiple-parcels-multiple-trackings'
    )

    expect(shipmentParcels).toBeVisible()
    expect(shipmentParcels.children.length).toEqual(3)

    const carrierBox = getByTestId(
      'carrier-box-shipment-with-multiple-parcels-multiple-trackings'
    )
    const parcelBox1 = getByTestId('parcel-box-parcel-with-tracking-1')
    const parcelBox2 = getByTestId('parcel-box-parcel-with-tracking-2')

    expect(carrierBox).toBeVisible()
    expect(parcelBox1).toBeVisible()
    expect(parcelBox2).toBeVisible()

    expect(carrierBox).toHaveTextContent('€12,00')

    expect(() => getValueByDetailName(carrierBox, 'Status')).toThrow()
    expect(() => getValueByDetailName(carrierBox, 'Tracking')).toThrow()
    expect(() =>
      getValueByDetailName(carrierBox, 'Estimated delivery')
    ).toThrow()

    expect(getValueByDetailName(parcelBox1, 'Status')).toHaveTextContent(
      'delivered'
    )
    expect(getValueByDetailName(parcelBox2, 'Status')).toHaveTextContent(
      'in_transit'
    )
    expect(getValueByDetailName(parcelBox1, 'Tracking')).toHaveTextContent(
      '42314321ASD4545'
    )
    expect(getValueByDetailName(parcelBox2, 'Tracking')).toHaveTextContent(
      '65345234RWQ1111'
    )
    expect(
      getValueByDetailName(parcelBox1, 'Estimated delivery')
    ).toHaveTextContent('Jun 23, 2023 12:00 AM')
    expect(
      getValueByDetailName(parcelBox2, 'Estimated delivery')
    ).toHaveTextContent('Jun 23, 2023 12:00 AM')
  })
})
