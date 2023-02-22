import format from 'date-fns/format'
import { utcToZonedTime } from 'date-fns-tz'

/**
 * Format the date as nice string
 * @returns a nice string representation. Example: 'Jul 21, 2022' or 'Jul 21, 2022 · 1:16 PM' if includeTime
 */
export function formatDate({
  isoDate,
  includeTime = false,
  timezone = 'UTC'
}: {
  /**
   * JavaScript ISO date string. Example '2022-10-06T11:59:30.371Z'
   */
  isoDate?: string
  /**
   * Boolean value to include time in returned string: Example: 'Oct 26, 2022 · 4:16 PM'
   */
  includeTime?: boolean
  /**
   * Set a specific timezone, when not passed default value is 'UTC'
   */
  timezone?: string
}): string {
  if (isoDate == null) {
    return 'N/A'
  }

  try {
    const date = new Date(isoDate)
    const zonedDate = utcToZonedTime(date, timezone)

    // Check template patterns here: https://date-fns.org/v2.29.3/docs/format
    const formatTemplate = includeTime
      ? 'LLL dd, yyyy · h:mm b'
      : 'LLL dd, yyyy'

    return format(zonedDate, formatTemplate)
  } catch {
    return 'N/A'
  }
}
