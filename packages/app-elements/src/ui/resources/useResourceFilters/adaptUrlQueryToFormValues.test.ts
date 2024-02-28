import { adaptUrlQueryToFormValues } from './adaptUrlQueryToFormValues'
import { instructions } from './mockedInstructions'

describe('adaptUrlQueryToFormValues', () => {
  test('should build proper form value object', () => {
    expect(
      adaptUrlQueryToFormValues({
        queryString:
          'market_id_in=dFDdasdgAN&market_id_in=KToVGDooQp&status_in=cancelled&number_or_email_cont=foobar&viewTitle=Awaiting%20Approval',
        instructions
      })
    ).toStrictEqual({
      market_id_in: ['dFDdasdgAN', 'KToVGDooQp'],
      status_in: ['cancelled'],
      payment_status_eq: undefined,
      fulfillment_status_in: [],
      archived_at_null: undefined,
      timePreset: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      number_or_email_cont: 'foobar',
      viewTitle: 'Awaiting Approval',
      total_amount_cents: {
        from: undefined,
        to: undefined,
        currencyCode: undefined
      }
    })
  })

  test('should build proper form value object when partially empty', () => {
    expect(
      adaptUrlQueryToFormValues({
        queryString: 'market_id_in=&status_in=approved',
        instructions
      })
    ).toStrictEqual({
      market_id_in: [],
      status_in: ['approved'],
      payment_status_eq: undefined,
      fulfillment_status_in: [],
      archived_at_null: undefined,
      timePreset: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      number_or_email_cont: undefined,
      viewTitle: undefined,
      total_amount_cents: {
        from: undefined,
        to: undefined,
        currencyCode: undefined
      }
    })
  })

  test('should build proper form value object when empty', () => {
    expect(
      adaptUrlQueryToFormValues({
        queryString: '',
        instructions
      })
    ).toStrictEqual({
      market_id_in: [],
      status_in: [],
      payment_status_eq: undefined,
      fulfillment_status_in: [],
      archived_at_null: undefined,
      timePreset: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      number_or_email_cont: undefined,
      viewTitle: undefined,
      total_amount_cents: {
        from: undefined,
        to: undefined,
        currencyCode: undefined
      }
    })
  })

  test('should build proper form value object when data are wrong', () => {
    expect(
      adaptUrlQueryToFormValues({
        queryString:
          'payment_status_eq=invalid-value&status_in=draft&status_in=placed',
        instructions
      })
    ).toStrictEqual({
      market_id_in: [],
      status_in: ['placed'],
      payment_status_eq: undefined,
      fulfillment_status_in: [],
      archived_at_null: undefined,
      timePreset: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      number_or_email_cont: undefined,
      viewTitle: undefined,
      total_amount_cents: {
        from: undefined,
        to: undefined,
        currencyCode: undefined
      }
    })
  })

  test('should handle currency range values', () => {
    expect(
      adaptUrlQueryToFormValues({
        queryString:
          'status_in=placed&currency_code_eq=USD&total_amount_cents_gteq=1500&total_amount_cents_lteq=20000',
        instructions
      })
    ).toStrictEqual({
      market_id_in: [],
      status_in: ['placed'],
      payment_status_eq: undefined,
      fulfillment_status_in: [],
      archived_at_null: undefined,
      timePreset: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      number_or_email_cont: undefined,
      viewTitle: undefined,
      total_amount_cents: {
        from: 1500,
        to: 20000,
        currencyCode: 'USD'
      }
    })
  })

  test('should handle partial currency range values', () => {
    expect(
      adaptUrlQueryToFormValues({
        queryString:
          'status_in=placed&currency_code_eq=USD&total_amount_cents_lteq=1500',
        instructions
      })
    ).toStrictEqual({
      market_id_in: [],
      status_in: ['placed'],
      payment_status_eq: undefined,
      fulfillment_status_in: [],
      archived_at_null: undefined,
      timePreset: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      number_or_email_cont: undefined,
      viewTitle: undefined,
      total_amount_cents: {
        from: undefined,
        to: 1500,
        currencyCode: 'USD'
      }
    })
  })
})
