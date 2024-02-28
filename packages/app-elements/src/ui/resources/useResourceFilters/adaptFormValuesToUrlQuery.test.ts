import { adaptFormValuesToUrlQuery } from './adaptFormValuesToUrlQuery'
import { instructions } from './mockedInstructions'

describe('adaptFormValuesToUrlQuery', () => {
  test('should build proper query string alphabetically sorted', () => {
    expect(
      adaptFormValuesToUrlQuery({
        formValues: {
          status_in: ['cancelled'],
          market_id_in: ['dFDdasdgAN', 'KToVGDooQp'],
          payment_status_in: [],
          fulfillment_status_in: [],
          archived_at_null: 'hide',
          lastname_eq: 'doe'
        },
        instructions
      })
    ).toBe(
      'archived_at_null=hide&lastname_eq=doe&market_id_in=dFDdasdgAN&market_id_in=KToVGDooQp&status_in=cancelled'
    )
  })

  test('should handle time range with preset', () => {
    expect(
      adaptFormValuesToUrlQuery({
        formValues: {
          status_in: ['cancelled'],
          market_id_in: ['dFDdasdgAN', 'KToVGDooQp'],
          payment_status_in: [],
          fulfillment_status_in: [],
          archived_at_null: 'hide',
          timePreset: 'today'
        },
        instructions
      })
    ).toBe(
      'archived_at_null=hide&market_id_in=dFDdasdgAN&market_id_in=KToVGDooQp&status_in=cancelled&timePreset=today'
    )
  })

  test('should handle currency range filter', () => {
    expect(
      adaptFormValuesToUrlQuery({
        formValues: {
          status_in: ['placed'],
          total_amount_cents: {
            from: 1500,
            to: 20000,
            currencyCode: 'USD'
          }
        },
        instructions
      })
    ).toBe(
      'currency_code_eq=USD&status_in=placed&total_amount_cents_gteq=1500&total_amount_cents_lteq=20000'
    )
  })

  test('should ignore currencyCode when both from/to are not set', () => {
    expect(
      adaptFormValuesToUrlQuery({
        formValues: {
          status_in: ['placed'],
          total_amount_cents: {
            from: undefined,
            to: undefined,
            currencyCode: 'USD'
          }
        },
        instructions
      })
    ).toBe('status_in=placed')
  })

  test('should handle viewTitle', () => {
    expect(
      adaptFormValuesToUrlQuery({
        formValues: {
          status_in: ['cancelled'],
          market_id_in: ['dFDdasdgAN', 'KToVGDooQp'],
          payment_status_in: [],
          fulfillment_status_in: [],
          archived_at_null: 'hide',
          timePreset: 'today',
          viewTitle: 'Awaiting Approval'
        },
        instructions
      })
    ).toBe(
      'archived_at_null=hide&market_id_in=dFDdasdgAN&market_id_in=KToVGDooQp&status_in=cancelled&timePreset=today&viewTitle=Awaiting%20Approval'
    )
  })

  test('should allow to include archived', () => {
    expect(
      adaptFormValuesToUrlQuery({
        formValues: {
          status_in: [],
          market_id_in: [],
          payment_status_in: [],
          fulfillment_status_in: [],
          archived_at_null: 'show'
        },
        instructions
      })
    ).toBe('archived_at_null=show')
  })

  test('should accept empty values', () => {
    expect(
      adaptFormValuesToUrlQuery({
        formValues: {
          market_id_in: [],
          status_in: [],
          payment_status_in: [],
          fulfillmentStatus: []
        },
        instructions
      })
    ).toBe('')
  })
})
