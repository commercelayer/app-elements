import {
  type ListableResourceType,
  type ResourceTypeLock,
  type ResourceUpdate
} from '@commercelayer/sdk'

const singularLowercase: Record<ListableResourceType, string> = {
  addresses: 'address',
  adjustments: 'adjustment',
  adyen_gateways: 'adyen gateway',
  adyen_payments: 'adyen payment',
  attachments: 'attachment',
  authorizations: 'authorization',
  avalara_accounts: 'avalara account',
  axerve_gateways: 'axerve gateway',
  axerve_payments: 'axerve payment',
  bing_geocoders: 'bing geocoder',
  braintree_gateways: 'braintree gateway',
  braintree_payments: 'braintree payment',
  bundles: 'bundle',
  buy_x_pay_y_promotions: 'buy x pay y promotion',
  captures: 'capture',
  carrier_accounts: 'carrier account',
  checkout_com_gateways: 'checkout.com gateway',
  checkout_com_payments: 'checkout.com payment',
  cleanups: 'cleanup',
  coupon_codes_promotion_rules: 'coupon codes promotion rule',
  coupon_recipients: 'coupon recipient',
  coupons: 'coupon',
  custom_promotion_rules: 'custom promotion rule',
  customer_addresses: 'customer address',
  customer_groups: 'customer group',
  customer_password_resets: 'customer password reset',
  customer_payment_sources: 'customer payment source',
  customer_subscriptions: 'customer subscription',
  customers: 'customer',
  delivery_lead_times: 'delivery lead time',
  discount_engine_items: 'discount engine item',
  discount_engines: 'discount engine',
  easypost_pickups: 'easypost pickup',
  event_callbacks: 'event callback',
  events: 'event',
  exports: 'export',
  external_gateways: 'external gateway',
  external_payments: 'external payment',
  external_promotions: 'external promotion',
  external_tax_calculators: 'external tax calculator',
  fixed_amount_promotions: 'fixed amount promotion',
  fixed_price_promotions: 'fixed price promotion',
  flex_promotions: 'flex promotion',
  free_gift_promotions: 'free gift promotion',
  free_shipping_promotions: 'free shipping promotion',
  geocoders: 'geocoder',
  gift_card_recipients: 'gift card recipient',
  gift_cards: 'gift card',
  google_geocoders: 'google geocoder',
  imports: 'import',
  in_stock_subscriptions: 'in stock subscription',
  inventory_models: 'inventory model',
  inventory_return_locations: 'inventory return location',
  inventory_stock_locations: 'inventory stock location',
  klarna_gateways: 'klarna gateway',
  klarna_payments: 'klarna payment',
  line_item_options: 'line item option',
  line_items: 'line item',
  links: 'link',
  manual_gateways: 'manual gateway',
  manual_tax_calculators: 'manual tax calculator',
  markets: 'market',
  merchants: 'merchant',
  notifications: 'notification',
  order_amount_promotion_rules: 'order amount promotion rule',
  order_copies: 'order copy',
  order_factories: 'order factory',
  order_subscription_items: 'order subscription item',
  order_subscriptions: 'order subscription',
  orders: 'order',
  packages: 'package',
  parcel_line_items: 'parcel line item',
  parcels: 'parcel',
  payment_gateways: 'payment gateway',
  payment_methods: 'payment method',
  payment_options: 'payment option',
  paypal_gateways: 'paypal gateway',
  paypal_payments: 'paypal payment',
  percentage_discount_promotions: 'percentage discount promotion',
  pickups: 'pickup',
  price_frequency_tiers: 'price frequency tier',
  price_list_schedulers: 'price list scheduler',
  price_lists: 'price list',
  price_tiers: 'price tier',
  price_volume_tiers: 'price volume tier',
  prices: 'price',
  promotion_rules: 'promotion rule',
  promotions: 'promotion',
  recurring_order_copies: 'recurring order copy',
  refunds: 'refund',
  reserved_stocks: 'reserved stock',
  resource_errors: 'resource error',
  return_line_items: 'return line item',
  returns: 'return',
  satispay_gateways: 'satispay gateway',
  satispay_payments: 'satispay payment',
  shipments: 'shipment',
  shipping_categories: 'shipping category',
  shipping_method_tiers: 'shipping method tier',
  shipping_methods: 'shipping method',
  shipping_weight_tiers: 'shipping weight tier',
  shipping_zones: 'shipping zone',
  sku_list_items: 'SKU list item',
  sku_list_promotion_rules: 'SKU list promotion rule',
  sku_lists: 'SKU list',
  sku_options: 'SKU option',
  skus: 'SKU',
  stock_items: 'stock item',
  stock_line_items: 'stock line item',
  stock_locations: 'stock location',
  stock_reservations: 'stock reservation',
  stock_transfers: 'stock transfer',
  stores: 'Store',
  stripe_gateways: 'stripe gateway',
  stripe_payments: 'stripe payment',
  stripe_tax_accounts: 'stripe tax account',
  subscription_models: 'subscription model',
  tags: 'tag',
  talon_one_accounts: 'talon.one account',
  tax_calculators: 'tax calculator',
  tax_categories: 'tax category',
  tax_rules: 'tax rule',
  taxjar_accounts: 'taxjar account',
  transactions: 'transaction',
  versions: 'version',
  vertex_accounts: 'vertex account',
  voids: 'void',
  webhooks: 'webhook',
  wire_transfers: 'wire transfer'
}

