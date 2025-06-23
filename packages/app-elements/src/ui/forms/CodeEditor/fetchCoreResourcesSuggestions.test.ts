import { describe } from 'vitest'
import {
  atPath,
  fetchCoreResourcesSuggestions
} from './fetchCoreResourcesSuggestions'

describe('fetchCoreResourcesSuggestions', () => {
  describe('should return the provided "mainResourceIds" list', () => {
    it('when the path is empty', async () => {
      expect(await fetchCoreResourcesSuggestions(['order'], ''))
        .toMatchInlineSnapshot(`
        [
          {
            "type": "relationship",
            "value": "order",
          },
        ]
      `)

      expect(await fetchCoreResourcesSuggestions(['order', 'price'], ''))
        .toMatchInlineSnapshot(`
        [
          {
            "type": "relationship",
            "value": "order",
          },
          {
            "type": "relationship",
            "value": "price",
          },
        ]
      `)
    })

    it('when the first resource in the path is not well-defined', async () => {
      expect(await fetchCoreResourcesSuggestions(['order'], 'ore'))
        .toMatchInlineSnapshot(`
        [
          {
            "type": "relationship",
            "value": "order",
          },
        ]
      `)

      expect(await fetchCoreResourcesSuggestions(['order'], 'ore.rew'))
        .toMatchInlineSnapshot(`
        [
          {
            "type": "relationship",
            "value": "order",
          },
        ]
      `)
    })

    it('when the first resource in the path is well-defined but a last dot (.) is missing', async () => {
      expect(
        await fetchCoreResourcesSuggestions(['order', 'price'], 'order')
      ).toMatchInlineSnapshot(orderSuggestionsSnapshot)
    })
  })

  it('it should return the 2nd level for autocompletion', async () => {
    expect(
      await fetchCoreResourcesSuggestions(['order', 'price'], 'order.')
    ).toMatchInlineSnapshot(orderSuggestionsSnapshot)

    expect(
      await fetchCoreResourcesSuggestions(
        ['order', 'price'],
        'order.something.else'
      )
    ).toMatchInlineSnapshot(orderSuggestionsSnapshot)
  })

  it('it should return the 3rd level for autocompletion', async () => {
    expect(await fetchCoreResourcesSuggestions(['order'], 'order.line_items.'))
      .toMatchInlineSnapshot(`
      [
        {
          "type": "field",
          "value": "order.line_items.sku_code",
        },
        {
          "type": "field",
          "value": "order.line_items.bundle_code",
        },
        {
          "type": "field",
          "value": "order.line_items.quantity",
        },
        {
          "type": "field",
          "value": "order.line_items.currency_code",
        },
        {
          "type": "field",
          "value": "order.line_items.unit_amount_cents",
        },
        {
          "type": "field",
          "value": "order.line_items.unit_amount_float",
        },
        {
          "type": "field",
          "value": "order.line_items.formatted_unit_amount",
        },
        {
          "type": "field",
          "value": "order.line_items.compare_at_amount_cents",
        },
        {
          "type": "field",
          "value": "order.line_items.compare_at_amount_float",
        },
        {
          "type": "field",
          "value": "order.line_items.formatted_compare_at_amount",
        },
        {
          "type": "field",
          "value": "order.line_items.options_amount_cents",
        },
        {
          "type": "field",
          "value": "order.line_items.options_amount_float",
        },
        {
          "type": "field",
          "value": "order.line_items.formatted_options_amount",
        },
        {
          "type": "field",
          "value": "order.line_items.discount_cents",
        },
        {
          "type": "field",
          "value": "order.line_items.discount_float",
        },
        {
          "type": "field",
          "value": "order.line_items.formatted_discount",
        },
        {
          "type": "field",
          "value": "order.line_items.total_amount_cents",
        },
        {
          "type": "field",
          "value": "order.line_items.total_amount_float",
        },
        {
          "type": "field",
          "value": "order.line_items.formatted_total_amount",
        },
        {
          "type": "field",
          "value": "order.line_items.tax_amount_cents",
        },
        {
          "type": "field",
          "value": "order.line_items.tax_amount_float",
        },
        {
          "type": "field",
          "value": "order.line_items.formatted_tax_amount",
        },
        {
          "type": "field",
          "value": "order.line_items.name",
        },
        {
          "type": "field",
          "value": "order.line_items.image_url",
        },
        {
          "type": "field",
          "value": "order.line_items.discount_breakdown",
        },
        {
          "type": "field",
          "value": "order.line_items.tax_rate",
        },
        {
          "type": "field",
          "value": "order.line_items.tax_breakdown",
        },
        {
          "type": "field",
          "value": "order.line_items.item_type",
        },
        {
          "type": "field",
          "value": "order.line_items.frequency",
        },
        {
          "type": "field",
          "value": "order.line_items.coupon_code",
        },
        {
          "type": "field",
          "value": "order.line_items.rule_outcomes",
        },
        {
          "type": "field",
          "value": "order.line_items.id",
        },
        {
          "type": "field",
          "value": "order.line_items.circuit_state",
        },
        {
          "type": "field",
          "value": "order.line_items.circuit_failure_count",
        },
        {
          "type": "field",
          "value": "order.line_items.created_at",
        },
        {
          "type": "field",
          "value": "order.line_items.updated_at",
        },
        {
          "type": "field",
          "value": "order.line_items.reference",
        },
        {
          "type": "field",
          "value": "order.line_items.reference_origin",
        },
        {
          "type": "field",
          "value": "order.line_items.metadata",
        },
        {
          "type": "relationship",
          "value": "order.line_items.order",
        },
        {
          "type": "relationship",
          "value": "order.line_items.sku",
        },
        {
          "type": "relationship",
          "value": "order.line_items.bundle",
        },
        {
          "type": "relationship",
          "value": "order.line_items.adjustment",
        },
        {
          "type": "relationship",
          "value": "order.line_items.gift_card",
        },
        {
          "type": "relationship",
          "value": "order.line_items.shipment",
        },
        {
          "type": "relationship",
          "value": "order.line_items.payment_method",
        },
        {
          "type": "relationship",
          "value": "order.line_items.line_item_options",
        },
        {
          "type": "relationship",
          "value": "order.line_items.return_line_items",
        },
        {
          "type": "relationship",
          "value": "order.line_items.shipment_line_items",
        },
        {
          "type": "relationship",
          "value": "order.line_items.stock_reservations",
        },
        {
          "type": "relationship",
          "value": "order.line_items.stock_line_items",
        },
        {
          "type": "relationship",
          "value": "order.line_items.stock_transfers",
        },
        {
          "type": "relationship",
          "value": "order.line_items.notifications",
        },
        {
          "type": "relationship",
          "value": "order.line_items.events",
        },
        {
          "type": "relationship",
          "value": "order.line_items.tags",
        },
      ]
    `)
  })

  it('it should return the 4th level for autocompletion', async () => {
    expect(
      await fetchCoreResourcesSuggestions(['order'], 'order.line_items.events.')
    ).toMatchInlineSnapshot(`
      [
        {
          "type": "field",
          "value": "order.line_items.events.name",
        },
        {
          "type": "field",
          "value": "order.line_items.events.id",
        },
        {
          "type": "field",
          "value": "order.line_items.events.created_at",
        },
        {
          "type": "field",
          "value": "order.line_items.events.updated_at",
        },
        {
          "type": "field",
          "value": "order.line_items.events.reference",
        },
        {
          "type": "field",
          "value": "order.line_items.events.reference_origin",
        },
        {
          "type": "field",
          "value": "order.line_items.events.metadata",
        },
        {
          "type": "relationship",
          "value": "order.line_items.events.webhooks",
        },
        {
          "type": "relationship",
          "value": "order.line_items.events.last_event_callbacks",
        },
      ]
    `)
  })

  it('it should stop generating autocompletion when a field is reached', async () => {
    expect(
      await fetchCoreResourcesSuggestions(['order'], 'order.number.')
    ).toMatchInlineSnapshot(orderSuggestionsSnapshot)
  })
})

