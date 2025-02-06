import { type I18NLocale } from '#providers/I18NProvider'
import { formatInTimeZone } from 'date-fns-tz/formatInTimeZone'
import { fromZonedTime } from 'date-fns-tz/fromZonedTime'
import { toZonedTime } from 'date-fns-tz/toZonedTime'
import { endOfDay } from 'date-fns/endOfDay'
import { format } from 'date-fns/format'
import { formatDistance } from 'date-fns/formatDistance'
import { isBefore } from 'date-fns/isBefore'
import { isFuture } from 'date-fns/isFuture'
import { isPast } from 'date-fns/isPast'
import { isSameMonth } from 'date-fns/isSameMonth'
import { isSameYear } from 'date-fns/isSameYear'
import { isThisYear } from 'date-fns/isThisYear'
import { isToday } from 'date-fns/isToday'
import { it, type Locale } from 'date-fns/locale'
import { startOfDay } from 'date-fns/startOfDay'
import { sub } from 'date-fns/sub'
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
  /**
   * Whether to show or not the current year.
   * @default false
   */
  showCurrentYear?: boolean
  /**
   * Locale to use for formatting the date.
   * @default en
   */
  locale?: I18NLocale
}

/**
 * Format the date as nice string also specifying a custom timezone
 * @param opts a set of `FormatDateOptions`
 * @returns a nice string representation. Example: 'Jul 21, 2022' or 'Jul 21, 2022 · 1:16 PM' if includeTime
 */
