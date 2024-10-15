import {
  makeDateYearsRange,
  removeMillisecondsFromIsoDate
} from '#helpers/date'
import {
  formatDate,
  formatDateRange,
  formatDateWithPredicate,
  getEventDateInfo,
  getIsoDateAtDayEdge,
  getIsoDateAtDaysBefore
} from './date'

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

  test('Should return "00:32" as time', () => {
    expect(
      formatDate({
        isoDate: '2023-12-25T00:32:00.000Z',
        format: 'fullWithSeconds',
        showCurrentYear: true
      })
    ).toContain('00:32')
  })

  test('Should return a date with time', () => {
    // AM
    expect(
      formatDate({
        isoDate: '2023-02-22T10:32:47.284Z',
        format: 'full'
      })
    ).toBe('Feb 22, 10:32')

    // PM
    expect(
      formatDate({
        isoDate: '2022-10-26T16:16:31.279Z',
        format: 'full'
      })
    ).toBe('Oct 26, 2022, 16:16')
  })

  test('Should return a date with time and seconds', () => {
    // AM
    expect(
      formatDate({
        isoDate: '2023-02-22T10:32:47.284Z',
        format: 'fullWithSeconds'
      })
    ).toBe('Feb 22, 10:32:47')

    // PM
    expect(
      formatDate({
        isoDate: '2022-10-26T16:16:31.279Z',
        format: 'fullWithSeconds'
      })
    ).toBe('Oct 26, 2022, 16:16:31')
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
    ).toBe('Oct 26, 2022, 18:16')
  })

  test('Should return the distance to now', () => {
    expect(
      formatDate({
        isoDate: '2023-12-25T14:29:40.000Z',
        timezone: 'Australia/Sydney',
        format: 'distanceToNow'
      })
    ).toBe('less than a minute ago')

    expect(
      formatDate({
        isoDate: '2023-12-25T14:29:40.000Z',
        timezone: 'Europe/Rome',
        format: 'distanceToNow'
      })
    ).toBe('less than a minute ago')

    expect(
      formatDate({
        isoDate: '2023-12-25T14:30:10.000Z',
        timezone: 'Europe/Rome',
        format: 'distanceToNow'
      })
    ).toBe('in less than a minute')

    expect(
      formatDate({
        isoDate: '2023-12-25T14:23:00.000Z',
        timezone: 'Europe/Rome',
        format: 'distanceToNow'
      })
    ).toBe('7 minutes ago')

    expect(
      formatDate({
        isoDate: '2023-12-25T14:37:00.000Z',
        timezone: 'Europe/Rome',
        format: 'distanceToNow'
      })
    ).toBe('in 7 minutes')

    expect(
      formatDate({
        isoDate: '2023-02-27T16:00:00.000Z',
        format: 'distanceToNow'
      })
    ).toBe('10 months ago')

    expect(
      formatDate({
        isoDate: '2024-10-27T16:00:00.000Z',
        format: 'distanceToNow'
      })
    ).toBe('in 10 months')
  })
})

describe('formatDateWithPredicate', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime('2023-12-25T14:30:00.000Z')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('Should return a nice date string with predicate', () => {
    expect(
      formatDateWithPredicate({
        predicate: 'Created',
        isoDate: '2022-10-14T14:32:00.000Z'
      })
    ).toBe('Created on Oct 14, 2022, 14:32')
  })

  test('Should return the predicate followed by `on` and the date without the year when current year', () => {
    expect(
      formatDateWithPredicate({
        predicate: 'Updated',
        isoDate: '2023-10-14T14:32:00.000Z',
        format: 'date'
      })
    ).toBe('Updated on Oct 14')
  })

  test('Should return the predicate followed by just "today" when date is today', () => {
    expect(
      formatDateWithPredicate({
        predicate: 'Created',
        isoDate: '2023-12-25T14:32:00.000Z',
        format: 'date'
      })
    ).toBe('Created today')
  })

  test('Should return the predicate followed by `on` and the date with time', () => {
    expect(
      formatDateWithPredicate({
        predicate: 'Updated',
        isoDate: '2023-02-22T10:32:47.284Z',
        format: 'full'
      })
    ).toBe('Updated on Feb 22, 10:32')
  })

  test('Should return the predicate followed by `on` and the date with time and seconds', () => {
    expect(
      formatDateWithPredicate({
        predicate: 'Updated',
        isoDate: '2023-02-22T10:32:47.284Z',
        format: 'fullWithSeconds'
      })
    ).toBe('Updated on Feb 22, 10:32:47')
  })

  test('Should return the predicate followed by `at` and the time', () => {
    expect(
      formatDateWithPredicate({
        predicate: 'Updated',
        isoDate: '2023-02-22T05:32:47.284Z',
        format: 'time'
      })
    ).toBe('Updated at 05:32')
  })

  test('Should return the predicate followed by just the distance to now', () => {
    expect(
      formatDateWithPredicate({
        predicate: 'Updated',
        isoDate: '2023-12-25T14:29:50.000Z',
        timezone: 'Australia/Sydney',
        format: 'distanceToNow'
      })
    ).toBe('Updated less than a minute ago')

    expect(
      formatDateWithPredicate({
        predicate: 'Expires',
        isoDate: '2023-12-25T14:30:10.000Z',
        timezone: 'Australia/Sydney',
        format: 'distanceToNow'
      })
    ).toBe('Expires in less than a minute')
  })
})

