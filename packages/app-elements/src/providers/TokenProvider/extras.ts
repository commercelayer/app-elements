import isEmpty from 'lodash-es/isEmpty'
import type { TokenProviderAuthUser, TokenProviderExtras } from './types'

/**
 * Encodes the given extras object into a Base64 string.
 * This ensures that the encoded string is safe for use in URLs.
 *
 * @param extras - The extras object to encode.
 * @returns The Base64 encoded string representation of the extras object.
 */
export function encodeExtras(extras: TokenProviderExtras): string {
  return base64URLSafe.encode(JSON.stringify(extras))
}

/**
 * Decodes the given Base64 string back into the original extras object,
 * which was encoded using `encodeExtras`.
 *
 * @param encodedExtras - The Base64 encoded string representation of the extras object.
 * @returns The decoded extras object.
 */
export function decodeExtras(
  encodedExtras?: string | null
): TokenProviderExtras | undefined {
  if (encodedExtras == null) {
    return undefined
  }

  return JSON.parse(base64URLSafe.decode(encodedExtras))
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

/**
 * Encode/decode base64 URL safe strings.
 * Utils cloned from CommerceLayer JS Auth library.
 * https://github.com/commercelayer/commercelayer-js-auth/blob/main/packages/js-auth/src/utils/base64.ts
 */
const base64URLSafe = {
  encode: (stringToEncode: string): string => {
    if (typeof btoa !== 'undefined') {
      return (
        btoa(stringToEncode)
          // Remove padding equal characters
          .replaceAll('=', '')
          // Replace characters according to base64url specifications
          .replaceAll('+', '-')
          .replaceAll('/', '_')
      )
    }
    return Buffer.from(stringToEncode, 'binary').toString('base64url')
  },

  decode: (encodedData: string): string => {
    if (typeof atob !== 'undefined') {
      return atob(
        encodedData
          // Replace characters according to base64url specifications
          .replaceAll('-', '+')
          .replaceAll('_', '/')
      )
    }
    return Buffer.from(encodedData, 'base64url').toString('binary')
  }
}

/**
 * Validates if the user object received from `extras` is a valid one and can be added to the TokenProvider context.
 */
export function isValidUser(
  user?: TokenProviderAuthUser | null
): user is TokenProviderAuthUser {
  const compareKeys = Object.keys({
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    displayName: '',
    fullName: '',
    timezone: '',
    locale: 'en-US'
  } satisfies TokenProviderAuthUser).sort()

  if (user == null || isEmpty(user)) {
    return false
  }

  if (isEmpty(user.email) || isEmpty(user.id)) {
    return false
  }

  if (isEmpty(user.firstName) && isEmpty(user.lastName)) {
    // at least one of the them should not be empty string
    return false
  }

  return Object.keys(user)
    .sort()
    .every((key, index) => key === compareKeys[index])
}
