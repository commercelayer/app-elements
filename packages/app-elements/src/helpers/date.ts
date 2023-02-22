import format from 'date-fns/format'
import { utcToZonedTime } from 'date-fns-tz'

/**
 * Format the date as nice string
 * @param dateIsoString - to match iso string `created_at` or `updated_at` from the import object (or <any>_at). Example '2022-10-06T11:59:30.371Z'
 * @param includeTime - optional flag to also include time
 * @param timezone - optional string to cast a specific timezone and override user's browser default (Eg: UTC)
 * @returns a nice string representation. Example: 'Jul 21, 2022' or 'Jul 21, 2022 · 1:16 PM' if includeTime
 */
export function formatDate({
  isoDate,
  includeTime = false,
  timezone = 'UTC'
}: {
  isoDate?: string
  includeTime?: boolean
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