describe('getIsoDateAtDayEdge', () => {
  test('should set start of the day in Los Angeles', () => {
    expect(
      getIsoDateAtDayEdge({
        isoString: '2023-02-17T10:31:28.454Z',
        edge: 'startOfTheDay',
        timezone: 'America/Los_Angeles'
      })
    ).toBe('2023-02-17T08:00:00.000Z')
  })

  test('should set start of the day in Rome', () => {
    expect(
      getIsoDateAtDayEdge({
        isoString: '2023-02-17T10:31:28.454Z',
        edge: 'startOfTheDay',
        timezone: 'Europe/Rome'
      })
    ).toBe('2023-02-16T23:00:00.000Z')
  })

  test('should set start of the day in Rome', () => {
    expect(
      getIsoDateAtDayEdge({
        isoString: '2023-04-17T10:31:28.454Z',
        edge: 'startOfTheDay',
        timezone: 'Europe/Rome'
      })
    ).toBe('2023-04-16T22:00:00.000Z')
  })

  test('should set end of the day in Rome', () => {
    expect(
      getIsoDateAtDayEdge({
        isoString: '2023-02-17T09:31:28.454Z',
        edge: 'endOfTheDay',
        timezone: 'Europe/Rome'
      })
    ).toBe('2023-02-17T22:59:59.999Z')
  })

  test('should work with partial dates', () => {
    expect(
      getIsoDateAtDayEdge({
        isoString: '2023-02-17',
        edge: 'endOfTheDay',
        timezone: 'Europe/Rome'
      })
    ).toBe('2023-02-17T22:59:59.999Z')
  })

  test('should return undefined when a no-date is passed', () => {
    expect(
      getIsoDateAtDayEdge({
        isoString: '',
        edge: 'endOfTheDay',
        timezone: 'Europe/Rome'
      })
    ).toBe(undefined)

    expect(
      getIsoDateAtDayEdge({
        isoString: 'abcddds',
        edge: 'endOfTheDay',
        timezone: 'Europe/Rome'
      })
    ).toBe(undefined)
  })
})

describe('getIsoDateAtDaysBefore', () => {
  test('should subtract days in default utc timezone', () => {
    expect(
      getIsoDateAtDaysBefore({
        isoString: '2023-04-06T10:31:28.454Z',
        days: 2
      })
    ).toBe('2023-04-04T00:00:00.000Z')
  })

  test('should subtract days from a date with custom timezone', () => {
    // rome
    expect(
      getIsoDateAtDaysBefore({
        isoString: '2023-04-06T10:31:28.454Z',
        days: 3,
        timezone: 'Europe/Rome'
      })
    ).toBe('2023-04-02T22:00:00.000Z')
    // sydney
    expect(
      getIsoDateAtDaysBefore({
        isoString: '2023-04-06T10:31:28.454Z',
        days: 2,
        timezone: 'Australia/Sydney'
      })
    ).toBe('2023-04-03T14:00:00.000Z')
  })

  test('should work also with the exact start of the utc day', () => {
    expect(
      getIsoDateAtDaysBefore({
        isoString: '2023-04-06T00:00:00.000Z',
        days: 1
      })
    ).toBe('2023-04-05T00:00:00.000Z')
  })

  test('should work also with the exact end of the utc day', () => {
    expect(
      getIsoDateAtDaysBefore({
        isoString: '2023-04-06T23:59:59.999Z',
        days: 1
      })
    ).toBe('2023-04-05T00:00:00.000Z')
  })

  test('should properly work with days above month length', () => {
    expect(
      getIsoDateAtDaysBefore({
        isoString: '2023-02-06T13:40:00.000Z',
        days: 45,
        timezone: 'Europe/Rome'
      })
    ).toBe('2022-12-22T23:00:00.000Z')

    expect(
      getIsoDateAtDaysBefore({
        isoString: '2023-02-06T10:20:30.325Z',
        days: 365,
        timezone: 'Australia/Sydney'
      })
    ).toBe('2022-02-05T13:00:00.000Z')
  })

  test('should not accept negative days', () => {
    expect(
      getIsoDateAtDaysBefore({
        isoString: '2023-04-06T23:59:59.999Z',
        days: -10
      })
    ).toBe(undefined)
  })

  test('should not break with invalid date', () => {
    expect(
      getIsoDateAtDaysBefore({
        isoString: 'sdsdsds',
        days: 7
      })
    ).toBe(undefined)
  })
})

