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
      payment_status_in: [],
      fulfillment_status_in: [],
      archived_at_null: undefined,
      timePreset: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      number_or_email_cont: 'foobar',
      viewTitle: 'Awaiting Approval'
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
      payment_status_in: [],
      fulfillment_status_in: [],
      archived_at_null: undefined,
      timePreset: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      number_or_email_cont: undefined,
      viewTitle: undefined
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
      payment_status_in: [],
      fulfillment_status_in: [],
      archived_at_null: undefined,
      timePreset: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      number_or_email_cont: undefined,
      viewTitle: undefined
    })
  })

  test('should build proper form value object when data are wrong', () => {
    expect(
      adaptUrlQueryToFormValues({
        queryString:
          'payment_status_in=invalid-value&status_in=draft&status_in=placed',
        instructions
      })
    ).toStrictEqual({
      market_id_in: [],
      status_in: ['placed'],
      payment_status_in: [],
      fulfillment_status_in: [],
      archived_at_null: undefined,
      timePreset: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      number_or_email_cont: undefined,
      viewTitle: undefined
    })
  })
})
