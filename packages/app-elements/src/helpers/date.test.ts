import { formatDate } from './date'

describe('formatDate', () => {
  test('Should return a nice date string', () => {
    const d = new Date(`10-14-2022`).toISOString()
    expect(formatDate(d)).toBe('Oct 14, 2022')
  })

  test('Should accept a date with no time', () => {
    const d = '2022-07-21'
    expect(formatDate(d, false)).toBe('Jul 21, 2022')
  })

  test('Should accept a date with time', () => {
    const d = '2022-10-26T16:16:31.279Z'
    expect(formatDate(d, true, 'UTC')).toBe('Oct 26, 2022 · 4:16 PM')
  })

  test('Should accept a specic timezone override', () => {
    const d = '2022-10-26T16:16:31.279Z'
    expect(formatDate(d, false, 'Australia/Sydney')).toBe('Oct 27, 2022')
  })

  test('Should not break when date format is wrong', () => {
    const d = '20221T15:35:42.315Z'
    expect(formatDate(d)).toBe('N/A')
  })

  test('Should not break if date is empty string', () => {
    const d = ''
    expect(formatDate(d)).toBe('N/A')
  })

  test('Should not break if no date is passed', () => {
    expect(formatDate(undefined)).toBe('N/A')
  })
})
