import utcToZonedTime from 'date-fns-tz/utcToZonedTime'
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc'
import endOfDay from 'date-fns/endOfDay'
import format from 'date-fns/format'
import formatDistance from 'date-fns/formatDistance'
import isThisYear from 'date-fns/isThisYear'
import isToday from 'date-fns/isToday'
import startOfDay from 'date-fns/startOfDay'
import sub from 'date-fns/sub'
import groupBy from 'lodash/groupBy'
import orderBy from 'lodash/orderBy'
import { type Simplify } from 'type-fest'

type Format =
  | 'date'
  | 'time'
  | 'timeWithSeconds'
  | 'full'
  | 'fullWithSeconds'
  | 'distanceToNow'
interface FormatDateOptions {
  /**
   * JavaScript ISO date string. Example '2022-10-06T11:59:30.371Z'
   */
  isoDate?: string
  /**
   * Set a specific timezone, when not passed default value is 'UTC'
   */
  timezone?: string
  /**
   * How to format the date:
   * - `date` – can be `Today` when today, `Feb 28` when current year or `Feb 28, 2022` when previous year
   * - `time` – `04:34` `18:54`
   * - `timeWithSeconds` – `04:34:23` `18:54:12`
   * - `full` – `Feb 28, 2023 · 15:30` the date in this string behaves like the `date` format
   * - `fullWithSeconds` – `Feb 28, 2023 · 15:30:43` the date in this string behaves like the `date` format
   * - `distanceToNow` – `about 1 hour ago` `10 months ago` `less than a minute ago`
   * @default date
   */
  format?: Format
}

/**
 * Format the date as nice string also specifying a custom timezone
 * @param opts a set of `FormatDateOptions`
 * @returns a nice string representation. Example: 'Jul 21, 2022' or 'Jul 21, 2022 · 1:16 PM' if includeTime
 */
export function formatDate({
  isoDate,
  timezone = 'UTC',
  ...opts
}: FormatDateOptions): string {
  if (isoDate == null) {
    return 'N/A'
  }

  try {
    const date = new Date(isoDate)
    const zonedDate = utcToZonedTime(date, timezone)
    const formatTemplate = getPresetFormatTemplate(
      zonedDate,
      timezone,
      opts.format
    )

    return format(zonedDate, formatTemplate)
  } catch {
    return 'N/A'
  }
}

interface FormatDateWithPredicateOptions extends FormatDateOptions {
  /**
   * Date predicate verb string. Example: 'Created' or 'Updated'.
   */
  predicate: string
}

/**
 * Generate a valid separator string based on provided date format
 * @param format a string belonging to `Format` type
 * @returns a string containing the wanted separator. Example: 'on' is valid separator for formats containing a date and 'at' is a valid separator for formats related to time.
 */
function getDatePredicateSeparatorByFormat(format: Format): string {
  switch (format) {
    case 'distanceToNow':
      return ''
    case 'time':
    case 'timeWithSeconds':
      return 'at '
    default:
      return 'on '
  }
}

/**
 * Generate a string containing provided predicate, a separator and provided date formatted according to `formatDate` method
 * @param opts a set of `FormatDateOptions` along with a date verb predicate. In this method `format` prop has 'full' default value.
 * @returns a nice string representation of the predicate, followed by the proper separator and the formatted date. Examples: 'Created today · 1:16 PM', 'Updated on Jul 21, 2022 · 1:16 PM' or 'Updated at 1:16 PM'
 */
export function formatDateWithPredicate({
  isoDate,
  timezone,
  format = 'full',
  predicate
}: FormatDateWithPredicateOptions): string {
  const formattedDate = formatDate({
    isoDate,
    timezone,
    format
  }).replace('Today', 'today')

  const separator = !formattedDate.includes('today')
    ? `${getDatePredicateSeparatorByFormat(format)}`
    : ''

  return `${predicate} ${separator}${formattedDate}`
}

export const timeSeparator = '·'

