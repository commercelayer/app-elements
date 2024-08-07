import { type ResourceShipmentParcels } from '#ui/resources/ResourceShipmentParcels'
import { type Attachment } from '@commercelayer/sdk'

type Shipment = Parameters<typeof ResourceShipmentParcels>[0]['shipment']
type Parcel = NonNullable<Shipment['parcels']>[number]
type Package = NonNullable<Parcel['package']>
type ParcelLineItems = NonNullable<Parcel['parcel_line_items']>[number]

function createParcelPackage({ name }: { name: string }): Package {
  return {
    type: 'packages',
    created_at: '',
    updated_at: '',
    id: name,
    height: 3,
    length: 3,
    unit_of_length: '',
    width: 3,
    name
  }
}

function createParcelLineItems({
  name,
  code,
  quantity
}: {
  name: string
  code: string
  quantity: number
}): ParcelLineItems {
  return {
    type: 'parcel_line_items',
    id: code,
    created_at: '',
    updated_at: '',
    name,
    quantity,
    sku_code: code,
    image_url:
      code === 'POLOMXXXFFFFFF000000SXXX'
        ? null
        : `https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/${code}_FLAT.png`
  }
}

function createParcel({
  id,
  weight,
  lineItems,
  package: pkg,
  shippingLabelUrl,
  trackingDetails,
  trackingNumber,
  attachments
}: {
  id: string
  weight: number
  lineItems: Array<Parameters<typeof createParcelLineItems>[number]>
  package: Parameters<typeof createParcelPackage>[number]
  shippingLabelUrl?: string
  trackingDetails?: Array<Record<string, any>>
  trackingNumber?: string
  attachments?: Attachment[]
}): Parcel {
  return {
    type: 'parcels',
    id,
    created_at: '',
    updated_at: '',
    unit_of_weight: 'gr',
    weight,
    parcel_line_items: lineItems.map(createParcelLineItems),
    package: createParcelPackage(pkg),
    tracking_details: trackingDetails,
    tracking_number: trackingNumber,
    shipping_label_url: shippingLabelUrl,
    attachments
  }
}

function createShipment({
  id,
  status,
  purchaseStartedAt,
  parcels,
  rates,
  selectedRateId
}: {
  id: string
  status: Shipment['status']
  purchaseStartedAt?: string | undefined | null
  parcels: Parcel[]
  rates?: Array<Record<string, any>>
  selectedRateId?: 'rate_dhl_1111' | 'rate_fedex_1111'
}): Shipment {
  return {
    type: 'shipments',
    number: '#1234/S/001',
    id,
    created_at: '',
    updated_at: '',
    status,
    purchase_started_at: purchaseStartedAt,
    parcels,
    rates,
    selected_rate_id: selectedRateId
  }
}

export const parcelWithoutTracking1 = createParcel({
  id: 'parcel-without-tracking-1',
  weight: 300,
  package: {
    name: 'Large Box #1'
  },
  lineItems: [
    {
      code: 'BACKPACK818488000000XXXX',
      name: 'Gray Backpack with Black Logo',
      quantity: 1
    },
    {
      code: 'POLOMXXXFFFFFF000000SXXX',
      name: 'White Men Polo with Black Logo (S)',
      quantity: 2
    }
  ]
})

export const parcelWithoutTracking2 = createParcel({
  id: 'parcel-without-tracking-2',
  weight: 120,
  package: {
    name: 'Standard Box #1'
  },
  lineItems: [
    {
      code: 'CUFFBEANA6A5A0000000XXXX',
      name: 'Gray Cuffed Beanie with Black Logo',
      quantity: 1
    }
  ]
})

export const parcelWithTracking1 = createParcel({
  id: 'parcel-with-tracking-1',
  weight: 80,
  package: {
    name: 'Standard Box #1'
  },
  lineItems: [
    {
      code: 'BASEBHAT000000FFFFFFXXXX',
      name: 'Black Baseball Hat with White Logo',
      quantity: 1
    }
  ],
  shippingLabelUrl: 'https://example.com',
  trackingDetails: [
    {
      object: 'TrackingDetail',
      source: 'UPS',
      status: 'delivered',
      message: 'Delivered: Mailbox',
      datetime: '2022-06-28T13:17:18Z',
      description: 'Delivered',
      carrier_code: 'D',
      status_detail: 'arrived_at_destination',
      tracking_location: {
        zip: '89520',
        city: 'Heidenheim',
        state: null,
        object: 'TrackingLocation',
        country: 'DE'
      }
    },
    {
      object: 'TrackingDetail',
      source: 'UPS',
      status: 'out_for_delivery',
      message: 'Out For Delivery',
      datetime: '2022-06-28T03:45:00Z',
      description: 'Out For Delivery',
      carrier_code: 'I',
      status_detail: 'out_for_delivery',
      tracking_location: {
        zip: null,
        city: 'Ulm',
        state: null,
        object: 'TrackingLocation',
        country: 'DE'
      }
    }
  ],
  trackingNumber: '42314321ASD4545'
})

