import isEmpty from 'lodash/isEmpty'
import type { TokenProviderExtras } from './types'

/**
 * Encodes the given extras object into a Base64 string.
 * This ensures that the encoded string is safe for use in URLs.
 *
 * @param extras - The extras object to encode.
 * @returns The Base64 encoded string representation of the extras object.
 */
export function encodeExtras(extras: TokenProviderExtras): string {
  const jsonString = encodeURIComponent(JSON.stringify(extras))

  return typeof window !== 'undefined'
    ? window.btoa(jsonString)
    : Buffer.from(jsonString).toString('base64')
}

/**
 * Decodes the given Base64 string back into the original extras object,
 * which was encoded using `encodeExtras`.
 *
 * @param encodedExtras - The Base64 encoded string representation of the extras object.
 * @returns The decoded extras object.
 */
export function decodeExtras(
  encodedExtras?: string
): TokenProviderExtras | undefined {
  if (encodedExtras == null) {
    return undefined
  }

  const jsonString =
    typeof window !== 'undefined'
      ? window.atob(encodedExtras)
      : Buffer.from(encodedExtras, 'base64').toString('utf-8')

  return JSON.parse(decodeURIComponent(jsonString))
}

/**
 * Try to get the extras value from the URL params.
 */
export const getExtrasFromUrl = (): string | undefined => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const extras = params.get('extras')
    return isEmpty(extras) || extras == null ? undefined : extras
  }
}
