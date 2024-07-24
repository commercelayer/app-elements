import { type TokenProviderAllowedApp } from './types'

export function makeStorageKey({
  appSlug,
  organizationSlug
}: {
  appSlug: TokenProviderAllowedApp
  organizationSlug: string
}): string {
  return `${appSlug}:${organizationSlug}:accessToken`
}

export function getPersistentAccessToken({
  appSlug,
  organizationSlug = 'commercelayer'
}: {
  /** The app for which to get the token. */
  appSlug: TokenProviderAllowedApp
  /** The organization slug for the token we want to retrieve. */
  organizationSlug?: string
}): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  const storedAccessToken = window.localStorage.getItem(
    makeStorageKey({
      appSlug,
      organizationSlug
    })
  )
  return storedAccessToken
}

export function savePersistentAccessToken({
  appSlug,
  accessToken,
  organizationSlug = 'commercelayer'
}: {
  /** The app for which to get the token. */
  appSlug: TokenProviderAllowedApp
  /** The token to save. */
  accessToken: string
  /** The organization slug for the token we want to store. */
  organizationSlug?: string
}): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    makeStorageKey({
      appSlug,
      organizationSlug
    }),
    accessToken
  )
}