export const parcelWithTracking2 = createParcel({
  id: 'parcel-with-tracking-1',
  weight: 80,
  package: {
    name: 'Standard Box #1'
  },
  lineItems: [
    {
      code: 'BASEBHAT000000FFFFFFXXXX',
      name: 'Black Baseball Hat with White Logo',
      quantity: 1
    }
  ],
  shippingLabelUrl: 'https://example.com',
  trackingDetails: [
    {
      object: 'TrackingDetail',
      source: 'UPS',
      status: 'delivered',
      message: 'Delivered: Mailbox',
      datetime: '2022-06-28T13:17:18Z',
      description: 'Delivered',
      carrier_code: 'D',
      status_detail: 'arrived_at_destination',
      tracking_location: {
        zip: '89520',
        city: 'Heidenheim',
        state: null,
        object: 'TrackingLocation',
        country: 'DE'
      }
    },
    {
      object: 'TrackingDetail',
      source: 'UPS',
      status: 'out_for_delivery',
      message: 'Out For Delivery',
      datetime: '2022-06-28T03:45:00Z',
      description: 'Out For Delivery',
      carrier_code: 'I',
      status_detail: 'out_for_delivery',
      tracking_location: {
        zip: null,
        city: 'Ulm',
        state: null,
        object: 'TrackingLocation',
        country: 'DE'
      }
    }
  ],
  trackingNumber: '43769811RQC9900',
  attachments: [
    // return label generated by easypost and saved as attachment
    {
      type: 'attachments',
      id: 'attachment-1',
      created_at: '2024-04-22T09:32:20.213Z',
      updated_at: '2024-04-22T09:32:20.213Z',
      name: 'Return Label',
      description: '4/22/2024, 9:32:20 AM',
      url: 'https://pdfobject.com/pdf/sample.pdf'
    }
  ]
})

export const parcelWithTracking3 = createParcel({
  id: 'parcel-with-tracking-2',
  weight: 400,
  package: {
    name: 'Standard Box #1'
  },
  lineItems: [
    {
      code: 'BOTT17OZFFFFFF000000XXXX',
      name: 'White Water Bottle with Black Logo',
      quantity: 3
    }
  ],
  shippingLabelUrl: 'https://example.com',
  trackingDetails: [
    {
      object: 'TrackingDetail',
      source: 'UPS',
      status: 'pre_transit',
      message: 'Shipper created a label, UPS has not received the package yet.',
      datetime: '2022-06-24T10:21:40Z',
      description:
        'Shipper created a label, UPS has not received the package yet.',
      carrier_code: 'M',
      status_detail: 'label_created',
      tracking_location: {
        zip: null,
        city: null,
        state: null,
        object: 'TrackingLocation',
        country: 'IT'
      }
    },
    {
      object: 'TrackingDetail',
      source: 'UPS',
      status: 'in_transit',
      message: 'Pickup Scan',
      datetime: '2022-06-24T15:59:42Z',
      description: 'Pickup Scan',
      carrier_code: 'P',
      status_detail: 'unknown',
      tracking_location: {
        zip: null,
        city: 'Prato',
        state: null,
        object: 'TrackingLocation',
        country: 'IT'
      }
    }
  ],
  trackingNumber: '65345234RWQ1111',
  attachments: [
    {
      type: 'attachments',
      id: 'attachment-1',
      created_at: '2024-04-22T09:32:20.213Z',
      updated_at: '2024-04-22T09:32:20.213Z',
      name: 'Return Label',
      description: '4/22/2024, 9:32:20 AM',
      url: 'https://pdfobject.com/pdf/sample.pdf'
    },
    {
      type: 'attachments',
      id: 'attachment-2',
      created_at: '2024-04-22T09:32:20.213Z',
      updated_at: '2024-04-22T09:32:20.213Z',
      name: 'Something else',
      description: 'lorem ipsum'
    },
    {
      type: 'attachments',
      id: 'attachment-3',
      created_at: '2024-04-22T09:32:20.213Z',
      updated_at: '2024-04-22T09:32:20.213Z',
      name: 'Another label',
      description: 'lorem ipsum',
      url: 'https://pdfobject.com/pdf/sample.pdf'
    }
  ]
})

export const parcelWithoutTrackingDetails1 = createParcel({
  id: 'parcel-without-tracking-details-1',
  weight: 80,
  package: {
    name: 'Standard Box #1'
  },
  lineItems: [
    {
      code: 'BASEBHAT000000FFFFFFXXXX',
      name: 'Black Baseball Hat with White Logo',
      quantity: 1
    }
  ],
  shippingLabelUrl: 'https://example.com',
  trackingDetails: [],
  trackingNumber: '12314321ASD1111'
})

export const parcelWithCustomsInfo: Parcel = {
  ...parcelWithTracking1,
  id: 'parcel-with-customs-info',
  incoterm: 'DDP',
  delivery_confirmation: 'signature',
  eel_pfc: 'NOEEI_30_37_a',
  contents_type: 'other',
  contents_explanation: 'T-shirts, books and other stuff',
  non_delivery_option: 'abandon',
  restriction_type: 'other',
  restriction_comments: 'please do not bend',
  customs_signer: 'John Doe',
  customs_certify: true,
  customs_info_required: true
}

