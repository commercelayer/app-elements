/**
 * Format the date as nice string
 * @param dateIsoString - to match iso string `created_at` or `updated_at` from the import object (or <any>_at). Example '2022-10-06T11:59:30.371Z'
 * @param includeTime - optional flag to also include time
 * @param timeZone - optional string to cast a specific timezone and override user's browser default (Eg: UTC)
 * @returns a nice string representation. Example: 'Jul 21, 2022' or 'Jul 21, 2022 · 1:16 PM' if includeTime
 */
export function formatDate(
  dateIsoString?: string,
  includeTime?: boolean,
  timeZone?: string
): string {
  if (dateIsoString == null) {
    return 'N/A'
  }
  try {
    const date = new Date(dateIsoString)
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: includeTime === true ? 'numeric' : undefined,
      minute: includeTime === true ? 'numeric' : undefined,
      timeZone
    }

    const niceString = new Intl.DateTimeFormat('en-US', options).format(date)
    if (includeTime === true) {
      // we need to separate date from time with a middle dot `·` symbol
      const parts = niceString.split(', ')
      return `${parts[0]}, ${parts[1]} · ${parts[2]}`
    }

    return niceString
  } catch {
    return 'N/A'
  }
}
