import { formatDate, isCurrentYear, isToday } from './date'

describe('formatDate', () => {
  test('Should return a nice date string', () => {
    expect(
      formatDate({
        isoDate: '2022-10-14T14:32:00.000Z'
      })
    ).toBe('Oct 14, 2022')
  })

  test('Should accept a date with time', () => {
    // AM
    expect(
      formatDate({
        isoDate: '2023-02-22T10:32:47.284Z',
        format: 'full'
      })
    ).toBe('Feb 22, 2023 · 10:32 AM')

    // PM
    expect(
      formatDate({
        isoDate: '2022-10-26T16:16:31.279Z',
        format: 'full'
      })
    ).toBe('Oct 26, 2022 · 4:16 PM')
  })

  test('Should return a date without year', () => {
    expect(
      formatDate({
        isoDate: '2022-10-14T14:32:00.000Z',
        format: 'noYear'
      })
    ).toBe('Oct 14')
  })

  test('Should accept a specific timezone override', () => {
    // Sydney (day after)
    expect(
      formatDate({
        isoDate: '2022-10-26T16:16:31.279Z',
        timezone: 'Australia/Sydney',
        format: 'noTime'
      })
    ).toBe('Oct 27, 2022')

    // Rome
    expect(
      formatDate({
        isoDate: '2022-10-26T16:16:31.279Z',
        timezone: 'Europe/Rome',
        format: 'full'
      })
    ).toBe('Oct 26, 2022 · 6:16 PM')
  })

  test('Should not break when date format is wrong', () => {
    expect(formatDate({ isoDate: '20221T15:35:42.315Z' })).toBe('N/A')
  })

  test('Should not break if date is empty string', () => {
    expect(formatDate({ isoDate: '' })).toBe('N/A')
  })

  test('Should not break if no date is passed', () => {
    expect(formatDate({ isoDate: undefined })).toBe('N/A')
  })

  test('Should accept custom template', () => {
    expect(
      formatDate({
        isoDate: '2023-02-27T16:00:00.000Z',
        timezone: 'Europe/Rome',
        format: 'custom',
        customTemplate: `do 'of' LLLL`
      })
    ).toBe('27th of February')
  })
})

describe('isCurrentYear', () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  test('should return TRUE when provided isoDate is current year', () => {
    vi.useFakeTimers().setSystemTime('2023-12-31')
    expect(isCurrentYear('2023-01-03T08:35:00.200Z')).toBe(true)
  })

  test('should return FALSE when provided isoDate is NOT the current year', () => {
    vi.useFakeTimers().setSystemTime('2023-12-31')
    expect(isCurrentYear('2022-01-03T08:35:00.200Z')).toBe(false)
    expect(isCurrentYear('2024-01-03T08:35:00.200Z')).toBe(false)
  })
})

describe('isToday', () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  test('should return TRUE when provided isoDate is today', () => {
    vi.useFakeTimers().setSystemTime('2023-12-31')
    expect(isToday('2023-12-31T08:35:00.200Z')).toBe(true)
  })

  test('should return FALSE when provided isoDate is NOT today', () => {
    vi.useFakeTimers().setSystemTime('2023-12-31')
    expect(isToday('2022-01-03T08:35:00.200Z')).toBe(false)
    expect(isToday('2023-12-30T23:59:00.000Z')).toBe(false)
    expect(isToday('2024-01-03T08:35:00.200Z')).toBe(false)
  })
})