describe('getEventDateInfo', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime('2023-12-25T14:30:00.000Z')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should throw an error when the startsAt date comes after the expiresAt date', () => {
    expect(() => {
      getEventDateInfo({
        startsAt: '2024-01-31T14:30:00.000Z',
        expiresAt: '2024-01-01T14:30:00.000Z'
      })
    }).toThrowError(
      'The expiration date/time of the event must be after the activation (startsAt).'
    )
  })

  test('should return "upcoming" when the event is in the future', () => {
    expect(
      getEventDateInfo({
        startsAt: '2024-01-01T14:30:00.000Z',
        expiresAt: '2024-01-31T14:30:00.000Z'
      })
    ).toEqual('upcoming')
  })

  test('should return "expired" when the event is in the past', () => {
    expect(
      getEventDateInfo({
        startsAt: '2023-01-01T14:30:00.000Z',
        expiresAt: '2023-01-31T14:30:00.000Z'
      })
    ).toEqual('past')
  })

  test('should return "active" when the event is actually happening', () => {
    expect(
      getEventDateInfo({
        startsAt: '2023-12-01T14:30:00.000Z',
        expiresAt: '2023-12-31T14:30:00.000Z'
      })
    ).toEqual('active')
  })
})

describe('formatDateRange should return the proper date format', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime('2024-01-10T14:30:00.000Z')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('when current year and different months', () => {
    expect(
      formatDateRange({
        rangeFrom: '2024-01-01T14:30:00.000Z',
        rangeTo: '2024-02-29T14:30:00.000Z'
      })
    ).toEqual('Jan 01 - Feb 29')
  })

  test('when current year and same month', () => {
    expect(
      formatDateRange({
        rangeFrom: '2024-01-01T14:30:00.000Z',
        rangeTo: '2024-01-31T14:30:00.000Z'
      })
    ).toEqual('1-31 Jan')
  })

  test('when different year and different month', () => {
    expect(
      formatDateRange({
        rangeFrom: '2023-01-01T14:30:00.000Z',
        rangeTo: '2023-02-28T14:30:00.000Z'
      })
    ).toEqual('Jan 01, 2023 - Feb 28, 2023')
  })

  test('when different year and same month', () => {
    expect(
      formatDateRange({
        rangeFrom: '2023-01-01T14:30:00.000Z',
        rangeTo: '2023-01-31T14:30:00.000Z'
      })
    ).toEqual('1-31 Jan, 2023')
  })

  test('when past year, current year and same month', () => {
    expect(
      formatDateRange({
        rangeFrom: '2023-01-01T14:30:00.000Z',
        rangeTo: '2024-01-31T14:30:00.000Z'
      })
    ).toEqual('Jan 01, 2023 - Jan 31')
  })

  test('when past year and current year', () => {
    expect(
      formatDateRange({
        rangeFrom: '2023-12-01T14:30:00.000Z',
        rangeTo: '2024-01-31T14:30:00.000Z'
      })
    ).toEqual('Dec 01, 2023 - Jan 31')
  })

  test('when current year and future year', () => {
    expect(
      formatDateRange({
        rangeFrom: '2024-12-01T14:30:00.000Z',
        rangeTo: '2025-01-31T14:30:00.000Z'
      })
    ).toEqual('Dec 01 - Jan 31, 2025')
  })

  test('when past year and future year', () => {
    expect(
      formatDateRange({
        rangeFrom: '2023-12-01T14:30:00.000Z',
        rangeTo: '2025-01-31T14:30:00.000Z'
      })
    ).toEqual('Dec 01, 2023 - Jan 31, 2025')
  })
})

describe('makeDateYearsRange', () => {
  test('should return last year range with milliseconds', () => {
    const now = new Date('2023-04-24T13:45:00.000Z')
    const result = makeDateYearsRange({
      now,
      showMilliseconds: true,
      yearsAgo: 1
    })

    expect(result).toEqual({
      date_from: '2022-04-24T13:45:01.000Z',
      date_to: '2023-04-24T13:45:00.000Z'
    })
  })

  test('should return last year range without milliseconds', () => {
    const now = new Date('2023-04-24T13:45:00.538Z')
    const result = makeDateYearsRange({
      now,
      showMilliseconds: false,
      yearsAgo: 1
    })

    expect(result).toEqual({
      date_from: '2022-04-24T13:45:01Z',
      date_to: '2023-04-24T13:45:00Z'
    })
  })

  test('should return 5 years range without milliseconds', () => {
    const now = new Date('2023-04-24T13:45:00.538Z')
    const result = makeDateYearsRange({
      now,
      showMilliseconds: false,
      yearsAgo: 5
    })

    expect(result).toEqual({
      date_from: '2018-04-24T13:45:01Z',
      date_to: '2023-04-24T13:45:00Z'
    })
  })
})

describe('removeMillisecondsFromIsoDate', () => {
  test('should remove milliseconds from the date', () => {
    expect(removeMillisecondsFromIsoDate('2023-04-24T13:45:00.538Z')).toBe(
      '2023-04-24T13:45:00Z'
    )
  })

  test('should accept partial date string', () => {
    expect(removeMillisecondsFromIsoDate('2023-03-25')).toBe(
      '2023-03-25T00:00:00Z'
    )
  })

  test('should return same value if argument is invalid', () => {
    expect(removeMillisecondsFromIsoDate('2023-broken-date')).toBe(
      '2023-broken-date'
    )
  })
})
