/**
 * Humanize a given string by transforming first letter to be uppercase and by removing spaces and underscores.
 */
export function humanizeString(str: string): string {
  return str
    .replace(/^[\s_]+|[\s_]+$/g, '')
    .replace(/[_\s]+/g, ' ')
    .replace(/^[a-z]/, function (m) {
      return m.toUpperCase()
    })
}
