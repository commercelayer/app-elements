import { rest } from 'msw'

const orderDetail = rest.get(
  'https://mock.localhost/api/orders/NMWYhbGorj?include=shipments,transactions,payment_method,payment_source,attachments',
  async (req, res, ctx) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          res(
            ctx.status(200),
            ctx.json({
              data: {
                id: 'NMWYhbGorj',
                type: 'orders',
                links: {
                  self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj'
                },
                attributes: {
                  number: 2485862,
                  autorefresh: true,
                  status: 'approved',
                  payment_status: 'paid',
                  fulfillment_status: 'in_progress',
                  guest: true,
                  editable: false,
                  customer_email: 'customer@tk.com',
                  language_code: 'en',
                  currency_code: 'EUR',
                  tax_included: true,
                  tax_rate: null,
                  freight_taxable: null,
                  requires_billing_info: true,
                  country_code: 'IT',
                  shipping_country_code_lock: null,
                  coupon_code: null,
                  gift_card_code: '9951a05f-741a-4ab1-8405-2a7e57612792',
                  gift_card_or_coupon_code:
                    '9951a05f-741a-4ab1-8405-2a7e57612792',
                  subtotal_amount_cents: 24400,
                  subtotal_amount_float: 244.0,
                  formatted_subtotal_amount: '€244,00',
                  shipping_amount_cents: 0,
                  shipping_amount_float: 0.0,
                  formatted_shipping_amount: '€0,00',
                  payment_method_amount_cents: 1000,
                  payment_method_amount_float: 10.0,
                  formatted_payment_method_amount: '€10,00',
                  discount_amount_cents: 0,
                  discount_amount_float: 0.0,
                  formatted_discount_amount: '€0,00',
                  adjustment_amount_cents: 0,
                  adjustment_amount_float: 0.0,
                  formatted_adjustment_amount: '€0,00',
                  gift_card_amount_cents: -10000,
                  gift_card_amount_float: -100.0,
                  formatted_gift_card_amount: '-€100,00',
                  total_tax_amount_cents: 0,
                  total_tax_amount_float: 0.0,
                  formatted_total_tax_amount: '€0,00',
                  subtotal_tax_amount_cents: 0,
                  subtotal_tax_amount_float: 0.0,
                  formatted_subtotal_tax_amount: '€0,00',
                  shipping_tax_amount_cents: 0,
                  shipping_tax_amount_float: 0.0,
                  formatted_shipping_tax_amount: '€0,00',
                  payment_method_tax_amount_cents: 0,
                  payment_method_tax_amount_float: 0.0,
                  formatted_payment_method_tax_amount: '€0,00',
                  adjustment_tax_amount_cents: 0,
                  adjustment_tax_amount_float: 0.0,
                  formatted_adjustment_tax_amount: '€0,00',
                  total_amount_cents: 25400,
                  total_amount_float: 254.0,
                  formatted_total_amount: '€254,00',
                  total_taxable_amount_cents: 25400,
                  total_taxable_amount_float: 254.0,
                  formatted_total_taxable_amount: '€254,00',
                  subtotal_taxable_amount_cents: 24400,
                  subtotal_taxable_amount_float: 244.0,
                  formatted_subtotal_taxable_amount: '€244,00',
                  shipping_taxable_amount_cents: 0,
                  shipping_taxable_amount_float: 0.0,
                  formatted_shipping_taxable_amount: '€0,00',
                  payment_method_taxable_amount_cents: 1000,
                  payment_method_taxable_amount_float: 10.0,
                  formatted_payment_method_taxable_amount: '€10,00',
                  adjustment_taxable_amount_cents: 0,
                  adjustment_taxable_amount_float: 0.0,
                  formatted_adjustment_taxable_amount: '€0,00',
                  total_amount_with_taxes_cents: 15400,
                  total_amount_with_taxes_float: 154.0,
                  formatted_total_amount_with_taxes: '€154,00',
                  fees_amount_cents: 0,
                  fees_amount_float: 0.0,
                  formatted_fees_amount: '€0,00',
                  duty_amount_cents: null,
                  duty_amount_float: null,
                  formatted_duty_amount: null,
                  skus_count: 6,
                  line_item_options_count: 0,
                  shipments_count: 2,
                  tax_calculations_count: 0,
                  validations_count: 0,
                  payment_source_details: {
                    type: 'stripe_payment',
                    payment_method_id: 'pm_1N8LhuK5j6INEBBIHXkK0FFF',
                    payment_method_type: 'card',
                    payment_method_details: {
                      brand: 'visa',
                      last4: '4242',
                      checks: {
                        cvc_check: 'pass',
                        address_line1_check: 'pass',
                        address_postal_code_check: 'pass'
                      },
                      wallet: null,
                      country: 'US',
                      funding: 'credit',
                      exp_year: 2031,
                      networks: { available: ['visa'], preferred: null },
                      exp_month: 2,
                      fingerprint: 'bVaeOEKRmYhi20Nj',
                      generated_from: null,
                      three_d_secure_usage: { supported: true }
                    }
                  },
                  token: '7fe6285a3dfdabeb8cb9324980743396',
                  cart_url: null,
                  return_url: null,
                  terms_url: null,
                  privacy_url: null,
                  checkout_url: null,
                  placed_at: '2023-05-16T11:06:22.012Z',
                  approved_at: '2023-05-16T14:18:16.775Z',
                  cancelled_at: null,
                  payment_updated_at: '2023-05-16T14:18:35.404Z',
                  fulfillment_updated_at: '2023-05-16T14:18:35.411Z',
                  refreshed_at: '2023-05-16T11:06:04.613Z',
                  archived_at: null,
                  expires_at: null,
                  subscription_created_at: null,
                  created_at: '2023-05-16T11:06:02.074Z',
                  updated_at: '2023-05-16T14:18:35.572Z',
                  reference: null,
                  reference_origin: null,
                  metadata: {}
                },
                relationships: {
                  market: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/market',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/market'
                    }
                  },
                  customer: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/customer',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/customer'
                    }
                  },
                  shipping_address: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/shipping_address',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/shipping_address'
                    }
                  },
                  billing_address: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/billing_address',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/billing_address'
                    }
                  },
                  available_payment_methods: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/available_payment_methods',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/available_payment_methods'
                    }
                  },
                  available_customer_payment_sources: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/available_customer_payment_sources',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/available_customer_payment_sources'
                    }
                  },
                  available_free_skus: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/available_free_skus',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/available_free_skus'
                    }
                  },
                  available_free_bundles: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/available_free_bundles',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/available_free_bundles'
                    }
                  },
                  payment_method: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/payment_method',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/payment_method'
                    },
                    data: { type: 'payment_methods', id: 'wmBvQsARml' }
                  },
                  payment_source: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/payment_source',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/payment_source'
                    },
                    data: { type: 'stripe_payments', id: 'onXELSmbQy' }
                  },
                  line_items: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/line_items',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/line_items'
                    }
                  },
                  shipments: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/shipments',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/shipments'
                    },
                    data: [
                      { type: 'shipments', id: 'YpLwCnNQgY' },
                      { type: 'shipments', id: 'PabvCpOxRy' }
                    ]
                  },
                  transactions: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/transactions',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/transactions'
                    },
                    data: [
                      { type: 'authorizations', id: 'nKZkPUDBVj' },
                      { type: 'captures', id: 'kyAnxUgegE' }
                    ]
                  },
                  authorizations: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/authorizations',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/authorizations'
                    }
                  },
                  captures: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/captures',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/captures'
                    }
                  },
                  voids: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/voids',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/voids'
                    }
                  },
                  refunds: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/refunds',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/refunds'
                    }
                  },
                  returns: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/returns',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/returns'
                    }
                  },
                  order_subscriptions: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/order_subscriptions',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/order_subscriptions'
                    }
                  },
                  order_factories: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/order_factories',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/order_factories'
                    }
                  },
                  order_copies: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/order_copies',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/order_copies'
                    }
                  },
                  recurring_order_copies: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/recurring_order_copies',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/recurring_order_copies'
                    }
                  },
                  attachments: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/attachments',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/attachments'
                    },
                    data: [{ type: 'attachments', id: 'EqGrksxWNW' }]
                  },
                  events: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/events',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/events'
                    }
                  },
                  tags: {
                    links: {
                      self: 'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/relationships/tags',
                      related:
                        'https://alessani.commercelayer.co/api/orders/NMWYhbGorj/tags'
                    }
                  }
                },
                meta: { mode: 'test', organization_id: 'WXlEOFrjnr' }
              },
              included: [
                {
                  id: 'wmBvQsARml',
                  type: 'payment_methods',
                  links: {
                    self: 'https://alessani.commercelayer.co/api/payment_methods/wmBvQsARml'
                  },
                  attributes: {
                    payment_source_type: 'stripe_payments',
                    name: 'Stripe Payment',
                    currency_code: 'EUR',
                    moto: false,
                    require_capture: true,
                    auto_capture: false,
                    disabled_at: null,
                    price_amount_cents: 1000,
                    price_amount_float: 10.0,
                    formatted_price_amount: '€10,00',
                    auto_capture_max_amount_cents: null,
                    auto_capture_max_amount_float: null,
                    formatted_auto_capture_max_amount: null,
                    created_at: '2022-03-11T14:18:08.420Z',
                    updated_at: '2022-03-11T14:18:08.420Z',
                    reference: '',
                    reference_origin: '',
                    metadata: {}
                  },
                  relationships: {
                    market: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/payment_methods/wmBvQsARml/relationships/market',
                        related:
                          'https://alessani.commercelayer.co/api/payment_methods/wmBvQsARml/market'
                      }
                    },
                    payment_gateway: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/payment_methods/wmBvQsARml/relationships/payment_gateway',
                        related:
                          'https://alessani.commercelayer.co/api/payment_methods/wmBvQsARml/payment_gateway'
                      }
                    },
                    attachments: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/payment_methods/wmBvQsARml/relationships/attachments',
                        related:
                          'https://alessani.commercelayer.co/api/payment_methods/wmBvQsARml/attachments'
                      }
                    }
                  },
                  meta: { mode: 'test', organization_id: 'WXlEOFrjnr' }
                },
                {
                  id: 'onXELSmbQy',
                  type: 'stripe_payments',
                  links: {
                    self: 'https://alessani.commercelayer.co/api/stripe_payments/onXELSmbQy'
                  },
                  attributes: {
                    client_secret:
                      'pi_3N8LhsK5j6INEBBI0JicoLOo_secret_CKWfEPSnvyBHIQrEfRXkrJYd7',
                    publishable_key:
                      'pk_test_51KH86yK5j6INEBBIdkXoh0UwOoOlAbFZc3b8j0vjRHKQHdaUfEJm24F0A9QkrQXVlgh1nXJCpWR6PG3epaUWzE2z00BdEe9fho',
                    options: {
                      id: 'pm_1N8LhuK5j6INEBBI71U1QOlu',
                      card: {
                        brand: 'visa',
                        last4: '4242',
                        checks: {
                          cvc_check: null,
                          address_line1_check: null,
                          address_postal_code_check: null
                        },
                        wallet: null,
                        country: 'US',
                        funding: 'credit',
                        exp_year: 2031,
                        networks: { available: ['visa'], preferred: null },
                        exp_month: 2,
                        generated_from: null,
                        three_d_secure_usage: { supported: true }
                      },
                      type: 'card',
                      object: 'payment_method',
                      created: 1684235178,
                      customer: null,
                      livemode: false,
                      billing_details: {
                        name: 'Darth Vader',
                        email: 'customer@tk.com',
                        phone: '+39 055 1234567890',
                        address: {
                          city: 'Cogorno',
                          line1: 'Via Morte Nera, 13',
                          line2: null,
                          state: 'GE',
                          country: 'IT',
                          postal_code: '16030'
                        }
                      },
                      setup_future_usage: 'off_session',
                      intent_amount_cents: 15400
                    },
                    payment_method: {
                      id: 'pm_1N8LhuK5j6INEBBIHXkK0FFF',
                      card: {
                        brand: 'visa',
                        last4: '4242',
                        checks: {
                          cvc_check: 'pass',
                          address_line1_check: 'pass',
                          address_postal_code_check: 'pass'
                        },
                        wallet: null,
                        country: 'US',
                        funding: 'credit',
                        exp_year: 2031,
                        networks: { available: ['visa'], preferred: null },
                        exp_month: 2,
                        fingerprint: 'bVaeOEKRmYhi20Nj',
                        generated_from: null,
                        three_d_secure_usage: { supported: true }
                      },
                      type: 'card',
                      object: 'payment_method',
                      created: 1684235179,
                      customer: null,
                      livemode: false,
                      metadata: {},
                      billing_details: {
                        name: 'Darth Vader',
                        email: 'customer@tk.com',
                        phone: '+39 055 1234567890',
                        address: {
                          city: 'Cogorno',
                          line1: 'Via Morte Nera, 13',
                          line2: null,
                          state: 'GE',
                          country: 'IT',
                          postal_code: '16030'
                        }
                      }
                    },
                    mismatched_amounts: false,
                    intent_amount_cents: 15400,
                    intent_amount_float: 154.0,
                    formatted_intent_amount: '€154,00',
                    payment_instrument: {
                      issuer_type: 'card',
                      card_type: 'visa',
                      card_last_digits: '4242',
                      card_expiry_month: '2',
                      card_expiry_year: '2031'
                    },
                    created_at: '2023-05-16T11:06:16.338Z',
                    updated_at: '2023-05-16T11:06:21.948Z',
                    reference: null,
                    reference_origin: null,
                    metadata: {}
                  },
                  relationships: {
                    order: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/stripe_payments/onXELSmbQy/relationships/order',
                        related:
                          'https://alessani.commercelayer.co/api/stripe_payments/onXELSmbQy/order'
                      }
                    },
                    payment_gateway: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/stripe_payments/onXELSmbQy/relationships/payment_gateway',
                        related:
                          'https://alessani.commercelayer.co/api/stripe_payments/onXELSmbQy/payment_gateway'
                      }
                    }
                  },
                  meta: { mode: 'test', organization_id: 'WXlEOFrjnr' }
                },
                {
                  id: 'YpLwCnNQgY',
                  type: 'shipments',
                  links: {
                    self: 'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY'
                  },
                  attributes: {
                    number: '2485862/S/001',
                    status: 'on_hold',
                    currency_code: 'EUR',
                    cost_amount_cents: 0,
                    cost_amount_float: 0.0,
                    formatted_cost_amount: '$0.00',
                    skus_count: 5,
                    selected_rate_id: null,
                    rates: [],
                    purchase_error_code: null,
                    purchase_error_message: null,
                    get_rates_errors: [],
                    get_rates_started_at: null,
                    get_rates_completed_at: null,
                    purchase_started_at: null,
                    purchase_completed_at: null,
                    purchase_failed_at: null,
                    on_hold_at: '2023-05-16T14:18:35.513Z',
                    picking_at: null,
                    packing_at: null,
                    ready_to_ship_at: null,
                    shipped_at: null,
                    created_at: '2023-05-16T11:06:07.685Z',
                    updated_at: '2023-05-16T14:18:35.509Z',
                    reference: null,
                    reference_origin: null,
                    metadata: {}
                  },
                  relationships: {
                    order: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/relationships/order',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/order'
                      }
                    },
                    shipping_category: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/relationships/shipping_category',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/shipping_category'
                      }
                    },
                    stock_location: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/relationships/stock_location',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/stock_location'
                      }
                    },
                    origin_address: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/relationships/origin_address',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/origin_address'
                      }
                    },
                    shipping_address: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/relationships/shipping_address',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/shipping_address'
                      }
                    },
                    shipping_method: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/relationships/shipping_method',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/shipping_method'
                      }
                    },
                    delivery_lead_time: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/relationships/delivery_lead_time',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/delivery_lead_time'
                      }
                    },
                    shipment_line_items: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/relationships/shipment_line_items',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/shipment_line_items'
                      }
                    },
                    stock_line_items: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/relationships/stock_line_items',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/stock_line_items'
                      }
                    },
                    stock_transfers: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/relationships/stock_transfers',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/stock_transfers'
                      }
                    },
                    available_shipping_methods: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/relationships/available_shipping_methods',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/available_shipping_methods'
                      }
                    },
                    carrier_accounts: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/relationships/carrier_accounts',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/carrier_accounts'
                      }
                    },
                    parcels: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/relationships/parcels',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/parcels'
                      }
                    },
                    attachments: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/relationships/attachments',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/attachments'
                      },
                      data: []
                    },
                    events: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/relationships/events',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/YpLwCnNQgY/events'
                      }
                    }
                  },
                  meta: { mode: 'test', organization_id: 'WXlEOFrjnr' }
                },
                {
                  id: 'PabvCpOxRy',
                  type: 'shipments',
                  links: {
                    self: 'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy'
                  },
                  attributes: {
                    number: '2485862/S/002',
                    status: 'shipped',
                    currency_code: 'EUR',
                    cost_amount_cents: 0,
                    cost_amount_float: 0.0,
                    formatted_cost_amount: '$0.00',
                    skus_count: 1,
                    selected_rate_id: null,
                    rates: [],
                    purchase_error_code: null,
                    purchase_error_message: null,
                    get_rates_errors: [],
                    get_rates_started_at: null,
                    get_rates_completed_at: null,
                    purchase_started_at: null,
                    purchase_completed_at: null,
                    purchase_failed_at: null,
                    on_hold_at: null,
                    picking_at: '2023-05-16T14:18:35.559Z',
                    packing_at: '2023-05-16T14:20:24.459Z',
                    ready_to_ship_at: '2023-05-16T14:21:43.665Z',
                    shipped_at: '2023-05-16T14:22:42.632Z',
                    created_at: '2023-05-16T11:06:07.711Z',
                    updated_at: '2023-05-16T14:22:42.633Z',
                    reference: null,
                    reference_origin: null,
                    metadata: {}
                  },
                  relationships: {
                    order: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/relationships/order',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/order'
                      }
                    },
                    shipping_category: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/relationships/shipping_category',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/shipping_category'
                      }
                    },
                    stock_location: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/relationships/stock_location',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/stock_location'
                      }
                    },
                    origin_address: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/relationships/origin_address',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/origin_address'
                      }
                    },
                    shipping_address: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/relationships/shipping_address',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/shipping_address'
                      }
                    },
                    shipping_method: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/relationships/shipping_method',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/shipping_method'
                      }
                    },
                    delivery_lead_time: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/relationships/delivery_lead_time',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/delivery_lead_time'
                      }
                    },
                    shipment_line_items: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/relationships/shipment_line_items',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/shipment_line_items'
                      }
                    },
                    stock_line_items: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/relationships/stock_line_items',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/stock_line_items'
                      }
                    },
                    stock_transfers: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/relationships/stock_transfers',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/stock_transfers'
                      }
                    },
                    available_shipping_methods: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/relationships/available_shipping_methods',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/available_shipping_methods'
                      }
                    },
                    carrier_accounts: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/relationships/carrier_accounts',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/carrier_accounts'
                      }
                    },
                    parcels: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/relationships/parcels',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/parcels'
                      }
                    },
                    attachments: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/relationships/attachments',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/attachments'
                      },
                      data: [{ type: 'attachments', id: 'ZNypWswaOY' }]
                    },
                    events: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/relationships/events',
                        related:
                          'https://alessani.commercelayer.co/api/shipments/PabvCpOxRy/events'
                      }
                    }
                  },
                  meta: { mode: 'test', organization_id: 'WXlEOFrjnr' }
                },
                {
                  id: 'ZNypWswaOY',
                  type: 'attachments',
                  links: {
                    self: 'https://alessani.commercelayer.co/api/attachments/ZNypWswaOY'
                  },
                  attributes: {
                    name: 'M. Montalbano',
                    description: "It's me on Shipment APP",
                    url: null,
                    created_at: '2023-07-20T13:59:29.078Z',
                    updated_at: '2023-07-20T13:59:29.078Z',
                    reference: null,
                    reference_origin: 'app-shipments--note',
                    metadata: {}
                  },
                  relationships: {
                    attachable: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/attachments/ZNypWswaOY/relationships/attachable',
                        related:
                          'https://alessani.commercelayer.co/api/attachments/ZNypWswaOY/attachable'
                      }
                    }
                  },
                  meta: { mode: 'test', organization_id: 'WXlEOFrjnr' }
                },
                {
                  id: 'EqGrksxWNW',
                  type: 'attachments',
                  links: {
                    self: 'https://alessani.commercelayer.co/api/attachments/EqGrksxWNW'
                  },
                  attributes: {
                    name: 'M. Montalbano',
                    description: 'Ehi there!',
                    url: null,
                    created_at: '2023-07-14T13:58:52.184Z',
                    updated_at: '2023-07-14T13:58:52.184Z',
                    reference: null,
                    reference_origin: 'app-orders--note',
                    metadata: {}
                  },
                  relationships: {
                    attachable: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/attachments/EqGrksxWNW/relationships/attachable',
                        related:
                          'https://alessani.commercelayer.co/api/attachments/EqGrksxWNW/attachable'
                      }
                    }
                  },
                  meta: { mode: 'test', organization_id: 'WXlEOFrjnr' }
                },
                {
                  id: 'nKZkPUDBVj',
                  type: 'authorizations',
                  links: {
                    self: 'https://alessani.commercelayer.co/api/authorizations/nKZkPUDBVj'
                  },
                  attributes: {
                    number: '2485862/T/001',
                    currency_code: 'EUR',
                    amount_cents: 15400,
                    amount_float: 154.0,
                    formatted_amount: '€154,00',
                    succeeded: true,
                    message: 'Success!',
                    error_code: null,
                    error_detail: null,
                    token: 'pi_3N8LhsK5j6INEBBI0JicoLOo',
                    gateway_transaction_id: 'pi_3N8LhsK5j6INEBBI0JicoLOo',
                    created_at: '2023-05-16T11:06:21.964Z',
                    updated_at: '2023-05-16T11:06:21.964Z',
                    reference: null,
                    reference_origin: null,
                    metadata: {},
                    cvv_code: null,
                    cvv_message: null,
                    avs_code: null,
                    avs_message: null,
                    fraud_review: null,
                    capture_amount_cents: 0,
                    capture_amount_float: 0.0,
                    formatted_capture_amount: '€0,00',
                    capture_balance_cents: 0,
                    capture_balance_float: 0.0,
                    formatted_capture_balance: '€0,00',
                    void_balance_cents: 15400,
                    void_balance_float: 154.0,
                    formatted_void_balance: '€154,00'
                  },
                  relationships: {
                    order: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/authorizations/nKZkPUDBVj/relationships/order',
                        related:
                          'https://alessani.commercelayer.co/api/authorizations/nKZkPUDBVj/order'
                      }
                    },
                    attachments: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/authorizations/nKZkPUDBVj/relationships/attachments',
                        related:
                          'https://alessani.commercelayer.co/api/authorizations/nKZkPUDBVj/attachments'
                      }
                    },
                    captures: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/authorizations/nKZkPUDBVj/relationships/captures',
                        related:
                          'https://alessani.commercelayer.co/api/authorizations/nKZkPUDBVj/captures'
                      }
                    },
                    voids: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/authorizations/nKZkPUDBVj/relationships/voids',
                        related:
                          'https://alessani.commercelayer.co/api/authorizations/nKZkPUDBVj/voids'
                      }
                    },
                    events: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/authorizations/nKZkPUDBVj/relationships/events',
                        related:
                          'https://alessani.commercelayer.co/api/authorizations/nKZkPUDBVj/events'
                      }
                    }
                  },
                  meta: { mode: 'test', organization_id: 'WXlEOFrjnr' }
                },
                {
                  id: 'kyAnxUgegE',
                  type: 'captures',
                  links: {
                    self: 'https://alessani.commercelayer.co/api/captures/kyAnxUgegE'
                  },
                  attributes: {
                    number: '2485862/T/002',
                    currency_code: 'EUR',
                    amount_cents: 15400,
                    amount_float: 154.0,
                    formatted_amount: '€154,00',
                    succeeded: true,
                    message: 'Success!',
                    error_code: null,
                    error_detail: null,
                    token: 'pi_3N8LhsK5j6INEBBI0JicoLOo',
                    gateway_transaction_id: 'pi_3N8LhsK5j6INEBBI0JicoLOo',
                    created_at: '2023-05-16T14:18:35.368Z',
                    updated_at: '2023-05-16T14:18:35.368Z',
                    reference: null,
                    reference_origin: null,
                    metadata: {},
                    refund_amount_cents: 15400,
                    refund_amount_float: 154.0,
                    formatted_refund_amount: '€154,00',
                    refund_balance_cents: 15400,
                    refund_balance_float: 154.0,
                    formatted_refund_balance: '€154,00'
                  },
                  relationships: {
                    order: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/captures/kyAnxUgegE/relationships/order',
                        related:
                          'https://alessani.commercelayer.co/api/captures/kyAnxUgegE/order'
                      }
                    },
                    attachments: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/captures/kyAnxUgegE/relationships/attachments',
                        related:
                          'https://alessani.commercelayer.co/api/captures/kyAnxUgegE/attachments'
                      }
                    },
                    reference_authorization: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/captures/kyAnxUgegE/relationships/reference_authorization',
                        related:
                          'https://alessani.commercelayer.co/api/captures/kyAnxUgegE/reference_authorization'
                      }
                    },
                    refunds: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/captures/kyAnxUgegE/relationships/refunds',
                        related:
                          'https://alessani.commercelayer.co/api/captures/kyAnxUgegE/refunds'
                      }
                    },
                    events: {
                      links: {
                        self: 'https://alessani.commercelayer.co/api/captures/kyAnxUgegE/relationships/events',
                        related:
                          'https://alessani.commercelayer.co/api/captures/kyAnxUgegE/events'
                      }
                    }
                  },
                  meta: { mode: 'test', organization_id: 'WXlEOFrjnr' }
                }
              ]
            })
          )
        )
      }, 2000)
    })
  }
)

export default [orderDetail]
