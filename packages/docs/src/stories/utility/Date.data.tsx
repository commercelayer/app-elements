import {
  formatDate,
  formatDateRange,
  getEventDateInfo,
  makeDateYearsRange
} from '#helpers/date'
import { type CodeSampleProps } from 'src/components/CodeSample'

export const formatDateExamples: CodeSampleProps[] = [
  {
    fn: () => {
      return formatDate({
        isoDate: '2022-10-14T14:32:00.000Z'
      })
    }
  },
  {
    fn: () => {
      // This is to avoid name mangling.
      // eslint-disable-next-line no-eval
      eval('')

      const currentYear = new Date().getFullYear()

      return formatDate({
        isoDate: `${currentYear}-10-14T14:32:00.000Z`,
        format: 'date'
      })
    }
  },
  {
    fn: () => {
      // This is to avoid name mangling.
      // eslint-disable-next-line no-eval
      eval('')

      const currentYear = new Date().getFullYear()

      return formatDate({
        isoDate: `${currentYear}-10-14T14:32:00.000Z`,
        format: 'date',
        showCurrentYear: true
      })
    }
  },
  {
    fn: () => {
      return formatDate({
        isoDate: new Date().toString(),
        format: 'date'
      })
    }
  },
  {
    fn: () => {
      return formatDate({
        isoDate: '2023-02-22T10:32:47.284Z',
        format: 'full'
      })
    }
  },
  {
    fn: () => {
      return formatDate({
        isoDate: '2022-10-26T16:16:31.279Z',
        format: 'fullWithSeconds'
      })
    }
  },
  {
    fn: () => {
      return formatDate({
        isoDate: '2023-02-22T05:32:47.284Z',
        format: 'time'
      })
    }
  },
  {
    fn: () => {
      return formatDate({
        isoDate: '2023-02-22T10:32:47.284Z',
        format: 'timeWithSeconds'
      })
    }
  },
  {
    fn: () => {
      return formatDate({
        isoDate: '2022-10-26T16:16:31.279Z',
        timezone: 'Australia/Sydney',
        format: 'date'
      })
    }
  },
  {
    fn: () => {
      return formatDate({
        isoDate: '2023-12-25T14:30:00.000Z',
        timezone: 'Europe/Rome',
        format: 'distanceToNow'
      })
    }
  },
  {
    fn: () => {
      return formatDate({
        isoDate: '2033-12-25T14:30:00.000Z',
        timezone: 'Europe/Rome',
        format: 'distanceToNow'
      })
    }
  }
]

// This is to avoid name mangling.
// eslint-disable-next-line no-eval
eval('')

const currentYear = new Date().getFullYear()

export const formatDateRangeExamples: CodeSampleProps[] = [
  {
    fn: () => {
      // This is to avoid name mangling.
      // eslint-disable-next-line no-eval
      eval('')

      const currentYear = new Date().getFullYear()

      return currentYear
    }
  },
  {
    fn: () => {
      return formatDateRange({
        rangeFrom: `${currentYear}-01-01T14:30:00.000Z`,
        rangeTo: `${currentYear}-02-29T14:30:00.000Z`
      })
    }
  },
  {
    fn: () => {
      return formatDateRange({
        rangeFrom: `${currentYear}-01-01T14:30:00.000Z`,
        rangeTo: `${currentYear}-02-29T14:30:00.000Z`,
        timezone: 'Australia/Sydney'
      })
    }
  },
  {
    fn: () => {
      return formatDateRange({
        rangeFrom: `${currentYear}-01-01T14:30:00.000Z`,
        rangeTo: `${currentYear}-01-31T14:30:00.000Z`
      })
    }
  },
  {
    fn: () => {
      return formatDateRange({
        rangeFrom: `${currentYear - 1}-01-01T14:30:00.000Z`,
        rangeTo: `${currentYear - 1}-02-28T14:30:00.000Z`
      })
    }
  },
  {
    fn: () => {
      return formatDateRange({
        rangeFrom: `${currentYear - 1}-01-01T14:30:00.000Z`,
        rangeTo: `${currentYear - 1}-01-31T14:30:00.000Z`
      })
    }
  },
  {
    fn: () => {
      return formatDateRange({
        rangeFrom: `${currentYear - 1}-01-01T14:30:00.000Z`,
        rangeTo: `${currentYear}-01-31T14:30:00.000Z`
      })
    }
  },
  {
    fn: () => {
      return formatDateRange({
        rangeFrom: `${currentYear}-12-01T14:30:00.000Z`,
        rangeTo: `${currentYear + 1}-01-31T14:30:00.000Z`
      })
    }
  },
  {
    fn: () => {
      return formatDateRange({
        rangeFrom: `${currentYear - 1}-12-01T14:30:00.000Z`,
        rangeTo: `${currentYear + 1}-01-31T14:30:00.000Z`
      })
    }
  }
]

export const getEventDateInfoExamples: CodeSampleProps[] = [
  {
    fn: () =>
      getEventDateInfo({
        startsAt: '2024-01-01T14:30:00.000Z',
        expiresAt: '3024-01-31T14:30:00.000Z'
      })
  },
  {
    fn: () =>
      getEventDateInfo({
        startsAt: '2023-01-01T14:30:00.000Z',
        expiresAt: '2023-01-31T14:30:00.000Z'
      })
  },
  {
    fn: () =>
      getEventDateInfo({
        startsAt: '3023-01-01T14:30:00.000Z',
        expiresAt: '3023-01-31T14:30:00.000Z'
      })
  }
]

export const makeDateYearsRangeExamples: CodeSampleProps[] = [
  {
    fn: () =>
      makeDateYearsRange({
        now: new Date('2024-01-01T14:30:00.000Z'),
        yearsAgo: 1,
        showMilliseconds: true
      })
  }
]
