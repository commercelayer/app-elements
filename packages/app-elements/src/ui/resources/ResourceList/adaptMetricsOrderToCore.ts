import { type CurrencyCode } from '#helpers/currencies'
import { formatCentsToCurrency } from '#ui/forms/InputCurrency'
import { type Order } from '@commercelayer/sdk'

export interface MetricsResourceOrder {
  id: string
  type: 'orders'
  adjustment_amount?: number
  adjustment_tax_amount?: number
  adjustment_taxable_amount?: number
  country_code?: string | null
  created_at?: string
  currency_code?: string
  discount_amount?: number
  fulfillment_status?: string
  gift_card_amount?: number
  guest?: boolean
  language_code?: string
  line_item_options_count?: number
  number?: string
  payment_method_amount?: number
  payment_method_tax_amount?: number
  payment_method_taxable_amount?: number
  payment_status?: string
  payment_updated_at?: string
  placed_at?: string
  shipments_count?: number
  shipping_amount?: number
  shipping_taxable_amount?: number
  skus_count?: number
  status?: string
  subtotal_amount?: number
  subtotal_tax_amount?: number
  subtotal_taxable_amount?: number
  tax_included?: boolean
  total_amount?: number
  total_amount_with_taxes?: number
  total_tax_amount?: number
  total_taxable_amount?: number
  returned?: boolean
  updated_at?: string
  seconds_in_draft?: number
  refunded?: boolean
  refunds_total_amount_with_taxes?: number
  total_amount_with_taxes_net_of_refunds?: number
  aggregated_details?: string
  mode?: string
  placed_day_of_week?: number
  discounted?: boolean
  gift_card?: boolean
  coupon?: boolean
  options?: boolean
  archived?: boolean
  market?: {
    id: string
    name?: string
    number?: string
  }
  billing_address?: {
    business?: boolean
    city?: string
    country_code?: string
    geocoded?: boolean
    localized?: boolean
    state_code?: string
    zip_code?: string
    first_name?: string
    last_name?: string
  }
}

