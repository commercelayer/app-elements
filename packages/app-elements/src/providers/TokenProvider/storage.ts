import { type TokenProviderAllowedApp } from './types'

type ItemType = 'accessToken' | 'extras'

export function makeStorageKey({
  appSlug,
  organizationSlug,
  itemType
}: {
  appSlug: TokenProviderAllowedApp
  organizationSlug: string
  itemType: ItemType
}): string {
  return `${appSlug}:${organizationSlug}:${itemType}`
}

export function getPersistentJWT({
  appSlug,
  organizationSlug = 'commercelayer',
  itemType
}: {
  /** The app for which to get the token. */
  appSlug: TokenProviderAllowedApp
  /** The organization slug for the token we want to retrieve. */
  organizationSlug?: string
  /** The JWT item type you want to retrieve. */
  itemType: ItemType
}): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  const storedAccessToken = window.localStorage.getItem(
    makeStorageKey({
      appSlug,
      organizationSlug,
      itemType
    })
  )
  return storedAccessToken
}

export function savePersistentJWT({
  appSlug,
  jwt,
  organizationSlug = 'commercelayer',
  itemType
}: {
  /** The app for which to get the token. */
  appSlug: TokenProviderAllowedApp
  /** The token to save. */
  jwt: string
  /** The organization slug for the token we want to store. */
  organizationSlug?: string
  /** The JWT item type you want to store. */
  itemType: ItemType
}): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    makeStorageKey({
      appSlug,
      organizationSlug,
      itemType
    }),
    jwt
  )
}
