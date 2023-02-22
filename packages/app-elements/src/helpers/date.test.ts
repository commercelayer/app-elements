import { formatDate } from './date'

describe('formatDate', () => {
  test('Should return a nice date string', () => {
    expect(formatDate('2022-10-14T14:32:00.000Z')).toBe('Oct 14, 2022')
  })

  test('Should accept a date with time', () => {
    // AM
    expect(formatDate('2023-02-22T10:32:47.284Z', true)).toBe(
      'Feb 22, 2023 · 10:32 AM'
    )
    // PM
    expect(formatDate('2022-10-26T16:16:31.279Z', true)).toBe(
      'Oct 26, 2022 · 4:16 PM'
    )
  })

  test('Should accept a specific timezone override', () => {
    // Sydney (day after)
    expect(
      formatDate('2022-10-26T16:16:31.279Z', false, 'Australia/Sydney')
    ).toBe('Oct 27, 2022')

    // Rome
    expect(formatDate('2022-10-26T16:16:31.279Z', true, 'Europe/Rome')).toBe(
      'Oct 26, 2022 · 6:16 PM'
    )
  })

  test('Should not break when date format is wrong', () => {
    expect(formatDate('20221T15:35:42.315Z')).toBe('N/A')
  })

  test('Should not break if date is empty string', () => {
    expect(formatDate('')).toBe('N/A')
  })

  test('Should not break if no date is passed', () => {
    expect(formatDate(undefined)).toBe('N/A')
  })
})
