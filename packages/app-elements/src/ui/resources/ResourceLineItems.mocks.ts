import {
  type LineItem,
  type ParcelLineItem,
  type ReturnLineItem,
  type StockLineItem
} from '@commercelayer/sdk'

export const presetLineItems = {
  oneLine: {
    type: 'line_items',
    item_type: 'skus',
    id: 'Rew3423fwr',
    created_at: '',
    updated_at: '',
    sku_code: 'BABYBIBXA19D9D000000XXXX',
    image_url:
      'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BABYBIBXA19D9D000000XXXX_FLAT.png',
    name: 'Gray Baby Bib with Black Logo',
    quantity: 2,
    formatted_unit_amount: '9.00€',
    formatted_total_amount: '18.00€',
    total_amount_float: 18.0,
    tax_amount_float: 100
  },
  oneLine_2: {
    type: 'line_items',
    item_type: 'skus',
    id: 'Tq45rwfokm',
    created_at: '',
    updated_at: '',
    sku_code: 'BASEBHAT000000FFFFFFXXXX',
    image_url:
      'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BASEBHAT000000FFFFFFXXXX_FLAT.png',
    name: 'Black Baseball Hat with White Logo',
    quantity: 1,
    formatted_total_amount: '34.00€',
    formatted_unit_amount: '34.00€',
    total_amount_float: 34.0,
    tax_amount_float: 0
  },
  twoLines: {
    type: 'line_items',
    item_type: 'skus',
    id: 'cEw4rwergv',
    created_at: '',
    updated_at: '',
    sku_code: 'HOODIEUL000000FFFFFFLXXX',
    image_url:
      'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/HOODIEUL000000FFFFFFLXXX_FLAT.png',
    name: 'BlackUnisexLightweightHoodieWithWhiteLogo_Cotton_Fabric_long_name',
    quantity: 10,
    formatted_total_amount: '1090.00€',
    formatted_unit_amount: '109.00€',
    total_amount_float: 1090.0,
    tax_amount_float: 200
  },
  withOptions: {
    type: 'line_items',
    item_type: 'skus',
    id: 'qsx4tet345',
    created_at: '',
    updated_at: '',
    sku_code: 'TOTEBAGLE7DDC7000000XXXX',
    image_url:
      'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/TOTEBAGLE7DDC7000000XXXX_FLAT.png',
    name: 'Large Eco Tote Bag with Black Logo',
    quantity: 9,
    formatted_total_amount: '243.00€',
    formatted_unit_amount: '27.00€',
    total_amount_float: 243.0,
    tax_amount_float: 100,

    line_item_options: [
      {
        id: 'NOnEiOMPRx',
        type: 'line_item_options',
        name: 'Front Text',
        quantity: 1,
        currency_code: 'USD',
        unit_amount_cents: 100,
        unit_amount_float: 1,
        formatted_unit_amount: '$1.00',
        total_amount_cents: 100,
        total_amount_float: 1,
        formatted_total_amount: '$1.00',
        delay_hours: 0,
        delay_days: 0,
        options: {
          line1: 'Commerce Layer',
          line2: 'Composable Commerce API'
        },
        created_at: '2023-03-27T10:33:30.074Z',
        updated_at: '2023-03-27T10:33:30.074Z',
        reference: null,
        reference_origin: null,
        metadata: {}
      },
      {
        id: 'xqrRidVOVN',
        type: 'line_item_options',
        name: 'Rear Text',
        quantity: 1,
        currency_code: 'USD',
        unit_amount_cents: 100,
        unit_amount_float: 1,
        formatted_unit_amount: '$1.00',
        total_amount_cents: 100,
        total_amount_float: 1,
        formatted_total_amount: '$1.00',
        delay_hours: 0,
        delay_days: 0,
        options: {
          name: 'Ringo Starr',
          team: 'Beatles'
        },
        created_at: '2023-03-27T10:33:30.099Z',
        updated_at: '2023-03-27T10:33:30.099Z',
        reference: null,
        reference_origin: null,
        metadata: {}
      },
      {
        id: 'xqrRisOVN',
        type: 'line_item_options',
        name: 'Special',
        quantity: 1,
        currency_code: 'USD',
        unit_amount_cents: 100,
        unit_amount_float: 1,
        formatted_unit_amount: '$1.00',
        total_amount_cents: 100,
        total_amount_float: 1,
        formatted_total_amount: '$1.00',
        delay_hours: 0,
        delay_days: 0,
        options: {
          logo_url: 'http://data.commercelayer.com/long_url/logo.png',
          colors: ['#400', '#fff', '#000fff'],
          position: {
            x: 30,
            y: 10
          }
        },
        created_at: '2023-03-27T10:33:30.099Z',
        updated_at: '2023-03-27T10:33:30.099Z',
        reference: null,
        reference_origin: null,
        metadata: {}
      }
    ]
  },
  withBundle: {
    id: 'PljQzimxgB',
    type: 'line_items',
    item_type: 'bundles',
    sku_code: null,
    bundle_code: 'WELCOME_KIT_001',
    quantity: 1,
    currency_code: 'USD',
    unit_amount_cents: 1000,
    unit_amount_float: 10,
    formatted_unit_amount: '$10.00',
    formatted_options_amount: '$0.00',
    formatted_discount: '$0.00',
    total_amount_cents: 1000,
    total_amount_float: 10,
    formatted_total_amount: '$10.00',
    tax_amount_cents: 0,
    tax_amount_float: 0,
    name: 'Welcome KIT',
    image_url:
      'https://data.commercelayer.app/assets/images/t-shirts/color/png/t-shirt-flat_GREEN-ALIEN.png',
    created_at: '2023-04-28T09:46:16.219Z',
    updated_at: '2023-04-28T09:46:16.219Z'
  },
  stockLineItem: {
    id: 'nBJxuxMObn',
    type: 'stock_line_items',
    sku_code: 'TSHIRTMMFFFFFFE63E74MXXX',
    bundle_code: null,
    quantity: 3,
    created_at: '2023-08-09T10:37:26.211Z',
    updated_at: '2023-08-09T10:37:26.211Z',
    reference: null,
    reference_origin: null,
    metadata: {},
    sku: {
      id: 'bnRwRSJQlZ',
      type: 'skus',
      code: 'TSHIRTMSB0B0B2000000LXXX',
      name: 'Gray Men T-Shirt with Black Logo (L)',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam pellentesque in neque vitae tincidunt. In gravida eu ipsum non condimentum. Curabitur libero leo, gravida a dictum vestibulum, sollicitudin vel quam.',
      image_url:
        'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/TSHIRTMSB0B0B2000000LXXX_FLAT.png',
      weight: 200,
      unit_of_weight: 'gr',
      hs_tariff_number: '',
      do_not_ship: false,
      do_not_track: false,
      inventory: null,
      created_at: '2022-05-13T12:33:45.266Z',
      updated_at: '2023-07-12T14:43:38.731Z',
      reference: 'TSHIRTMMFFFFFFE63E74',
      reference_origin: '',
      metadata: {}
    }
  },
  parcelLineItem: {
    id: 'PZEKxtRWrw',
    type: 'parcel_line_items',
    sku_code: 'BOTT17OZFFFFFF000000XXXX',
    bundle_code: null,
    quantity: 2,
    name: 'White Water Bottle with Black Logo',
    image_url:
      'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BOTT17OZFFFFFF000000XXXX_FLAT.png',
    created_at: '2023-08-10T08:13:49.214Z',
    updated_at: '2023-08-10T08:13:49.214Z',
    reference: null,
    reference_origin: null,
    metadata: {}
  },
  returnLineItem: {
    id: 'WtRevFrwbv',
    type: 'return_line_items',
    sku_code: 'EMUG12OZFFFFFF000000XXXX',
    bundle_code: null,
    quantity: 1,
    name: 'Enamel Mug with Black Logo',
    image_url:
      'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/EMUG12OZFFFFFF000000XXXX_FLAT.png',
    return_reason: {
      0: 'The product received does not match what I ordered.'
    },
    restocked_at: '2023-08-11T09:18:49.214Z',
    created_at: '2023-08-10T08:13:49.214Z',
    updated_at: '2023-08-10T08:13:49.214Z',
    reference: null,
    reference_origin: null,
    metadata: {}
  },
  giftCardUsed: {
    type: 'line_items',
    id: 'vDBVtGBLWJ',
    sku_code: null,
    bundle_code: null,
    quantity: 1,
    currency_code: 'EUR',
    unit_amount_cents: -900,
    unit_amount_float: -9,
    formatted_unit_amount: '-€9,00',
    options_amount_cents: 0,
    options_amount_float: 0,
    formatted_options_amount: '€0,00',
    discount_cents: 0,
    discount_float: 0,
    formatted_discount: '€0,00',
    total_amount_cents: -900,
    total_amount_float: -9,
    formatted_total_amount: '-€9,00',
    tax_amount_cents: 0,
    tax_amount_float: 0,
    formatted_tax_amount: '€0,00',
    name: 'Gift card: €9,00',
    image_url: '',
    discount_breakdown: {},
    tax_rate: 0,
    tax_breakdown: {},
    item_type: 'gift_cards',
    frequency: null,
    created_at: '2023-08-22T13:20:11.250Z',
    updated_at: '2023-08-22T13:20:11.250Z',
    reference: null,
    reference_origin: null,
    metadata: {}
  },
  giftCardBought: {
    type: 'line_items',
    id: 'yZYjtgrmgN',
    sku_code: null,
    bundle_code: null,
    quantity: 1,
    currency_code: 'EUR',
    unit_amount_cents: 10000,
    unit_amount_float: 100,
    formatted_unit_amount: '€100,00',
    options_amount_cents: 0,
    options_amount_float: 0,
    formatted_options_amount: '€0,00',
    discount_cents: 0,
    discount_float: 0,
    formatted_discount: '€0,00',
    total_amount_cents: 10000,
    total_amount_float: 100,
    formatted_total_amount: '€100,00',
    tax_amount_cents: 0,
    tax_amount_float: 0,
    formatted_tax_amount: '€0,00',
    name: 'Gift card: €100,00',
    image_url: null,
    discount_breakdown: {},
    tax_rate: 0,
    tax_breakdown: {},
    item_type: 'gift_cards',
    frequency: null,
    created_at: '2023-08-24T12:27:02.252Z',
    updated_at: '2023-08-24T12:27:02.252Z',
    reference: null,
    reference_origin: null,
    metadata: {}
  },
  percentageDiscountPromotionOver100: {
    type: 'line_items',
    id: 'kxnXtxoEJV',
    sku_code: null,
    bundle_code: null,
    quantity: 1,
    currency_code: 'EUR',
    unit_amount_cents: -1300,
    unit_amount_float: -13,
    formatted_unit_amount: '-€13,00',
    options_amount_cents: 0,
    options_amount_float: 0,
    formatted_options_amount: '€0,00',
    discount_cents: 0,
    discount_float: 0,
    formatted_discount: '€0,00',
    total_amount_cents: -1300,
    total_amount_float: -13,
    formatted_total_amount: '-€13,00',
    tax_amount_cents: 0,
    tax_amount_float: 0,
    formatted_tax_amount: '€0,00',
    name: 'Percentage Discount Promotion - percentage over 100',
    image_url: null,
    discount_breakdown: {},
    tax_rate: 0,
    tax_breakdown: {},
    item_type: 'percentage_discount_promotions',
    frequency: null,
    created_at: '2023-08-22T12:28:30.609Z',
    updated_at: '2023-08-22T12:28:30.609Z',
    reference: null,
    reference_origin: null,
    metadata: {}
  },
  percentageDiscountPromotionSkuList: {
    type: 'line_items',
    id: 'vjDQtoPBJZ',
    sku_code: null,
    bundle_code: null,
    quantity: 1,
    currency_code: 'EUR',
    unit_amount_cents: -500,
    unit_amount_float: -5,
    formatted_unit_amount: '-€5,00',
    options_amount_cents: 0,
    options_amount_float: 0,
    formatted_options_amount: '€0,00',
    discount_cents: 0,
    discount_float: 0,
    formatted_discount: '€0,00',
    total_amount_cents: -500,
    total_amount_float: -5,
    formatted_total_amount: '-€5,00',
    tax_amount_cents: 0,
    tax_amount_float: 0,
    formatted_tax_amount: '€0,00',
    name: 'Percentage Discount Promotion - skulist',
    image_url: null,
    discount_breakdown: {},
    tax_rate: 0,
    tax_breakdown: {},
    item_type: 'percentage_discount_promotions',
    frequency: null,
    created_at: '2023-08-22T12:28:30.589Z',
    updated_at: '2023-08-22T12:28:30.589Z',
    reference: null,
    reference_origin: null,
    metadata: {}
  },
  percentageDiscountPromotionCoupon: {
    type: 'line_items',
    id: 'yEqOtKbPpV',
    sku_code: null,
    bundle_code: null,
    quantity: 1,
    currency_code: 'EUR',
    unit_amount_cents: -1300,
    unit_amount_float: -13,
    formatted_unit_amount: '-€13,00',
    options_amount_cents: 0,
    options_amount_float: 0,
    formatted_options_amount: '€0,00',
    discount_cents: 0,
    discount_float: 0,
    formatted_discount: '€0,00',
    total_amount_cents: -1300,
    total_amount_float: -13,
    formatted_total_amount: '-€13,00',
    tax_amount_cents: 0,
    tax_amount_float: 0,
    formatted_tax_amount: '€0,00',
    name: 'Percentage Discount Promotion - 10% COUPON',
    image_url: null,
    discount_breakdown: {},
    tax_rate: 0,
    tax_breakdown: {},
    item_type: 'percentage_discount_promotions',
    frequency: null,
    created_at: '2023-08-22T12:28:30.564Z',
    updated_at: '2023-08-22T12:28:30.564Z',
    reference: null,
    reference_origin: null,
    metadata: {}
  },
  freeShippingPromotion: {
    type: 'line_items',
    id: 'ypQptemqYK',
    sku_code: null,
    bundle_code: null,
    quantity: 1,
    currency_code: 'EUR',
    unit_amount_cents: -1200,
    unit_amount_float: -12,
    formatted_unit_amount: '-€12,00',
    options_amount_cents: 0,
    options_amount_float: 0,
    formatted_options_amount: '€0,00',
    discount_cents: 0,
    discount_float: 0,
    formatted_discount: '€0,00',
    total_amount_cents: -1200,
    total_amount_float: -12,
    formatted_total_amount: '-€12,00',
    tax_amount_cents: 0,
    tax_amount_float: 0,
    formatted_tax_amount: '€0,00',
    name: 'Free Shipping Promotion - 100€',
    image_url: null,
    discount_breakdown: {},
    tax_rate: 0,
    tax_breakdown: {},
    item_type: 'free_shipping_promotions',
    frequency: null,
    created_at: '2023-08-22T13:20:11.153Z',
    updated_at: '2023-08-22T13:20:11.153Z',
    reference: null,
    reference_origin: null,
    metadata: {}
  }
} satisfies Record<
  string,
  LineItem | ParcelLineItem | StockLineItem | ReturnLineItem
>