describe('atPath', () => {
  it('should handle known resourceId', async () => {
    expect(await atPath('order')).toEqual(
      expect.objectContaining({
        resource: expect.objectContaining({
          fields: expect.arrayContaining([
            expect.arrayContaining(['id']),
            expect.arrayContaining(['number'])
          ]),
          relationships: expect.arrayContaining([
            expect.arrayContaining(['versions']),
            expect.arrayContaining(['line_items'])
          ])
        }),
        resourcePath: 'order'
      })
    )
  })

  it('should handle unknown resourceId', async () => {
    expect(await atPath('ore')).toEqual(
      expect.objectContaining({
        resource: undefined,
        resourcePath: ''
      })
    )
  })

  it('should handle fields', async () => {
    expect(await atPath('order.number')).toEqual(
      expect.objectContaining({
        resource: expect.objectContaining({
          fields: expect.arrayContaining([
            expect.arrayContaining(['id']),
            expect.arrayContaining(['number'])
          ]),
          relationships: expect.arrayContaining([
            expect.arrayContaining(['versions']),
            expect.arrayContaining(['line_items'])
          ])
        }),
        resourcePath: 'order'
      })
    )
  })

  it('should handle nested relationships', async () => {
    expect(
      await atPath('price.jwt_markets.price_list.prices.currency_code')
    ).toEqual(
      expect.objectContaining({
        resource: expect.objectContaining({
          fields: expect.arrayContaining([
            expect.arrayContaining(['currency_code']),
            expect.arrayContaining(['sku_code']),
            expect.arrayContaining(['amount_cents'])
          ]),
          relationships: expect.arrayContaining([
            expect.arrayContaining(['price_list']),
            expect.arrayContaining(['sku'])
          ])
        }),
        resourcePath: 'price.jwt_markets.price_list.prices'
      })
    )
  })

  it('should hide polymorphic relationships', async () => {
    expect(await atPath('order.attachments.attachable')).toEqual(
      expect.objectContaining({
        resource: expect.objectContaining({
          fields: expect.arrayContaining([
            expect.arrayContaining(['name']),
            expect.arrayContaining(['description']),
            expect.arrayContaining(['url'])
          ]),
          relationships: []
        }),
        resourcePath: 'order.attachments'
      })
    )
  })
})

