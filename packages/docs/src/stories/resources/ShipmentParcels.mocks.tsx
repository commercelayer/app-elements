import { type ShipmentParcels } from '#ui/resources/ShipmentParcels'

type Shipment = Parameters<typeof ShipmentParcels>[0]['shipment']
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
    image_url: `https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/${code}_FLAT.png`
  }
}

function createParcel({
  id,
  weight,
  lineItems,
  package: pkg,
  shippingLabelUrl,
  trackingDetails,
  trackingNumber
}: {
  id: string
  weight: number
  lineItems: Array<Parameters<typeof createParcelLineItems>[number]>
  package: Parameters<typeof createParcelPackage>[number]
  shippingLabelUrl?: string
  trackingDetails?: Array<Record<string, any>>
  trackingNumber?: string
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
    tracking_details: trackingDetails as unknown as string,
    tracking_number: trackingNumber,
    shipping_label_url: shippingLabelUrl
  }
}

function createShipment({
  id,
  status,
  parcels,
  rates
}: {
  id: string
  status: Shipment['status']
  parcels: Parcel[]
  rates?: Array<Record<string, any>>
}): Shipment {
  return {
    type: 'shipments',
    id,
    created_at: '',
    updated_at: '',
    status,
    parcels,
    rates,
    selected_rate_id: 'rate_62be838fbcd8446298ebe139f59b839f'
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
  trackingNumber: '65345234RWQ1111'
})

const rates = [
  {
    id: 'rate_f48a8d19b26b4893a0cdd0d441d5d37a',
    carrier: 'DHLExpress',
    service: 'ExpressWorldwideECX',
    carrier_account_id: 'ca_6ac8fb85aa314abb87c3154ae4c87244',
    currency: 'EUR',
    rate: 30.51,
    formatted_rate: '€30,51',
    delivery_date: '2023-06-23T00:00:00Z',
    formatted_delivery_date: 'Jun 23, 2023 12:00 AM',
    delivery_days: 1,
    est_delivery_days: 1,
    shipment_id: 'shp_ffe1e130e0694ad9a41935fc56c4b6b4',
    mode: 'test'
  },
  {
    id: 'rate_436a50eec6df4e7b9a28efe1097df83c',
    carrier: 'DHLExpress',
    service: 'Express1200',
    carrier_account_id: 'ca_6ac8fb85aa314abb87c3154ae4c87244',
    currency: 'EUR',
    rate: 47.38,
    formatted_rate: '€47,38',
    delivery_date: '2023-06-23T00:00:00Z',
    formatted_delivery_date: 'Jun 23, 2023 12:00 AM',
    delivery_days: 1,
    est_delivery_days: 1,
    shipment_id: 'shp_ffe1e130e0694ad9a41935fc56c4b6b4',
    mode: 'test'
  },
  {
    id: 'rate_62be838fbcd8446298ebe139f59b839f',
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
    id: 'rate_305f3a13069e419893e796609e7c3cdb',
    carrier: 'DHLExpress',
    service: 'EconomySelect',
    carrier_account_id: 'ca_6ac8fb85aa314abb87c3154ae4c87244',
    currency: 'EUR',
    rate: 92.6,
    formatted_rate: '€92,60',
    delivery_date: '2023-06-27T00:00:00Z',
    formatted_delivery_date: 'Jun 27, 2023 12:00 AM',
    delivery_days: 5,
    est_delivery_days: 5,
    shipment_id: 'shp_ffe1e130e0694ad9a41935fc56c4b6b4',
    mode: 'test'
  },
  {
    id: 'rate_bd3cf11dbb614981a923cbf166cd727b',
    carrier: 'DHLExpress',
    service: 'MedicalExpress',
    carrier_account_id: 'ca_6ac8fb85aa314abb87c3154ae4c87244',
    currency: 'EUR',
    rate: 239.9,
    formatted_rate: '€239,90',
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

export const shipmentWithSingleTracking = createShipment({
  id: 'shipment-with-single-tracking',
  status: 'packing',
  rates,
  parcels: [parcelWithTracking1, parcelWithoutTracking1]
})

export const shipmentWithMultipleTracking = createShipment({
  id: 'shipment-with-multiple-tracking',
  status: 'packing',
  rates,
  parcels: [parcelWithTracking1, parcelWithTracking2]
})

export const shipmentWithoutParcels = createShipment({
  id: 'shipment-without-parcels',
  status: 'picking',
  parcels: []
})