function getPresetFormatTemplate(
  zonedDate: Date,
  timezone: string,
  format: Format = 'date'
): string {
  switch (format) {
    case 'date':
      return isToday(zonedDate)
        ? "'Today'"
        : isThisYear(zonedDate)
        ? 'LLL dd'
        : 'LLL dd, yyyy'
    case 'time':
      return 'kk:mm'
    case 'timeWithSeconds':
      return `${getPresetFormatTemplate(zonedDate, timezone, 'time')}:ss`
    case 'full':
      return `${getPresetFormatTemplate(
        zonedDate,
        timezone,
        'date'
      )} ${timeSeparator} ${getPresetFormatTemplate(
        zonedDate,
        timezone,
        'time'
      )}`
    case 'fullWithSeconds':
      return `${getPresetFormatTemplate(
        zonedDate,
        timezone,
        'date'
      )} ${timeSeparator} ${getPresetFormatTemplate(
        zonedDate,
        timezone,
        'timeWithSeconds'
      )}`
    case 'distanceToNow':
      return `'${formatDistance(
        zonedDate,
        utcToZonedTime(new Date(), timezone)
      )} ago'`
  }
}

type DateISOString = string
/**
 * Calculate the time-zoned start or end of the day from an ISO date string.
 * Useful when getting date from a date range picker.
 * @param isoString a JavaScript ISO date string. Example '2022-10-06T11:59:30.371Z'
 * @param edge 'startOfTheDay' or 'endOfTheDay'
 * @param timezone Set a specific timezone, when not passed default value is 'UTC'
 * @returns a JavaScript ISO date string that reflect the start or end of the day
 * based on the user timezone. Example '2022-10-06T22:00:00.000Z' when timezone is 'Europe/Rome'
 */
export function getIsoDateAtDayEdge({
  isoString,
  edge,
  timezone = 'UTC'
}: {
  isoString: DateISOString
  edge: 'startOfTheDay' | 'endOfTheDay'
  timezone?: string
}): string | undefined {
  try {
    const date = new Date(isoString)
    if (date == null || isoString == null) {
      return undefined
    }

    const zonedDate = utcToZonedTime(date, timezone)

    if (edge === 'startOfTheDay') {
      return zonedTimeToUtc(startOfDay(zonedDate), timezone).toISOString()
    }

    if (edge === 'endOfTheDay') {
      return zonedTimeToUtc(endOfDay(zonedDate), timezone).toISOString()
    }

    return undefined
  } catch {
    return undefined
  }
}

/**
 * Subtract n days from an ISO date string
 * to always return the correspondent time-zoned start of the day
 *
 * Example: if date-now is the 8th of March at 16:00 Italian time
 * and I want to get the date at -7, the result will be
 * '2022-03-01T23:00:00.000Z' as UTC string since my timezone is 'Europe/Rome'
 * and on the 8th of March I was at +1 from UTC
 *
 * @param isoString JavaScript ISO date (eg: '2022-03-01T23:00:00.000Z')
 * @param days positive number of days to subtract
 * @param timezone (optional) in case of working with a specific timezone different from UTC
 * @returns a new iso string
 */
export function getIsoDateAtDaysBefore({
  isoString,
  days,
  timezone = 'UTC'
}: {
  isoString: DateISOString
  days: number
  timezone?: string
}): string | undefined {
  if (days < 0) {
    return undefined
  }

  const startOfDay = getIsoDateAtDayEdge({
    isoString,
    edge: 'startOfTheDay',
    timezone
  })

  if (startOfDay == null) {
    return undefined
  }

  return sub(new Date(startOfDay), { days }).toISOString()
}

export interface Event {
  date: string
}

type Position = 'first' | 'other'

/**
 *
 * @param events
 * @param options
 * @returns
 */
export function sortAndGroupByDate<T extends Event>(
  events: T[],
  {
    timezone,
    orders = 'desc'
  }: { timezone?: string; orders?: 'asc' | 'desc' } = {}
): Record<
  string,
  Array<
    Simplify<
      T & {
        position: Position
      }
    >
  >
> {
  const ordered: Array<T & { position: Position }> = orderBy(
    events,
    'date',
    orders
  ).map((event, index) => {
    const position: Position = index === events.length - 1 ? 'first' : 'other'
    return {
      ...event,
      position
    }
  })

  return groupBy(ordered, (val) =>
    formatDate({
      isoDate: val.date,
      format: 'date',
      timezone
    }).toUpperCase()
  )
}