const orderSuggestionsSnapshot = `
  [
    {
      "type": "field",
      "value": "order.number",
    },
    {
      "type": "field",
      "value": "order.affiliate_code",
    },
    {
      "type": "field",
      "value": "order.autorefresh",
    },
    {
      "type": "field",
      "value": "order.place_async",
    },
    {
      "type": "field",
      "value": "order.status",
    },
    {
      "type": "field",
      "value": "order.payment_status",
    },
    {
      "type": "field",
      "value": "order.fulfillment_status",
    },
    {
      "type": "field",
      "value": "order.guest",
    },
    {
      "type": "field",
      "value": "order.editable",
    },
    {
      "type": "field",
      "value": "order.customer_email",
    },
    {
      "type": "field",
      "value": "order.customer_password",
    },
    {
      "type": "field",
      "value": "order.language_code",
    },
    {
      "type": "field",
      "value": "order.currency_code",
    },
    {
      "type": "field",
      "value": "order.tax_included",
    },
    {
      "type": "field",
      "value": "order.tax_rate",
    },
    {
      "type": "field",
      "value": "order.freight_taxable",
    },
    {
      "type": "field",
      "value": "order.payment_method_taxable",
    },
    {
      "type": "field",
      "value": "order.adjustment_taxable",
    },
    {
      "type": "field",
      "value": "order.gift_card_taxable",
    },
    {
      "type": "field",
      "value": "order.requires_billing_info",
    },
    {
      "type": "field",
      "value": "order.country_code",
    },
    {
      "type": "field",
      "value": "order.shipping_country_code_lock",
    },
    {
      "type": "field",
      "value": "order.coupon_code",
    },
    {
      "type": "field",
      "value": "order.gift_card_code",
    },
    {
      "type": "field",
      "value": "order.gift_card_or_coupon_code",
    },
    {
      "type": "field",
      "value": "order.subtotal_amount_cents",
    },
    {
      "type": "field",
      "value": "order.subtotal_amount_float",
    },
    {
      "type": "field",
      "value": "order.formatted_subtotal_amount",
    },
    {
      "type": "field",
      "value": "order.shipping_amount_cents",
    },
    {
      "type": "field",
      "value": "order.shipping_amount_float",
    },
    {
      "type": "field",
      "value": "order.formatted_shipping_amount",
    },
    {
      "type": "field",
      "value": "order.payment_method_amount_cents",
    },
    {
      "type": "field",
      "value": "order.payment_method_amount_float",
    },
    {
      "type": "field",
      "value": "order.formatted_payment_method_amount",
    },
    {
      "type": "field",
      "value": "order.discount_amount_cents",
    },
    {
      "type": "field",
      "value": "order.discount_amount_float",
    },
    {
      "type": "field",
      "value": "order.formatted_discount_amount",
    },
    {
      "type": "field",
      "value": "order.adjustment_amount_cents",
    },
    {
      "type": "field",
      "value": "order.adjustment_amount_float",
    },
    {
      "type": "field",
      "value": "order.formatted_adjustment_amount",
    },
    {
      "type": "field",
      "value": "order.gift_card_amount_cents",
    },
    {
      "type": "field",
      "value": "order.gift_card_amount_float",
    },
    {
      "type": "field",
      "value": "order.formatted_gift_card_amount",
    },
    {
      "type": "field",
      "value": "order.total_tax_amount_cents",
    },
    {
      "type": "field",
      "value": "order.total_tax_amount_float",
    },
    {
      "type": "field",
      "value": "order.formatted_total_tax_amount",
    },
    {
      "type": "field",
      "value": "order.subtotal_tax_amount_cents",
    },
    {
      "type": "field",
      "value": "order.subtotal_tax_amount_float",
    },
    {
      "type": "field",
      "value": "order.formatted_subtotal_tax_amount",
    },
    {
      "type": "field",
      "value": "order.shipping_tax_amount_cents",
    },
    {
      "type": "field",
      "value": "order.shipping_tax_amount_float",
    },
    {
      "type": "field",
      "value": "order.formatted_shipping_tax_amount",
    },
    {
      "type": "field",
      "value": "order.payment_method_tax_amount_cents",
    },
    {
      "type": "field",
      "value": "order.payment_method_tax_amount_float",
    },
    {
      "type": "field",
      "value": "order.formatted_payment_method_tax_amount",
    },
    {
      "type": "field",
      "value": "order.adjustment_tax_amount_cents",
    },
    {
      "type": "field",
      "value": "order.adjustment_tax_amount_float",
    },
    {
      "type": "field",
      "value": "order.formatted_adjustment_tax_amount",
    },
    {
      "type": "field",
      "value": "order.total_amount_cents",
    },
    {
      "type": "field",
      "value": "order.total_amount_float",
    },
    {
      "type": "field",
      "value": "order.formatted_total_amount",
    },
    {
      "type": "field",
      "value": "order.total_taxable_amount_cents",
    },
    {
      "type": "field",
      "value": "order.total_taxable_amount_float",
    },
    {
      "type": "field",
      "value": "order.formatted_total_taxable_amount",
    },
    {
      "type": "field",
      "value": "order.subtotal_taxable_amount_cents",
    },
    {
      "type": "field",
      "value": "order.subtotal_taxable_amount_float",
    },
    {
      "type": "field",
      "value": "order.formatted_subtotal_taxable_amount",
    },
    {
      "type": "field",
      "value": "order.shipping_taxable_amount_cents",
    },
    {
      "type": "field",
      "value": "order.shipping_taxable_amount_float",
    },
    {
      "type": "field",
      "value": "order.formatted_shipping_taxable_amount",
    },
    {
      "type": "field",
      "value": "order.payment_method_taxable_amount_cents",
    },
    {
      "type": "field",
      "value": "order.payment_method_taxable_amount_float",
    },
    {
      "type": "field",
      "value": "order.formatted_payment_method_taxable_amount",
    },
    {
      "type": "field",
      "value": "order.adjustment_taxable_amount_cents",
    },
    {
      "type": "field",
      "value": "order.adjustment_taxable_amount_float",
    },
    {
      "type": "field",
      "value": "order.formatted_adjustment_taxable_amount",
    },
    {
      "type": "field",
      "value": "order.total_amount_with_taxes_cents",
    },
    {
      "type": "field",
      "value": "order.total_amount_with_taxes_float",
    },
    {
      "type": "field",
      "value": "order.formatted_total_amount_with_taxes",
    },
    {
      "type": "field",
      "value": "order.fees_amount_cents",
    },
    {
      "type": "field",
      "value": "order.fees_amount_float",
    },
    {
      "type": "field",
      "value": "order.formatted_fees_amount",
    },
    {
      "type": "field",
      "value": "order.duty_amount_cents",
    },
    {
      "type": "field",
      "value": "order.duty_amount_float",
    },
    {
      "type": "field",
      "value": "order.formatted_duty_amount",
    },
    {
      "type": "field",
      "value": "order.place_total_amount_cents",
    },
    {
      "type": "field",
      "value": "order.place_total_amount_float",
    },
    {
      "type": "field",
      "value": "order.formatted_place_total_amount",
    },
    {
      "type": "field",
      "value": "order.skus_count",
    },
    {
      "type": "field",
      "value": "order.line_item_options_count",
    },
    {
      "type": "field",
      "value": "order.shipments_count",
    },
    {
      "type": "field",
      "value": "order.tax_calculations_count",
    },
    {
      "type": "field",
      "value": "order.validations_count",
    },
    {
      "type": "field",
      "value": "order.errors_count",
    },
    {
      "type": "field",
      "value": "order.payment_source_details",
    },
    {
      "type": "field",
      "value": "order.token",
    },
    {
      "type": "field",
      "value": "order.cart_url",
    },
    {
      "type": "field",
      "value": "order.return_url",
    },
    {
      "type": "field",
      "value": "order.terms_url",
    },
    {
      "type": "field",
      "value": "order.privacy_url",
    },
    {
      "type": "field",
      "value": "order.checkout_url",
    },
    {
      "type": "field",
      "value": "order.placed_at",
    },
    {
      "type": "field",
      "value": "order.approved_at",
    },
    {
      "type": "field",
      "value": "order.cancelled_at",
    },
    {
      "type": "field",
      "value": "order.payment_updated_at",
    },
    {
      "type": "field",
      "value": "order.fulfillment_updated_at",
    },
    {
      "type": "field",
      "value": "order.refreshed_at",
    },
    {
      "type": "field",
      "value": "order.archived_at",
    },
    {
      "type": "field",
      "value": "order.subscription_created_at",
    },
    {
      "type": "field",
      "value": "order.id",
    },
    {
      "type": "field",
      "value": "order.circuit_state",
    },
    {
      "type": "field",
      "value": "order.circuit_failure_count",
    },
    {
      "type": "field",
      "value": "order.created_at",
    },
    {
      "type": "field",
      "value": "order.updated_at",
    },
    {
      "type": "field",
      "value": "order.reference",
    },
    {
      "type": "field",
      "value": "order.reference_origin",
    },
    {
      "type": "field",
      "value": "order.metadata",
    },
    {
      "type": "relationship",
      "value": "order.market",
    },
    {
      "type": "relationship",
      "value": "order.customer",
    },
    {
      "type": "relationship",
      "value": "order.shipping_address",
    },
    {
      "type": "relationship",
      "value": "order.billing_address",
    },
    {
      "type": "relationship",
      "value": "order.store",
    },
    {
      "type": "relationship",
      "value": "order.default_shipping_method",
    },
    {
      "type": "relationship",
      "value": "order.default_payment_method",
    },
    {
      "type": "relationship",
      "value": "order.available_payment_methods",
    },
    {
      "type": "relationship",
      "value": "order.available_customer_payment_sources",
    },
    {
      "type": "relationship",
      "value": "order.available_free_skus",
    },
    {
      "type": "relationship",
      "value": "order.available_free_bundles",
    },
    {
      "type": "relationship",
      "value": "order.payment_method",
    },
    {
      "type": "relationship",
      "value": "order.discount_engine_item",
    },
    {
      "type": "relationship",
      "value": "order.line_items",
    },
    {
      "type": "relationship",
      "value": "order.line_item_options",
    },
    {
      "type": "relationship",
      "value": "order.stock_reservations",
    },
    {
      "type": "relationship",
      "value": "order.stock_line_items",
    },
    {
      "type": "relationship",
      "value": "order.stock_transfers",
    },
    {
      "type": "relationship",
      "value": "order.shipments",
    },
    {
      "type": "relationship",
      "value": "order.payment_options",
    },
    {
      "type": "relationship",
      "value": "order.transactions",
    },
    {
      "type": "relationship",
      "value": "order.authorizations",
    },
    {
      "type": "relationship",
      "value": "order.captures",
    },
    {
      "type": "relationship",
      "value": "order.voids",
    },
    {
      "type": "relationship",
      "value": "order.refunds",
    },
    {
      "type": "relationship",
      "value": "order.returns",
    },
    {
      "type": "relationship",
      "value": "order.order_subscription",
    },
    {
      "type": "relationship",
      "value": "order.order_subscriptions",
    },
    {
      "type": "relationship",
      "value": "order.order_factories",
    },
    {
      "type": "relationship",
      "value": "order.order_copies",
    },
    {
      "type": "relationship",
      "value": "order.recurring_order_copies",
    },
    {
      "type": "relationship",
      "value": "order.attachments",
    },
    {
      "type": "relationship",
      "value": "order.notifications",
    },
    {
      "type": "relationship",
      "value": "order.links",
    },
    {
      "type": "relationship",
      "value": "order.resource_errors",
    },
    {
      "type": "relationship",
      "value": "order.events",
    },
    {
      "type": "relationship",
      "value": "order.tags",
    },
    {
      "type": "relationship",
      "value": "order.versions",
    },
  ]
`