const pluralLowercase: Record<ListableResourceType, string> = {
  addresses: 'addresses',
  adjustments: 'adjustments',
  adyen_gateways: 'adyen gateways',
  adyen_payments: 'adyen payments',
  attachments: 'attachments',
  authorizations: 'authorizations',
  avalara_accounts: 'avalara accounts',
  axerve_gateways: 'axerve gateways',
  axerve_payments: 'axerve payments',
  bing_geocoders: 'bing geocoders',
  braintree_gateways: 'braintree gateways',
  braintree_payments: 'braintree payments',
  bundles: 'bundles',
  buy_x_pay_y_promotions: 'buy x pay y promotions',
  captures: 'captures',
  carrier_accounts: 'carrier accounts',
  checkout_com_gateways: 'checkout.com gateways',
  checkout_com_payments: 'checkout.com payments',
  cleanups: 'cleanups',
  coupon_codes_promotion_rules: 'coupon codes promotion rules',
  coupon_recipients: 'coupon recipients',
  coupons: 'coupons',
  custom_promotion_rules: 'custom promotion rules',
  customer_addresses: 'customer addresses',
  customer_groups: 'customer groups',
  customer_password_resets: 'customer password resets',
  customer_payment_sources: 'customer payment sources',
  customer_subscriptions: 'customer subscriptions',
  customers: 'customers',
  delivery_lead_times: 'delivery lead times',
  discount_engine_items: 'discount engine items',
  discount_engines: 'discount engines',
  easypost_pickups: 'easypost pickups',
  event_callbacks: 'event callbacks',
  events: 'events',
  exports: 'exports',
  external_gateways: 'external gateways',
  external_payments: 'external payments',
  external_promotions: 'external promotions',
  external_tax_calculators: 'external tax calculators',
  fixed_amount_promotions: 'fixed amount promotions',
  fixed_price_promotions: 'fixed price promotions',
  flex_promotions: 'flex promotions',
  free_gift_promotions: 'free gift promotions',
  free_shipping_promotions: 'free shipping promotions',
  geocoders: 'geocoders',
  gift_card_recipients: 'gift card recipients',
  gift_cards: 'gift cards',
  google_geocoders: 'google geocoders',
  imports: 'imports',
  in_stock_subscriptions: 'in stock subscriptions',
  inventory_models: 'inventory models',
  inventory_return_locations: 'inventory return locations',
  inventory_stock_locations: 'inventory stock locations',
  klarna_gateways: 'klarna gateways',
  klarna_payments: 'klarna payments',
  line_item_options: 'line item options',
  line_items: 'line items',
  links: 'links',
  manual_gateways: 'manual gateways',
  manual_tax_calculators: 'manual tax calculators',
  markets: 'markets',
  merchants: 'merchants',
  notifications: 'notifications',
  order_amount_promotion_rules: 'order amount promotion rules',
  order_copies: 'order copies',
  order_factories: 'order factories',
  order_subscription_items: 'order subscription items',
  order_subscriptions: 'order subscriptions',
  orders: 'orders',
  packages: 'packages',
  parcel_line_items: 'parcel line items',
  parcels: 'parcels',
  payment_gateways: 'payment gateways',
  payment_methods: 'payment methods',
  payment_options: 'payment options',
  paypal_gateways: 'paypal gateways',
  paypal_payments: 'paypal payments',
  percentage_discount_promotions: 'percentage discount promotions',
  pickups: 'pickups',
  price_frequency_tiers: 'price frequency tiers',
  price_list_schedulers: 'price list schedulers',
  price_lists: 'price lists',
  price_tiers: 'price tiers',
  price_volume_tiers: 'price volume tiers',
  prices: 'prices',
  promotion_rules: 'promotion rules',
  promotions: 'promotions',
  recurring_order_copies: 'recurring order copies',
  refunds: 'refunds',
  reserved_stocks: 'reserved stocks',
  resource_errors: 'resource errors',
  return_line_items: 'return line items',
  returns: 'returns',
  satispay_gateways: 'satispay gateways',
  satispay_payments: 'satispay payments',
  shipments: 'shipments',
  shipping_categories: 'shipping categories',
  shipping_method_tiers: 'shipping method tiers',
  shipping_methods: 'shipping methods',
  shipping_weight_tiers: 'shipping weight tiers',
  shipping_zones: 'shipping zones',
  sku_list_items: 'SKU list items',
  sku_list_promotion_rules: 'SKU list promotion rules',
  sku_lists: 'SKU lists',
  sku_options: 'SKU options',
  skus: 'SKUs',
  stock_items: 'stock items',
  stock_line_items: 'stock line items',
  stock_locations: 'stock locations',
  stock_reservations: 'stock reservations',
  stock_transfers: 'stock transfers',
  stores: 'Stores',
  stripe_gateways: 'stripe gateways',
  stripe_payments: 'stripe payments',
  stripe_tax_accounts: 'stripe tax accounts',
  subscription_models: 'subscription models',
  tags: 'tags',
  talon_one_accounts: 'talon.one accounts',
  tax_calculators: 'tax calculators',
  tax_categories: 'tax categories',
  tax_rules: 'tax rules',
  taxjar_accounts: 'taxjar accounts',
  transactions: 'transactions',
  versions: 'versions',
  vertex_accounts: 'vertex accounts',
  voids: 'voids',
  webhooks: 'webhooks',
  wire_transfers: 'wire transfers'
}