export function formatDate({
  isoDate,
  timezone = 'UTC',
  locale = 'en-US',
  showCurrentYear = false,
  ...opts
}: FormatDateOptions): string {
  if (isoDate == null) {
    return 'N/A'
  }

  try {
    const date = new Date(isoDate)
    const zonedDate = toZonedTime(date, timezone)
    const formatTemplate = getPresetFormatTemplate(
      zonedDate,
      timezone,
      opts.format,
      showCurrentYear,
      locale
    )

    return format(zonedDate, formatTemplate, {
      locale: getLocaleOption(locale)
    })
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
function getDatePredicateSeparatorByFormat(
  format: Format,
  locale: I18NLocale
): string {
  switch (format) {
    case 'distanceToNow':
      return ''
    case 'time':
    case 'timeWithSeconds':
      return `${i18n(locale).at} `
    default:
      return `${i18n(locale).on} `
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
  predicate,
  locale = 'en-US'
}: FormatDateWithPredicateOptions): string {
  const todayText = i18n(locale).today
  const formattedDate = formatDate({
    isoDate,
    timezone,
    format,
    locale
  })
    // Replace the first occurrence of 'Today' with 'today' in lowercase
    .replace(todayText, todayText.toLowerCase())

  const separator = !formattedDate.includes(todayText.toLowerCase())
    ? `${getDatePredicateSeparatorByFormat(format, locale)}`
    : ''

  return `${predicate} ${separator}${formattedDate}`
}

export const timeSeparator = ', '

function getPresetFormatTemplate(
  zonedDate: Date,
  timezone: string,
  format: Format = 'date',
  showCurrentYear: boolean,
  locale: I18NLocale
): string {
  switch (format) {
    case 'date':
      return isToday(zonedDate) && !showCurrentYear
        ? `'${i18n(locale).today}'`
        : isThisYear(zonedDate) && !showCurrentYear
          ? 'LLL dd'
          : 'LLL dd, yyyy'
    case 'time':
      return 'HH:mm'
    case 'timeWithSeconds':
      return `${getPresetFormatTemplate(zonedDate, timezone, 'time', showCurrentYear, locale)}:ss`
    case 'full':
      return `${getPresetFormatTemplate(
        zonedDate,
        timezone,
        'date',
        showCurrentYear,
        locale
      )}${timeSeparator}${getPresetFormatTemplate(
        zonedDate,
        timezone,
        'time',
        showCurrentYear,
        locale
      )}`
    case 'fullWithSeconds':
      return `${getPresetFormatTemplate(
        zonedDate,
        timezone,
        'date',
        showCurrentYear,
        locale
      )}${timeSeparator}${getPresetFormatTemplate(
        zonedDate,
        timezone,
        'timeWithSeconds',
        showCurrentYear,
        locale
      )}`
    case 'distanceToNow':
      return `'${formatDistance(zonedDate, toZonedTime(new Date(), timezone), {
        addSuffix: true,
        locale: getLocaleOption(locale)
      })}'`
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

    const zonedDate = toZonedTime(date, timezone)

    if (edge === 'startOfTheDay') {
      return fromZonedTime(startOfDay(zonedDate), timezone).toISOString()
    }

    if (edge === 'endOfTheDay') {
      return fromZonedTime(endOfDay(zonedDate), timezone).toISOString()
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

/**
 * Given the event date (`startsAt` and `expiresAt`) it returns whether the the event is `active`, `past` or `upcoming`.
 */
export function getEventDateInfo({
  startsAt,
  expiresAt,
  timezone = 'UTC'
}: {
  /** The activation date/time of the event (ISO date string. Example '2022-10-06T11:59:30.371Z'). */
  startsAt: DateISOString
  /** The expiration date/time of the promotion (must be after startsAt) (ISO date string. Example '2022-10-06T11:59:30.371Z'). */
  expiresAt: DateISOString
  /** Set a specific timezone, when not passed default value is 'UTC' */
  timezone?: string
}): 'active' | 'past' | 'upcoming' {
  const zonedStartsAt = toZonedTime(new Date(startsAt), timezone)
  const zonedExpiresAt = toZonedTime(new Date(expiresAt), timezone)

  if (isBefore(zonedExpiresAt, zonedStartsAt)) {
    throw new Error(
      'The expiration date/time of the event must be after the activation (startsAt).'
    )
  }

  if (isFuture(zonedStartsAt)) {
    return 'upcoming'
  }

  if (isPast(zonedExpiresAt)) {
    return 'past'
  }

  return 'active'
}

/**
 * Format a date range as a nice string also specifying a custom timezone
 * @returns a nice string representation. Example: '1-21 Jul, 2022' or 'Jul 21, 2022 - Jan 12, 2023'
 */
export function formatDateRange({
  rangeFrom,
  rangeTo,
  timezone = 'UTC',
  locale = 'en-US'
}: {
  /** JavaScript Date or ISO string. Example '2022-10-06T11:59:30.371Z' */
  rangeFrom: DateISOString | Date
  /** JavaScript Date or ISO string. Example '2022-11-06T11:59:30.371Z' */
  rangeTo: DateISOString | Date
  /** Set a specific timezone, when not passed default value is 'UTC' */
  timezone?: string
  /** Locale to use for formatting the date. */
  locale?: I18NLocale
  zonedAlready?: boolean
}): string {
  rangeFrom = new Date(rangeFrom).toISOString()
  rangeTo = new Date(rangeTo).toISOString()

  if (isSameYear(rangeFrom, rangeTo) && isSameMonth(rangeFrom, rangeTo)) {
    const dayOfMonthFrom = formatInTimeZone(rangeFrom, timezone, 'd', {
      locale: getLocaleOption(locale)
    })
    const dayOfMonthTo = formatInTimeZone(rangeTo, timezone, 'd', {
      locale: getLocaleOption(locale)
    })
    const month = formatInTimeZone(rangeFrom, timezone, 'LLL', {
      locale: getLocaleOption(locale)
    })
    const year = isThisYear(rangeFrom) ? '' : `, ${format(rangeFrom, 'yyyy')}`

    return `${dayOfMonthFrom}-${dayOfMonthTo} ${month}${year}`
  }

  const formattedFrom = formatDate({ isoDate: rangeFrom, timezone, locale })
  const formattedTo = formatDate({ isoDate: rangeTo, timezone, locale })

  return `${formattedFrom} - ${formattedTo}`
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
    locale,
    orders = 'desc'
  }: { timezone?: string; locale?: I18NLocale; orders?: 'asc' | 'desc' } = {}
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
      timezone,
      locale
    }).toUpperCase()
  )
}

/**
 * Remove milliseconds from a date ISO string.
 *
 * Example:
 * ```
 * removeMilliseconds('2022-04-24T13:44:59.452Z') // '2022-04-24T13:44:59Z'
 * ```
 */
export function removeMillisecondsFromIsoDate(isoDate: string): string {
  try {
    const validDate = new Date(isoDate)
    return (validDate.toISOString().split('.')[0] ?? '') + 'Z'
  } catch (e) {
    return isoDate
  }
}

/**
 * Creates a date range spanning a specified number of years back from a given reference date.
 * The range includes the start date and ends exactly one second before the reference date to form a precise interval.
 *
 * @param now The reference date from which the range is calculated. Typically the current date.
 * @param yearsAgo The number of years to go back from the reference date to determine the start of the range.
 * @param showMilliseconds If set to false, the resulting date strings are formatted to exclude milliseconds.
 * @returns An object containing `date_from` and `date_to` properties. `date_from` is the calculated start date of the range,
 *          going back the specified number of years from `now`. `date_to` is adjusted to be one second before `now`,
 *          effectively marking the end of the range. Both dates are returned as ISO 8601 formatted strings, with an option
 *          to include or exclude milliseconds.
 *
 * Example usage:
 * ```
 * const range = makeDateYearsRange(new Date(), 1, false);
 * console.log(range);
 * // Output when showMilliseconds is false:
 * // { date_from: '2022-04-24T13:45:01Z, date_to: '2023-04-24T13:45:00Z' }
 * // Output when showMilliseconds is true:
 * // { date_from: '2022-04-24T13:45:01.000Z, date_to: '2023-04-24T13:45:00.000Z' }
 * ```
 */
export function makeDateYearsRange({
  now,
  yearsAgo,
  showMilliseconds = true
}: {
  now: Date
  yearsAgo: number
  showMilliseconds: boolean
}): {
  date_from: string
  date_to: string
} {
  if (yearsAgo < 1) {
    throw new Error('Years ago must be greater than 0')
  }

  const to = now.toISOString()

  // same day, one year ago
  const lastYearDate = new Date(
    new Date(now).setFullYear(now.getFullYear() - yearsAgo)
  )
  // remove 1 second to avoid overlapping with the current year
  lastYearDate.setSeconds(lastYearDate.getSeconds() + 1)
  const from = lastYearDate.toISOString()

  return {
    date_from: showMilliseconds ? from : removeMillisecondsFromIsoDate(from),
    date_to: showMilliseconds ? to : removeMillisecondsFromIsoDate(to)
  }
}

/**
 * Get the locale object from date-fns/locale for the given locale code.
 */
function getLocaleOption(locale: I18NLocale): Locale | undefined {
  switch (locale) {
    case 'it-IT':
      return it
    case 'en-US':
    default:
      return undefined
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function i18n(localeCode: I18NLocale) {
  const locale = {
    en: {
      today: 'Today',
      at: 'at',
      on: 'on'
    },
    it: {
      today: 'Oggi',
      at: 'alle',
      on: 'il'
    }
  }

  if (localeCode === 'it-IT') {
    return locale.it
  }
  return locale.en
}
