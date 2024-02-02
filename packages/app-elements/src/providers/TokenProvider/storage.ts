import { type TokenProviderAllowedApp } from './types'
import { getOrgSlugFromCurrentUrl } from './url'

export function makeStorageKey({
  appSlug,
  organizationSlug
}: {
  appSlug: TokenProviderAllowedApp
  organizationSlug: string
}): string {
  return `${appSlug}:${
    organizationSlug ?? getOrgSlugFromCurrentUrl()
  }:accessToken`
}

export function getPersistentAccessToken({
  appSlug,
  organizationSlug
}: {
  /** The app for which to get the token. */
  appSlug: TokenProviderAllowedApp
  /** Try to infer it from the current URL when not explicitly provided. */
  organizationSlug?: string
}): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  const storedAccessToken = window.localStorage.getItem(
    makeStorageKey({
      appSlug,
      organizationSlug:
        organizationSlug ?? getOrgSlugFromCurrentUrl() ?? 'commercelayer'
    })
  )
  return storedAccessToken
}

export function savePersistentAccessToken({
  appSlug,
  accessToken,
  organizationSlug
}: {
  /** The app for which to get the token. */
  appSlug: TokenProviderAllowedApp
  /** The token to save. */
  accessToken: string
  /** Try to infer it from the current URL when not explicitly provided. */
  organizationSlug?: string
}): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    makeStorageKey({
      appSlug,
      organizationSlug:
        organizationSlug ?? getOrgSlugFromCurrentUrl() ?? 'commercelayer'
    }),
    accessToken
  )
}
