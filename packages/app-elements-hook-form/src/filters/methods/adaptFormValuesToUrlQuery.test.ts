import { adaptFormValuesToUrlQuery } from './adaptFormValuesToUrlQuery'

describe('adaptFormValuesToUrlQuery', () => {
  test('should build proper query string alphabetically sorted', () => {
    expect(
      adaptFormValuesToUrlQuery({
        formValues: {
          status_in: ['cancelled'],
          market_id_in: ['dFDdasdgAN', 'KToVGDooQp'],
          payment_status_in: [],
          fulfillment_status_in: [],
          archived_at_null: 'hide'
        }
      })
    ).toBe(
      'archived_at_null=hide&market_id_in=dFDdasdgAN&market_id_in=KToVGDooQp&status_in=cancelled'
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
        }
      })
    ).toBe(
      'archived_at_null=hide&market_id_in=dFDdasdgAN&market_id_in=KToVGDooQp&status_in=cancelled&timePreset=today'
    )
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
        }
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
        }
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
        }
      })
    ).toBe('')
  })
})
