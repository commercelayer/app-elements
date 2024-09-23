import { adaptSdkToMetrics } from './adaptSdkToMetrics'
import { instructions } from './mockedInstructions'

describe('adaptSdkToMetrics', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime('2023-04-05T15:20:00.000Z')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('Should generate a valid Metrics API filter from a core SDK filter', () => {
    const sdkFilters = {
      market_id_not_in: 'dFDdasdgAN,KToVGDooQp',
      status_in: 'cancelled,approved',
      payment_status_eq: 'paid',
      fulfillment_status_in: 'fulfilled',
      billing_address_id_not_eq: 'xxvsadasa',
      archived_at_null: false,
      aggregated_details: 'Commerce Layer',
      updated_at_gteq: '2023-01-31T23:00:00.000Z',
      updated_at_lteq: '2023-02-28T22:59:59.999Z',
      total_amount_cents_lteq: '3010',
      total_amount_cents_gteq: '1030',
      currency_code_eq: 'USD',
      archived: true
    }
    expect(
      adaptSdkToMetrics({
        sdkFilters,
        resourceType: 'orders',
        instructions,
        predicateWhitelist: [
          'market_id_not_in',
          'billing_address_id_not_eq',
          'aggregated_details',
          'updated_at_gteq',
          'updated_at_lteq',
          'archived'
        ]
      })
    ).toStrictEqual({
      order: {
        date_from: '2023-01-31T23:00:00Z',
        date_to: '2023-02-28T22:59:59Z',
        date_field: 'updated_at',
        archived: true,
        statuses: {
          in: ['cancelled', 'approved']
        },
        payment_status: {
          eq: 'paid'
        },
        fulfillment_statuses: {
          in: ['fulfilled']
        },
        currency_codes: {
          in: ['USD']
        },
        total_amount: {
          gte_lte: [10.3, 30.1]
        },
        aggregated_details: { query: 'Commerce Layer' }
      },
      market: {
        ids: {
          not_in: ['dFDdasdgAN', 'KToVGDooQp']
        }
      },
      billing_address: {
        id: {
          ne: 'xxvsadasa'
        }
      }
    })
  })

  test('Should always set a 1-year date range when is date range is not defined', () => {
    const metricsFilters = adaptSdkToMetrics({
      sdkFilters: {},
      resourceType: 'orders',
      instructions
    })
    expect(metricsFilters.order?.date_from).toBe('2022-04-05T15:20:01Z')
    expect(metricsFilters.order?.date_to).toBe('2023-04-05T15:20:00Z')
    expect(metricsFilters.order?.date_field).toBe('updated_at')
  })

  test('Should set a default 5-year date range when text search is defined', () => {
    const metricsFilters = adaptSdkToMetrics({
      sdkFilters: {
        aggregated_details: 'Commerce Layer'
      },
      predicateWhitelist: ['aggregated_details'],
      resourceType: 'orders',
      instructions
    })
    expect(metricsFilters.order?.date_from).toBe('2018-04-05T15:20:01Z')
    expect(metricsFilters.order?.date_to).toBe('2023-04-05T15:20:00Z')
    expect(metricsFilters.order?.date_field).toBe('updated_at')
  })

  test('Should handle amount range and currency', () => {
    const sdkFilters = {
      total_amount_cents_lteq: '3010',
      total_amount_cents_gteq: '1030',
      currency_code_eq: 'EU'
    }
    expect(
      adaptSdkToMetrics({
        sdkFilters,
        resourceType: 'orders',
        instructions,
        predicateWhitelist: []
      })
    ).toStrictEqual({
      order: {
        date_from: '2022-04-05T15:20:01Z',
        date_to: '2023-04-05T15:20:00Z',
        date_field: 'updated_at',
        currency_codes: {
          in: ['EU']
        },
        total_amount: {
          gte_lte: [10.3, 30.1]
        }
      }
    })
  })

  test('Should accept only lower then ', () => {
    const sdkFilters = {
      total_amount_cents_lteq: '3010'
    }
    expect(
      adaptSdkToMetrics({
        sdkFilters,
        resourceType: 'orders',
        instructions,
        predicateWhitelist: []
      })
    ).toStrictEqual({
      order: {
        date_from: '2022-04-05T15:20:01Z',
        date_to: '2023-04-05T15:20:00Z',
        date_field: 'updated_at',
        total_amount: {
          lte: 30.1
        }
      }
    })
  })

  test('Should accept only greaten', () => {
    const sdkFilters = {
      total_amount_cents_gt: '10'
    }
    expect(
      adaptSdkToMetrics({
        sdkFilters,
        resourceType: 'orders',
        instructions,
        predicateWhitelist: []
      })
    ).toStrictEqual({
      order: {
        date_from: '2022-04-05T15:20:01Z',
        date_to: '2023-04-05T15:20:00Z',
        date_field: 'updated_at',
        total_amount: {
          gt: 0.1
        }
      }
    })
  })

  test('Should handle values received as amount_float', () => {
    const sdkFilters = {
      total_amount_float_gt: 100.4
    }
    expect(
      adaptSdkToMetrics({
        sdkFilters,
        resourceType: 'orders',
        instructions: [
          {
            label: 'Amount',
            type: 'currencyRange',
            sdk: {
              predicate: 'total_amount_float'
            },
            render: {
              component: 'inputCurrencyRange',
              props: {
                label: 'Amount'
              }
            }
          }
        ],
        predicateWhitelist: []
      })
    ).toStrictEqual({
      order: {
        date_from: '2022-04-05T15:20:01Z',
        date_to: '2023-04-05T15:20:00Z',
        date_field: 'created_at',
        total_amount: {
          gt: 100.4
        }
      }
    })
  })
})
