import { adaptUrlQueryToSdk } from './adaptUrlQueryToSdk'
import { instructions } from './mockedInstructions'

describe('adaptUrlQueryToSdk', () => {
  test('should return a valid SDK filter object', () => {
    expect(
      adaptUrlQueryToSdk({
        queryString:
          'market_id_in=dlQbPhNNop&status_in=approved&status_in=cancelled',
        instructions
      })
    ).toStrictEqual({
      market_id_in: 'dlQbPhNNop',
      status_in: 'approved,cancelled',
      archived_at_null: true
    })
  })

  test('should ignore empty values', () => {
    expect(
      adaptUrlQueryToSdk({
        queryString: 'market_id_in=&status_in=approved&status_in=cancelled',
        instructions
      })
    ).toStrictEqual({
      status_in: 'approved,cancelled',
      archived_at_null: true
    })
  })

  test('should return invalid status preset if not in url ', () => {
    expect(
      adaptUrlQueryToSdk({
        queryString: 'payment_status_in=authorized',
        instructions
      })
    ).toStrictEqual({
      status_in: 'placed,approved,cancelled',
      payment_status_in: 'authorized',
      archived_at_null: true
    })
  })

  test('should return invalid status preset when query string is empty or undefined', () => {
    expect(
      adaptUrlQueryToSdk({
        queryString: '',
        instructions
      })
    ).toStrictEqual({
      status_in: 'placed,approved,cancelled',
      archived_at_null: true
    })
  })

  test('should ignore invalid values in query string', () => {
    expect(
      adaptUrlQueryToSdk({
        queryString:
          'status_in=approved&payment_status_in=not-existing&status_in=draft',
        instructions
      })
    ).toStrictEqual({
      status_in: 'approved',
      archived_at_null: true
    })
  })
})
