import { formatDate } from './date'

describe('formatDate', () => {
  test('Should accept a date with time', () => {
    // AM
    expect(
      formatDate({
        isoDate: '2023-02-22T10:32:47.284Z'
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

  test('Should return a nice date string', () => {
    expect(
      formatDate({
        isoDate: '2022-10-14T14:32:00.000Z',
        format: 'noTime'
      })
    ).toBe('Oct 14, 2022')
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
        timezone: 'Europe/Rome'
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
