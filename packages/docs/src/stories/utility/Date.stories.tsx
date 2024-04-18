import {
  formatDate,
  formatDateRange,
  getEventDateInfo,
  makeDateYearsRange
} from '#helpers/date'
import { Description, Stories, Subtitle, Title } from '@storybook/blocks'
import { type Meta, type StoryFn } from '@storybook/react'
import { CodeSample } from 'src/components/CodeSample'

/** This list of `date` utilities help to manipulate and format the date in a standard and conventional way. */
const setup: Meta = {
  title: 'Utility/Date',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        code: null
      },
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Stories />
        </>
      )
    }
  },
  argTypes: {
    children: {
      table: {
        disable: true
      }
    }
  }
}
export default setup

/**
 * Format the date as nice string also specifying a custom timezone.
 */
export const FormatDate: StoryFn = () => {
  return (
    <>
      <CodeSample
        fn={() => {
          return formatDate({
            isoDate: '2022-10-14T14:32:00.000Z'
          })
        }}
      />
      <CodeSample
        fn={() => {
          // This is to avoid name mangling.
          // eslint-disable-next-line no-eval
          eval('')

          const currentYear = new Date().getFullYear()

          return formatDate({
            isoDate: `${currentYear}-10-14T14:32:00.000Z`,
            format: 'date'
          })
        }}
      />
      <CodeSample
        fn={() => {
          return formatDate({
            isoDate: new Date().toString(),
            format: 'date'
          })
        }}
      />
      <CodeSample
        fn={() => {
          return formatDate({
            isoDate: '2023-02-22T10:32:47.284Z',
            format: 'full'
          })
        }}
      />
      <CodeSample
        fn={() => {
          return formatDate({
            isoDate: '2022-10-26T16:16:31.279Z',
            format: 'fullWithSeconds'
          })
        }}
      />
      <CodeSample
        fn={() => {
          return formatDate({
            isoDate: '2023-02-22T05:32:47.284Z',
            format: 'time'
          })
        }}
      />
      <CodeSample
        fn={() => {
          return formatDate({
            isoDate: '2023-02-22T10:32:47.284Z',
            format: 'timeWithSeconds'
          })
        }}
      />
      <CodeSample
        fn={() => {
          return formatDate({
            isoDate: '2022-10-26T16:16:31.279Z',
            timezone: 'Australia/Sydney',
            format: 'date'
          })
        }}
      />
      <CodeSample
        fn={() => {
          return formatDate({
            isoDate: '2023-12-25T14:30:00.000Z',
            timezone: 'Europe/Rome',
            format: 'distanceToNow'
          })
        }}
      />
      <CodeSample
        fn={() => {
          return formatDate({
            isoDate: '2033-12-25T14:30:00.000Z',
            timezone: 'Europe/Rome',
            format: 'distanceToNow'
          })
        }}
      />
    </>
  )
}

/**
 * Format a date range as a nice string also specifying a custom timezone.
 */
export const FormatDateRange: StoryFn = () => {
  // This is to avoid name mangling.
  // eslint-disable-next-line no-eval
  eval('')

  const currentYear = new Date().getFullYear()

  return (
    <>
      <CodeSample
        fn={() => {
          // This is to avoid name mangling.
          // eslint-disable-next-line no-eval
          eval('')

          const currentYear = new Date().getFullYear()

          return currentYear
        }}
      />
      <CodeSample
        fn={() => {
          return formatDateRange({
            rangeFrom: `${currentYear}-01-01T14:30:00.000Z`,
            rangeTo: `${currentYear}-02-29T14:30:00.000Z`
          })
        }}
      />
      <CodeSample
        fn={() => {
          return formatDateRange({
            rangeFrom: `${currentYear}-01-01T14:30:00.000Z`,
            rangeTo: `${currentYear}-02-29T14:30:00.000Z`,
            timezone: 'Australia/Sydney'
          })
        }}
      />
      <CodeSample
        fn={() => {
          return formatDateRange({
            rangeFrom: `${currentYear}-01-01T14:30:00.000Z`,
            rangeTo: `${currentYear}-01-31T14:30:00.000Z`
          })
        }}
      />
      <CodeSample
        fn={() => {
          return formatDateRange({
            rangeFrom: `${currentYear - 1}-01-01T14:30:00.000Z`,
            rangeTo: `${currentYear - 1}-02-28T14:30:00.000Z`
          })
        }}
      />
      <CodeSample
        fn={() => {
          return formatDateRange({
            rangeFrom: `${currentYear - 1}-01-01T14:30:00.000Z`,
            rangeTo: `${currentYear - 1}-01-31T14:30:00.000Z`
          })
        }}
      />
      <CodeSample
        fn={() => {
          return formatDateRange({
            rangeFrom: `${currentYear - 1}-01-01T14:30:00.000Z`,
            rangeTo: `${currentYear}-01-31T14:30:00.000Z`
          })
        }}
      />
      <CodeSample
        fn={() => {
          return formatDateRange({
            rangeFrom: `${currentYear}-12-01T14:30:00.000Z`,
            rangeTo: `${currentYear + 1}-01-31T14:30:00.000Z`
          })
        }}
      />
      <CodeSample
        fn={() => {
          return formatDateRange({
            rangeFrom: `${currentYear - 1}-12-01T14:30:00.000Z`,
            rangeTo: `${currentYear + 1}-01-31T14:30:00.000Z`
          })
        }}
      />
    </>
  )
}

/**
 * Given the event date (`startsAt` and `expiresAt`) it returns whether the the event is `active`, `past` or `upcoming`.
 */
export const GetEventDateInfo: StoryFn = () => {
  return (
    <>
      <CodeSample
        fn={() =>
          getEventDateInfo({
            startsAt: '2024-01-01T14:30:00.000Z',
            expiresAt: '3024-01-31T14:30:00.000Z'
          })
        }
      />
      <CodeSample
        fn={() =>
          getEventDateInfo({
            startsAt: '2023-01-01T14:30:00.000Z',
            expiresAt: '2023-01-31T14:30:00.000Z'
          })
        }
      />
      <CodeSample
        fn={() =>
          getEventDateInfo({
            startsAt: '3023-01-01T14:30:00.000Z',
            expiresAt: '3023-01-31T14:30:00.000Z'
          })
        }
      />
    </>
  )
}

/**
 *  Returns the specified `yearsAgo` date range (minus 1 second) from the specified `now` date.
 */
export const MakeDateYearsRange: StoryFn = () => {
  return (
    <>
      <CodeSample
        fn={() =>
          makeDateYearsRange({
            now: new Date('2024-01-01T14:30:00.000Z'),
            yearsAgo: 1,
            showMilliseconds: true
          })
        }
      />
    </>
  )
}
