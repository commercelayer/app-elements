import capitalize from 'lodash/capitalize'
import startCase from 'lodash/startCase'
import type { JsonPrimitive } from 'type-fest'

/**
 * Given a `text` and a list of `values` it returns always the same value given the same `text`.
 * For example this is used when you need to map a fullname with a color.
 */
export function getDeterministicValue(
  text: string,
  values: readonly [string, ...string[]]
): string {
  const utf8Encode = new TextEncoder()
  const hashCode = utf8Encode.encode(text).reduce((sum, v) => sum + v, 0)
  const index = hashCode % values.length
  return values[index] ?? '#FFFFFF'
}

/**
 * Get initials given a text.
 * @example getInitials('Ringo Starr') -> 'RS'
 */
export function getInitials(text: string): string {
  const textParts = text.toUpperCase().split(' ')
  const [firstName, lastName] = textParts

  if (firstName === undefined) {
    return ''
  }

  if (lastName !== undefined && lastName.length > 0) {
    return `${firstName.slice(0, 1)}${lastName.slice(0, 1)}`
  }

  return firstName.slice(0, 2)
}

/**
 * Humanize a given string by transforming first letter to be uppercase and by removing spaces and underscores.
 * @example humanizeString('--First_Name') -> 'First name'
 */
export function humanizeString(str: string): string {
  return capitalize(startCase(str))
}

/**
 * Check whether a given value is a valid JSON primitive (`string | number | boolean | null`)
 * @param value anything
 * @returns value is a JSON primitive
 */
export function isJsonPrimitive(value: any): value is JsonPrimitive {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null
  )
}
