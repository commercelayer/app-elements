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
      total_amount_cents_lteq: '3000',
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
          'total_amount_cents_lteq',
          'currency_code_eq',
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
        total_amount_cents: {
          lte: '3000'
        },
        currency_code: {
          eq: 'USD'
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
})
