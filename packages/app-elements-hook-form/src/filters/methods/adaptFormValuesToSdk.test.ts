import {
  adaptFormValuesToSdk,
  extractEnforcedValues
} from './adaptFormValuesToSdk'
import { instructions } from './mockedInstructions'

describe('adaptFormValuesToSdk', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime('2023-04-05T15:20:00.000Z')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should build proper sdk filter object', () => {
    expect(
      adaptFormValuesToSdk({
        formValues: {
          market_id_in: ['dFDdasdgAN', 'KToVGDooQp'],
          status_in: ['cancelled'],
          payment_status_in: ['paid', 'refunded'],
          fulfillment_status_in: ['fulfilled']
        },
        instructions
      })
    ).toStrictEqual({
      market_id_in: 'dFDdasdgAN,KToVGDooQp',
      status_in: 'cancelled',
      payment_status_in: 'paid,refunded',
      fulfillment_status_in: 'fulfilled',
      archived_at_null: true
    })
  })

  test('should return object to filter only archived orders', () => {
    expect(
      adaptFormValuesToSdk({
        formValues: {
          market_id_in: [],
          status_in: [],
          payment_status_in: [],
          fulfillment_status_in: [],
          archived_at_null: 'only'
        },
        instructions
      })
    ).toStrictEqual({
      archived_at_null: false,
      status_in: 'placed,approved,cancelled'
    })
  })

  test('should return default object on empty form values', () => {
    expect(
      adaptFormValuesToSdk({
        formValues: {
          market_id_in: [],
          status_in: [],
          payment_status_in: [],
          fulfillment_status_in: [],
          archived_at_null: undefined
        },
        instructions
      })
    ).toStrictEqual({
      archived_at_null: true,
      status_in: 'placed,approved,cancelled'
    })
  })

  test('should return handle time range preset', () => {
    expect(
      adaptFormValuesToSdk({
        formValues: {
          market_id_in: [],
          status_in: [],
          payment_status_in: [],
          fulfillment_status_in: [],
          archived_at_null: undefined,
          timePreset: 'today',
          number_or_email_cont: 'foobar'
        },
        instructions
      })
    ).toStrictEqual({
      archived_at_null: true,
      status_in: 'placed,approved,cancelled',
      updated_at_gteq: '2023-04-05T00:00:00.000Z',
      number_or_email_cont: 'foobar'
    })
  })

  test('should handle different timezone', () => {
    expect(
      adaptFormValuesToSdk({
        formValues: {
          market_id_in: [],
          status_in: [],
          payment_status_in: [],
          fulfillment_status_in: [],
          archived_at_null: undefined,
          timePreset: 'today'
        },
        timezone: 'Australia/Sydney',
        instructions
      })
    ).toStrictEqual({
      archived_at_null: true,
      status_in: 'placed,approved,cancelled',
      updated_at_gteq: '2023-04-05T14:00:00.000Z'
    })
  })

  test('should return handle time range custom with timezone', () => {
    expect(
      adaptFormValuesToSdk({
        formValues: {
          market_id_in: [],
          status_in: [],
          payment_status_in: [],
          fulfillment_status_in: [],
          archived_at_null: undefined,
          timePreset: 'custom',
          timeFrom: new Date('2023-02-01T16:35:00.000Z'),
          timeTo: new Date('2023-02-28T16:35:20.000Z')
        },
        timezone: 'Europe/Rome',
        instructions
      })
    ).toStrictEqual({
      archived_at_null: true,
      status_in: 'placed,approved,cancelled',
      updated_at_gteq: '2023-01-31T23:00:00.000Z',
      updated_at_lteq: '2023-02-28T22:59:59.999Z'
    })
  })
})

describe('extractEnforcedValues', () => {
  test('should return enforced values when a filed', () => {
    expect(extractEnforcedValues(instructions)).toStrictEqual({
      status_in: 'placed,approved,cancelled'
    })
  })
  test('should return empty object if no enforced values', () => {
    const instructionsWithoutRestrictToOptions = instructions.filter(
      (item) =>
        !(
          'restrictToOptions' in item.sdk && item.sdk.restrictToOptions === true
        )
    )
    expect(
      extractEnforcedValues(instructionsWithoutRestrictToOptions)
    ).toStrictEqual({})
  })
})