export function adaptMetricsOrderToCore(
  metricsOrder: MetricsResourceOrder
): Order {
  const makeBooleanFromAmount = (amount?: number): boolean | undefined =>
    amount == null ? undefined : amount > 0

  const makeCentsFromFloat = (value?: number): number | undefined =>
    value == null ? undefined : value * 100

  const formatFloatToCurrency = (float?: number): string | undefined =>
    float == null || metricsOrder.currency_code == null
      ? undefined
      : formatCentsToCurrency(
          float * 100,
          metricsOrder.currency_code as CurrencyCode
        )

  return {
    id: metricsOrder.id,
    type: 'orders',
    created_at: metricsOrder.created_at ?? '',
    updated_at: metricsOrder.updated_at ?? '',
    // @ts-expect-error: wrong type from SDK
    number: metricsOrder.number != null ? parseInt(metricsOrder.number) : '',
    status: metricsOrder.status as Order['status'],
    payment_status: metricsOrder.payment_status as Order['payment_status'],
    fulfillment_status:
      metricsOrder.fulfillment_status as Order['fulfillment_status'],
    guest: metricsOrder.guest,
    language_code: metricsOrder.language_code,
    currency_code: metricsOrder.currency_code,
    tax_included: metricsOrder.tax_included,
    payment_method_taxable: makeBooleanFromAmount(
      metricsOrder.payment_method_taxable_amount
    ),
    adjustment_taxable: makeBooleanFromAmount(
      metricsOrder.adjustment_taxable_amount
    ),
    country_code: metricsOrder.country_code,
    coupon_code: metricsOrder.coupon === true ? '' : null,
    gift_card_code: metricsOrder.gift_card === true ? '' : null,
    subtotal_amount_cents: makeCentsFromFloat(metricsOrder.subtotal_amount),
    subtotal_amount_float: metricsOrder.subtotal_amount,
    formatted_subtotal_amount: formatFloatToCurrency(
      metricsOrder.subtotal_amount
    ),
    shipping_amount_cents: makeCentsFromFloat(metricsOrder.shipping_amount),
    shipping_amount_float: metricsOrder.shipping_amount,
    formatted_shipping_amount: formatFloatToCurrency(
      metricsOrder.shipping_amount
    ),
    payment_method_amount_cents: makeCentsFromFloat(
      metricsOrder.payment_method_amount
    ),
    payment_method_amount_float: metricsOrder.payment_method_amount,
    formatted_payment_method_amount: formatFloatToCurrency(
      metricsOrder.payment_method_amount
    ),
    discount_amount_cents: makeCentsFromFloat(metricsOrder.discount_amount),
    discount_amount_float: metricsOrder.discount_amount,
    formatted_discount_amount: formatFloatToCurrency(
      metricsOrder.discount_amount
    ),
    adjustment_amount_cents: makeCentsFromFloat(metricsOrder.adjustment_amount),
    adjustment_amount_float: metricsOrder.adjustment_amount,
    formatted_adjustment_amount: formatFloatToCurrency(
      metricsOrder.adjustment_amount
    ),
    gift_card_amount_cents: makeCentsFromFloat(metricsOrder.gift_card_amount),
    gift_card_amount_float: metricsOrder.gift_card_amount,
    formatted_gift_card_amount: formatFloatToCurrency(
      metricsOrder.gift_card_amount
    ),
    total_tax_amount_cents: makeCentsFromFloat(metricsOrder.total_tax_amount),
    total_tax_amount_float: metricsOrder.total_tax_amount,
    formatted_total_tax_amount: formatFloatToCurrency(
      metricsOrder.total_tax_amount
    ),
    subtotal_tax_amount_cents: makeCentsFromFloat(
      metricsOrder.subtotal_tax_amount
    ),
    subtotal_tax_amount_float: metricsOrder.subtotal_tax_amount,
    formatted_subtotal_tax_amount: formatFloatToCurrency(
      metricsOrder.subtotal_tax_amount
    ),
    payment_method_tax_amount_cents: makeCentsFromFloat(
      metricsOrder.payment_method_tax_amount
    ),
    payment_method_tax_amount_float: metricsOrder.payment_method_tax_amount,
    formatted_payment_method_tax_amount: formatFloatToCurrency(
      metricsOrder.payment_method_tax_amount
    ),
    adjustment_tax_amount_cents: makeCentsFromFloat(
      metricsOrder.adjustment_tax_amount
    ),
    adjustment_tax_amount_float: metricsOrder.adjustment_tax_amount,
    formatted_adjustment_tax_amount: formatFloatToCurrency(
      metricsOrder.adjustment_tax_amount
    ),
    total_amount_cents: makeCentsFromFloat(metricsOrder.total_amount),
    total_amount_float: metricsOrder.total_amount,
    formatted_total_amount: formatFloatToCurrency(metricsOrder.total_amount),
    total_taxable_amount_cents: makeCentsFromFloat(
      metricsOrder.total_taxable_amount
    ),
    total_taxable_amount_float: metricsOrder.total_taxable_amount,
    formatted_total_taxable_amount: formatFloatToCurrency(
      metricsOrder.total_taxable_amount
    ),
    subtotal_taxable_amount_cents: makeCentsFromFloat(
      metricsOrder.subtotal_taxable_amount
    ),
    subtotal_taxable_amount_float: metricsOrder.subtotal_taxable_amount,
    formatted_subtotal_taxable_amount: formatFloatToCurrency(
      metricsOrder.subtotal_taxable_amount
    ),
    shipping_taxable_amount_cents: makeCentsFromFloat(
      metricsOrder.shipping_taxable_amount
    ),
    shipping_taxable_amount_float: metricsOrder.shipping_taxable_amount,
    formatted_shipping_taxable_amount: formatFloatToCurrency(
      metricsOrder.shipping_taxable_amount
    ),
    payment_method_taxable_amount_cents: makeCentsFromFloat(
      metricsOrder.payment_method_taxable_amount
    ),
    payment_method_taxable_amount_float:
      metricsOrder.payment_method_taxable_amount,
    formatted_payment_method_taxable_amount: formatFloatToCurrency(
      metricsOrder.payment_method_taxable_amount
    ),
    adjustment_taxable_amount_cents: makeCentsFromFloat(
      metricsOrder.adjustment_taxable_amount
    ),
    adjustment_taxable_amount_float: metricsOrder.adjustment_taxable_amount,
    formatted_adjustment_taxable_amount: formatFloatToCurrency(
      metricsOrder.adjustment_taxable_amount
    ),
    total_amount_with_taxes_cents: makeCentsFromFloat(
      metricsOrder.total_amount_with_taxes
    ),
    total_amount_with_taxes_float: metricsOrder.total_amount_with_taxes,
    formatted_total_amount_with_taxes: formatFloatToCurrency(
      metricsOrder.total_amount_with_taxes
    ),
    skus_count: metricsOrder.skus_count,
    line_item_options_count: metricsOrder.line_item_options_count,
    shipments_count: metricsOrder.shipments_count,
    placed_at: metricsOrder.placed_at,

    payment_updated_at: metricsOrder.payment_updated_at,

    archived_at:
      metricsOrder.archived === true
        ? metricsOrder.updated_at
        : metricsOrder.archived === false
          ? null
          : undefined,

    market:
      metricsOrder.market != null
        ? {
            id: metricsOrder.market.id,
            created_at: '',
            updated_at: '',
            type: 'markets',
            shared_secret: '',
            name: metricsOrder.market.name ?? '',
            number:
              metricsOrder.market.number != null
                ? parseInt(`${metricsOrder.market.number}`)
                : undefined
          }
        : undefined,

    billing_address:
      metricsOrder.billing_address != null
        ? {
            id: '',
            created_at: '',
            updated_at: '',
            type: 'addresses',
            city: metricsOrder.billing_address.city ?? '',
            country_code: metricsOrder.billing_address.country_code ?? '',
            first_name: metricsOrder.billing_address.first_name,
            last_name: metricsOrder.billing_address.last_name,
            full_name: `${metricsOrder.billing_address.first_name} ${metricsOrder.billing_address.last_name}`,
            line_1: '',
            line_2: '',
            phone: '',
            state_code: metricsOrder.billing_address.state_code ?? '',
            zip_code: metricsOrder.billing_address.zip_code
          }
        : undefined
  }
}
