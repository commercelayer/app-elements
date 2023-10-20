import { rest } from 'msw'

const restPatch = rest.patch(
  `https://mock.localhost/api/line_items/:id`,
  async (req, res, ctx) => {
    return await res(
      ctx.status(200),
      ctx.delay(1000),
      ctx.body(`Update ${req.params.id.toString()}`)
    )
  }
)

const restDelete = rest.delete(
  `https://mock.localhost/api/line_items/:id`,
  async (req, res, ctx) => {
    return await res(
      ctx.status(200),
      ctx.delay(1000),
      ctx.body(`Removed ${req.params.id.toString()}`)
    )
  }
)

const restPost = rest.post(
  `https://mock.localhost/api/line_items`,
  async (req, res, ctx) => {
    return await res(
      ctx.status(200),
      ctx.delay(1000),
      ctx.json({
        data: {
          id: 'vrEAtOmRaz',
          type: 'line_items',
          links: {
            self: 'https://mock.localhost/api/line_items/vrEAtOmRaz'
          },
          attributes: {
            sku_code: null,
            bundle_code: null,
            quantity: 1,
            currency_code: 'EUR',
            unit_amount_cents: -100,
            unit_amount_float: -1.0,
            formatted_unit_amount: '-€1,00',
            options_amount_cents: 0,
            options_amount_float: 0.0,
            formatted_options_amount: '€0,00',
            discount_cents: 0,
            discount_float: 0.0,
            formatted_discount: '€0,00',
            total_amount_cents: -100,
            total_amount_float: -1.0,
            formatted_total_amount: '-€1,00',
            tax_amount_cents: 0,
            tax_amount_float: 0.0,
            formatted_tax_amount: '€0,00',
            name: 'Manual adjustment',
            image_url: null,
            discount_breakdown: {},
            tax_rate: 0.0,
            tax_breakdown: {},
            item_type: 'adjustments',
            frequency: null,
            created_at: '2023-08-23T15:59:30.205Z',
            updated_at: '2023-08-23T15:59:30.205Z',
            reference: null,
            reference_origin: null,
            metadata: {}
          }
        }
      })
    )
  }
)

const restGet = rest.get(
  `https://mock.localhost/api/line_items/:id`,
  async (req, res, ctx) => {
    return await res(
      ctx.status(200),
      ctx.delay(1000),
      ctx.json({
        data: {
          id: 'kxnXtlMPoN',
          type: 'line_items',
          links: {
            self: 'https://mock.localhost/api/line_items/kxnXtlMPoN'
          },
          attributes: {
            sku_code: null,
            bundle_code: null,
            quantity: 1,
            currency_code: 'EUR',
            unit_amount_cents: -100,
            unit_amount_float: -1.0,
            formatted_unit_amount: '-€1,00',
            options_amount_cents: 0,
            options_amount_float: 0.0,
            formatted_options_amount: '€0,00',
            discount_cents: 0,
            discount_float: 0.0,
            formatted_discount: '€0,00',
            total_amount_cents: -100,
            total_amount_float: -1.0,
            formatted_total_amount: '-€1,00',
            tax_amount_cents: 0,
            tax_amount_float: 0.0,
            formatted_tax_amount: '€0,00',
            name: 'Manual adjustment',
            image_url: null,
            discount_breakdown: {},
            tax_rate: 0.0,
            tax_breakdown: {},
            item_type: 'adjustments',
            frequency: null,
            coupon_code: null,
            created_at: '2023-10-20T14:11:46.223Z',
            updated_at: '2023-10-20T14:11:46.223Z',
            reference: null,
            reference_origin: 'app-orders--manual-adjustment',
            metadata: {}
          },
          relationships: {
            order: {
              links: {
                self: 'https://mock.localhost/api/line_items/kxnXtlMPoN/relationships/order',
                related:
                  'https://mock.localhost/api/line_items/kxnXtlMPoN/order'
              }
            },
            item: {
              links: {
                self: 'https://mock.localhost/api/line_items/kxnXtlMPoN/relationships/item',
                related: 'https://mock.localhost/api/line_items/kxnXtlMPoN/item'
              },
              data: {
                type: 'adjustments',
                id: 'QWOaGhpKbd'
              }
            },
            sku: {
              links: {
                self: 'https://mock.localhost/api/line_items/kxnXtlMPoN/relationships/sku',
                related: 'https://mock.localhost/api/line_items/kxnXtlMPoN/sku'
              }
            },
            bundle: {
              links: {
                self: 'https://mock.localhost/api/line_items/kxnXtlMPoN/relationships/bundle',
                related:
                  'https://mock.localhost/api/line_items/kxnXtlMPoN/bundle'
              }
            },
            line_item_options: {
              links: {
                self: 'https://mock.localhost/api/line_items/kxnXtlMPoN/relationships/line_item_options',
                related:
                  'https://mock.localhost/api/line_items/kxnXtlMPoN/line_item_options'
              }
            },
            shipment_line_items: {
              links: {
                self: 'https://mock.localhost/api/line_items/kxnXtlMPoN/relationships/shipment_line_items',
                related:
                  'https://mock.localhost/api/line_items/kxnXtlMPoN/shipment_line_items'
              }
            },
            stock_reservations: {
              links: {
                self: 'https://mock.localhost/api/line_items/kxnXtlMPoN/relationships/stock_reservations',
                related:
                  'https://mock.localhost/api/line_items/kxnXtlMPoN/stock_reservations'
              }
            },
            stock_line_items: {
              links: {
                self: 'https://mock.localhost/api/line_items/kxnXtlMPoN/relationships/stock_line_items',
                related:
                  'https://mock.localhost/api/line_items/kxnXtlMPoN/stock_line_items'
              }
            },
            stock_transfers: {
              links: {
                self: 'https://mock.localhost/api/line_items/kxnXtlMPoN/relationships/stock_transfers',
                related:
                  'https://mock.localhost/api/line_items/kxnXtlMPoN/stock_transfers'
              }
            },
            events: {
              links: {
                self: 'https://mock.localhost/api/line_items/kxnXtlMPoN/relationships/events',
                related:
                  'https://mock.localhost/api/line_items/kxnXtlMPoN/events'
              }
            },
            tags: {
              links: {
                self: 'https://mock.localhost/api/line_items/kxnXtlMPoN/relationships/tags',
                related: 'https://mock.localhost/api/line_items/kxnXtlMPoN/tags'
              }
            }
          },
          meta: {
            mode: 'test',
            organization_id: 'WXlEOFrjnr'
          }
        },
        included: [
          {
            id: 'QWOaGhpKbd',
            type: 'adjustments',
            links: {
              self: 'https://mock.localhost/api/adjustments/QWOaGhpKbd'
            },
            attributes: {
              name: 'Manual adjustment',
              currency_code: 'EUR',
              amount_cents: -100,
              amount_float: -1.0,
              formatted_amount: '-€1,00',
              created_at: '2023-10-20T14:11:46.083Z',
              updated_at: '2023-10-20T14:11:46.083Z',
              reference: null,
              reference_origin: 'app-orders--manual-adjustment',
              metadata: {}
            },
            relationships: {
              versions: {
                links: {
                  self: 'https://mock.localhost/api/adjustments/QWOaGhpKbd/relationships/versions',
                  related:
                    'https://mock.localhost/api/adjustments/QWOaGhpKbd/versions'
                }
              }
            },
            meta: {
              mode: 'test',
              organization_id: 'WXlEOFrjnr'
            }
          }
        ]
      })
    )
  }
)

export default [restGet, restPatch, restDelete, restPost]
