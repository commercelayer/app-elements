export type TokenProviderResourceType =
  | 'addresses'
  | 'adjustments'
  | 'adyen_gateways'
  | 'adyen_payments'
  | 'application'
  | 'attachments'
  | 'authorizations'
  | 'avalara_accounts'
  | 'billing_info_validation_rules'
  | 'bing_geocoders'
  | 'braintree_gateways'
  | 'braintree_payments'
  | 'bundles'
  | 'captures'
  | 'carrier_accounts'
  | 'checkout_com_gateways'
  | 'checkout_com_payments'
  | 'cleanups'
  | 'coupon_codes_promotion_rules'
  | 'coupon_recipients'
  | 'coupons'
  | 'customer_addresses'
  | 'customer_groups'
  | 'customer_password_resets'
  | 'customer_payment_sources'
  | 'customer_subscriptions'
  | 'customers'
  | 'delivery_lead_times'
  | 'event_callbacks'
  | 'events'
  | 'exports'
  | 'external_gateways'
  | 'external_payments'
  | 'external_promotions'
  | 'external_tax_calculators'
  | 'fixed_amount_promotions'
  | 'fixed_price_promotions'
  | 'free_gift_promotions'
  | 'free_shipping_promotions'
  | 'geocoders'
  | 'gift_card_recipients'
  | 'gift_cards'
  | 'google_geocoders'
  | 'imports'
  | 'in_stock_subscriptions'
  | 'inventory_models'
  | 'inventory_return_locations'
  | 'inventory_stock_locations'
  | 'klarna_gateways'
  | 'klarna_payments'
  | 'line_item_options'
  | 'line_items'
  | 'manual_gateways'
  | 'manual_tax_calculators'
  | 'markets'
  | 'merchants'
  | 'order_amount_promotion_rules'
  | 'order_copies'
  | 'order_subscriptions'
  | 'order_validation_rules'
  | 'orders'
  | 'organization'
  | 'packages'
  | 'parcel_line_items'
  | 'parcels'
  | 'payment_gateways'
  | 'payment_methods'
  | 'paypal_gateways'
  | 'paypal_payments'
  | 'percentage_discount_promotions'
  | 'price_lists'
  | 'price_tiers'
  | 'price_volume_tiers'
  | 'prices'
  | 'promotion_rules'
  | 'promotions'
  | 'refunds'
  | 'return_line_items'
  | 'returns'
  | 'shipments'
  | 'shipping_categories'
  | 'shipping_method_tiers'
  | 'shipping_methods'
  | 'shipping_weight_tiers'
  | 'shipping_zones'
  | 'sku_list_items'
  | 'sku_list_promotion_rules'
  | 'sku_lists'
  | 'sku_options'
  | 'skus'
  | 'stock_items'
  | 'stock_line_items'
  | 'stock_locations'
  | 'stock_transfers'
  | 'stripe_gateways'
  | 'stripe_payments'
  | 'tax_calculators'
  | 'tax_categories'
  | 'tax_rules'
  | 'taxjar_accounts'
  | 'transactions'
  | 'voids'
  | 'webhooks'
  | 'wire_transfers'

export type TokenProviderAllowedApp =
  | 'imports'
  | 'exports'
  | 'webhooks'
  | 'resources'
  | 'orders'
  | 'custom'

export type TokenProviderRoleActions = 'create' | 'destroy' | 'read' | 'update'

export type TokenProviderPermissionItem = Record<
  TokenProviderRoleActions,
  boolean
>
export type TokenProviderRolePermissions = Partial<
  Record<TokenProviderResourceType, TokenProviderPermissionItem>
>

export interface TokenProviderTokenInfo {
  token: {
    test: boolean
    market_ids: string[]
    stock_location_ids: string[]
    lifespan: number
  }
  role: { id: string; kind: string; name: string }
  application: {
    id: string
    kind: 'integration' | 'sales_channel' | 'webapp'
    name: string
    core: boolean
  }
  permissions: Record<
    TokenProviderResourceType,
    { actions: TokenProviderRoleActions[] }
  >
}
