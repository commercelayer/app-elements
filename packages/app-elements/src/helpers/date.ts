import { utcToZonedTime } from 'date-fns-tz'
import format from 'date-fns/format'
import isToday from 'date-fns/isToday'
import isThisYear from 'date-fns/isThisYear'
import formatDistance from 'date-fns/formatDistance'

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
