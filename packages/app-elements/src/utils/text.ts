import capitalize from 'lodash/capitalize'
import startCase from 'lodash/startCase'

/**
 * Given a `text` and a list of `values` it returns always the same value given the same `text`.
 * For example this is used when you need to map a fullname with a color.
 */
export function getDeterministicValue(text: string, values: string[]): string {
  const utf8Encode = new TextEncoder()
  const hashCode = utf8Encode.encode(text).reduce((sum, v) => sum + v, 0)
  const index = hashCode % values.length
  return values[index]
}

/**
 * Get initials given a text.
 * @example getInitials('Ringo Starr') -> 'RS'
 */
export function getInitials(text: string): string {
  const textParts = text.toUpperCase().split(' ')

  if (textParts.length > 1 && textParts[1].length > 0) {
    const [firstName, lastName] = textParts
    return `${firstName[0]}${lastName[0]}`
  }

  return textParts[0].slice(0, 2)
}

/**
 * Humanize a given string by transforming first letter to be uppercase and by removing spaces and underscores.
 * @example humanizeString('--First_Name') -> 'First name'
 */
export function humanizeString(str: string): string {
  return capitalize(startCase(str))
}