const rates = [
  {
    id: 'rate_dhl_1111',
    carrier: 'DHLExpress',
    service: 'ExpressEasy',
    carrier_account_id: 'ca_6ac8fb85aa314abb87c3154ae4c87244',
    currency: 'EUR',
    rate: 89.01,
    formatted_rate: '€89,01',
    delivery_date: '2023-06-23T00:00:00Z',
    formatted_delivery_date: 'Jun 23, 2023 12:00 AM',
    delivery_days: 1,
    est_delivery_days: 1,
    shipment_id: 'shp_ffe1e130e0694ad9a41935fc56c4b6b4',
    mode: 'test'
  },
  {
    id: 'rate_4eebeace124242e3b1e66f282ae5885f',
    carrier: 'DHLExpress',
    service: 'EuroPack',
    carrier_account_id: 'ca_6ac8fb85aa314abb87c3154ae4c87244',
    currency: 'EUR',
    rate: 92.6,
    formatted_rate: '€92,60',
    delivery_date: '2023-06-26T00:00:00Z',
    formatted_delivery_date: 'Jun 26, 2023 12:00 AM',
    delivery_days: 2,
    est_delivery_days: 2,
    shipment_id: 'shp_ffe1e130e0694ad9a41935fc56c4b6b4',
    mode: 'test'
  },
  {
    id: 'rate_fedex_1111',
    carrier: 'FedEx',
    service: 'ExpressPro',
    carrier_account_id: 'ca_6ac8fb85aa314abb87c3154ae4c87244',
    currency: 'EUR',
    rate: 12.0,
    formatted_rate: '€12,00',
    delivery_date: '2023-06-23T00:00:00Z',
    formatted_delivery_date: 'Jun 23, 2023 12:00 AM',
    delivery_days: 1,
    est_delivery_days: 1,
    shipment_id: 'shp_ffe1e130e0694ad9a41935fc56c4b6b4',
    mode: 'test'
  }
]

export const shipmentWithoutTracking = createShipment({
  id: 'shipment-without-tracking',
  status: 'packing',
  parcels: [parcelWithoutTracking1, parcelWithoutTracking2]
})

export const shipmentWithStatusDifferentFromPacking = createShipment({
  id: 'shipment-with-status-not-packing',
  status: 'ready_to_ship',
  parcels: [parcelWithoutTracking1, parcelWithoutTracking2]
})

export const shipmentHasBeenPurchased = createShipment({
  id: 'shipment-with-status-not-packing',
  status: 'packing',
  purchaseStartedAt: '2023-07-11',
  parcels: [parcelWithoutTracking1, parcelWithoutTracking2]
})

export const shipmentWithSingleParcelSingleTracking = createShipment({
  id: 'shipment-with-single-parcel-single-tracking',
  status: 'packing',
  purchaseStartedAt: '2023-07-11',
  rates,
  selectedRateId: 'rate_dhl_1111',
  parcels: [parcelWithTracking1]
})

export const shipmentWithSingleParcelSingleTrackingNoCarrier = createShipment({
  id: 'shipment-with-single-parcel-single-tracking',
  status: 'packing',
  purchaseStartedAt: '2023-07-11',
  selectedRateId: 'rate_dhl_1111',
  parcels: [
    {
      ...parcelWithTracking1,
      tracking_details: [],
      tracking_status: 'delivered'
    }
  ]
})

export const shipmentWithMultipleParcelsSingleTracking = createShipment({
  id: 'shipment-with-multiple-parcels-single-tracking',
  status: 'packing',
  purchaseStartedAt: '2023-07-11',
  rates,
  selectedRateId: 'rate_dhl_1111',
  parcels: [parcelWithTracking1, parcelWithoutTracking1]
})

export const shipmentWithMultipleParcelsMultipleTrackings = createShipment({
  id: 'shipment-with-multiple-parcels-multiple-trackings',
  status: 'packing',
  purchaseStartedAt: '2023-07-11',
  rates,
  selectedRateId: 'rate_fedex_1111',
  parcels: [parcelWithTracking2, parcelWithTracking3]
})

export const shipmentWithoutTrackingDetails = createShipment({
  id: 'shipment-without-tracking-details',
  status: 'packing',
  purchaseStartedAt: '2023-07-11',
  rates,
  selectedRateId: 'rate_fedex_1111',
  parcels: [parcelWithoutTrackingDetails1]
})

export const shipmentWithoutParcels = createShipment({
  id: 'shipment-without-parcels',
  status: 'picking',
  purchaseStartedAt: '2023-07-11',
  parcels: []
})

export const shipmentWithCustomsInfo = createShipment({
  id: 'shipment-with-customs-info',
  status: 'picking',
  purchaseStartedAt: '2023-07-11',
  parcels: [parcelWithCustomsInfo]
})