/**
 * Format a resource name for display in the UI based on the count and format.
 * default format is lower case and singular
 */
export function formatResourceName({
  resource,
  count = 1,
  format = 'lower'
}: {
  resource: ListableResourceType
  count?: number | 'singular' | 'plural'
  format?: 'lower' | 'title'
}): string {
  const isSingular = count === 1 || count === 'singular'
  const dictionary = isSingular ? singularLowercase : pluralLowercase
  const resourceName = dictionary[resource]

  if (resourceName == null) {
    return resource
  }

  if (format === 'title') {
    return capitalizeFirstLetter(resourceName)
  }

  return resourceName
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export type TriggerAttribute<Resource extends ResourceUpdate> = Extract<
  keyof Resource,
  `_${string}`
>

export type ResourceEndpoint =
  | Exclude<ResourceTypeLock, 'applications' | 'organizations'>
  | ('organization' | 'application')

/**
 * Get the resource endpoint for a given resource type.
 * @param resourceType The resource type
 * @returns The resource endpoint
 * @example getResourceEndpoint('organizations') // 'organization'
 */
export function getResourceEndpoint(
  resourceType: ResourceTypeLock
): ResourceEndpoint {
  return resourceType === 'organizations'
    ? 'organization'
    : resourceType === 'applications'
      ? 'application'
      : resourceType
}
