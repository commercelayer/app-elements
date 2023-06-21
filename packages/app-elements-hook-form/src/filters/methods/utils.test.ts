import { instructions } from './mockedInstructions'
import { computeFilterLabel, getActiveFilterCountFromUrl } from './utils'

describe('computeFilterLabel', () => {
  test('should return valid computed label', () => {
    expect(
      computeFilterLabel({
        label: 'Markets',
        selectedCount: 0,
        totalCount: 4
      })
    ).toBe('Markets · 4')
  })

  test('should return selected count in computed label', () => {
    expect(
      computeFilterLabel({
        label: 'Payment status',
        selectedCount: 2,
        totalCount: 6
      })
    ).toBe('Payment status · 2 of 6')
  })
})

describe('getActiveFilterCountFromUrl', () => {
  const { location } = window
  beforeEach(function clearLocation() {
    delete (window as any).location
    ;(window as any).location = {
      ...location,
      search: ''
    }
  })
  afterEach(function resetLocation() {
    window.location = location
  })

  test('should read current URL query string', () => {
    window.location.search =
      '?market_id_in=abc123&status_in=approved&status_in=cancelled'
    expect(
      getActiveFilterCountFromUrl({
        instructions
      })
    ).toBe(2)
  })

  test('should return 0 when no filters are in query string', () => {
    window.location.search = ''
    expect(getActiveFilterCountFromUrl({ instructions })).toBe(0)
  })

  test('should ignore params that are not a filter', () => {
    window.location.search = '?status_in=approved&not-a-filter=yeah'
    expect(getActiveFilterCountFromUrl({ instructions })).toBe(1)
  })

  test('should ignore text filter', () => {
    window.location.search = '?status_in=approved&number_or_email_cont=foobar'
    expect(
      getActiveFilterCountFromUrl({
        instructions,
        includeTextSearch: false
      })
    ).toBe(1)
  })

  test('should include text filter when asked', () => {
    window.location.search = '?status_in=approved&number_or_email_cont=foobar'
    expect(
      getActiveFilterCountFromUrl({
        instructions,
        includeTextSearch: true
      })
    ).toBe(2)
  })
})
