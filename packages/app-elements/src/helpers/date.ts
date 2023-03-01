import { utcToZonedTime } from 'date-fns-tz'
import format from 'date-fns/format'

type Format = 'full' | 'noTime' | 'noYear'
type FormatDateOptions =
  | {
      /**
       * JavaScript ISO date string. Example '2022-10-06T11:59:30.371Z'
       */
      isoDate?: string
      /**
       * Set a specific timezone, when not passed default value is 'UTC'
       */
      timezone?: string
    } & (
      | {
          /**
           * How to format the date:
           * - full `Feb 28, 2023 · 5:30 PM`
           * - noTime `Feb 28, 2023`
           * - noYear `Feb 28`
           * @default noTime
           */
          format?: Format
        }
      | {
          /**
           * When set as `custom` a `customTemplate` is required
           */
          format: 'custom'
          /**
           * Custom template to override the default one ('LLL dd, yyyy').
           * @link https://date-fns.org/v2.29.3/docs/format
           */
          customTemplate: string
        }
    )

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
    const formatTemplate =
      opts.format === 'custom'
        ? opts.customTemplate
        : getPresetFormatTemplate(opts.format)

    return format(zonedDate, formatTemplate)
  } catch {
    return 'N/A'
  }
}

function getPresetFormatTemplate(format: Format = 'noTime'): string {
  switch (format) {
    case 'noTime':
      return 'LLL dd, yyyy' // Feb 28, 2023
    case 'noYear':
      return 'LLL dd' // Feb 28
    case 'full':
      return 'LLL dd, yyyy · h:mm b' // Feb 28, 2023 · 5:30 PM
  }
}
