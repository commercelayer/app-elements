import { formatDate } from './date'

describe('formatDate', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime('2023-12-25T14:30:00.000Z')
  })

  afterEach(() => {
    vi.useRealTimers()
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

  test('Should return a nice date string', () => {
    expect(
      formatDate({
        isoDate: '2022-10-14T14:32:00.000Z'
      })
    ).toBe('Oct 14, 2022')
  })

  test('Should return the value without the year when current year', () => {
    expect(
      formatDate({
        isoDate: '2023-10-14T14:32:00.000Z',
        format: 'date'
      })
    ).toBe('Oct 14')
  })

  test('Should return the value with the year when previous year', () => {
    expect(
      formatDate({
        isoDate: '2022-10-14T14:32:00.000Z',
        format: 'date'
      })
    ).toBe('Oct 14, 2022')
  })

  test('Should return "Today" when today', () => {
    expect(
      formatDate({
        isoDate: '2023-12-25T14:32:00.000Z',
        format: 'date'
      })
    ).toBe('Today')
  })

  test('Should return a date with time', () => {
    // AM
    expect(
      formatDate({
        isoDate: '2023-02-22T10:32:47.284Z',
        format: 'full'
      })
    ).toBe('Feb 22 · 10:32')

    // PM
    expect(
      formatDate({
        isoDate: '2022-10-26T16:16:31.279Z',
        format: 'full'
      })
    ).toBe('Oct 26, 2022 · 16:16')
  })

  test('Should return a date with time and seconds', () => {
    // AM
    expect(
      formatDate({
        isoDate: '2023-02-22T10:32:47.284Z',
        format: 'fullWithSeconds'
      })
    ).toBe('Feb 22 · 10:32:47')

    // PM
    expect(
      formatDate({
        isoDate: '2022-10-26T16:16:31.279Z',
        format: 'fullWithSeconds'
      })
    ).toBe('Oct 26, 2022 · 16:16:31')
  })

  test('Should return only the time', () => {
    // AM
    expect(
      formatDate({
        isoDate: '2023-02-22T05:32:47.284Z',
        format: 'time'
      })
    ).toBe('05:32')

    // PM
    expect(
      formatDate({
        isoDate: '2022-10-26T16:16:31.279Z',
        format: 'time'
      })
    ).toBe('16:16')
  })

  test('Should return only the time with seconds', () => {
    // AM
    expect(
      formatDate({
        isoDate: '2023-02-22T10:32:47.284Z',
        format: 'timeWithSeconds'
      })
    ).toBe('10:32:47')

    // PM
    expect(
      formatDate({
        isoDate: '2022-10-26T16:16:31.279Z',
        format: 'timeWithSeconds'
      })
    ).toBe('16:16:31')
  })

  test('Should accept a specific timezone override', () => {
    // Sydney (day after)
    expect(
      formatDate({
        isoDate: '2022-10-26T16:16:31.279Z',
        timezone: 'Australia/Sydney',
        format: 'date'
      })
    ).toBe('Oct 27, 2022')

    // Rome
    expect(
      formatDate({
        isoDate: '2022-10-26T16:16:31.279Z',
        timezone: 'Europe/Rome',
        format: 'full'
      })
    ).toBe('Oct 26, 2022 · 18:16')
  })

  test('Should return the distance to now', () => {
    expect(
      formatDate({
        isoDate: '2023-12-25T14:30:00.000Z',
        timezone: 'Australia/Sydney',
        format: 'distanceToNow'
      })
    ).toBe('less than a minute ago')

    expect(
      formatDate({
        isoDate: '2023-12-25T14:30:00.000Z',
        timezone: 'Europe/Rome',
        format: 'distanceToNow'
      })
    ).toBe('less than a minute ago')

    expect(
      formatDate({
        isoDate: '2023-12-25T14:23:00.000Z',
        timezone: 'Europe/Rome',
        format: 'distanceToNow'
      })
    ).toBe('7 minutes ago')

    expect(
      formatDate({
        isoDate: '2023-02-27T16:00:00.000Z',
        format: 'distanceToNow'
      })
    ).toBe('10 months ago')
  })
})
