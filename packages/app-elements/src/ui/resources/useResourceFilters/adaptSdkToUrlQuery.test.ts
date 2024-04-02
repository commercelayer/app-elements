import { adaptSdkToUrlQuery } from '#ui/resources/useResourceFilters/adaptSdkToUrlQuery'
import { instructions } from './mockedInstructions'

describe('adaptSdkToUrlQuery', () => {
  test('should build proper query string alphabetically sorted', () => {
    expect(
      adaptSdkToUrlQuery({
        sdkFilters: {
          payment_status_eq: 'authorized',
          status_in: 'approved,cancelled',
          market_id_in: 'dlQbPhNNop'
        },
        instructions
      })
    ).toBe(
      'market_id_in=dlQbPhNNop&payment_status_eq=authorized&status_in=approved&status_in=cancelled'
    )
  })

  test('should ignore empty values', () => {
    expect(
      adaptSdkToUrlQuery({
        sdkFilters: {
          market_id_in: '',
          status_in: 'approved'
        },
        instructions
      })
    ).toBe('status_in=approved')
  })

  test('should ignore predicates not defined in instructions', () => {
    expect(
      adaptSdkToUrlQuery({
        sdkFilters: {
          lastname_eq: 'doe',
          status_in: 'approved,cancelled'
        },
        instructions
      })
    ).toBe('status_in=approved&status_in=cancelled')
  })

  test('should consider predicates not defined in instructions but whitelisted', () => {
    expect(
      adaptSdkToUrlQuery({
        sdkFilters: {
          lastname_eq: 'doe',
          status_in: 'approved,cancelled'
        },
        instructions,
        predicateWhitelist: ['lastname_eq']
      })
    ).toBe('lastname_eq=doe&status_in=approved&status_in=cancelled')
  })
})
