import { type TokenProviderAllowedApp } from './types'
import { getOrgSlugFromCurrentUrl } from './url'

type PersistentItem = 'accessToken'

export function makeStorageKey({
  appSlug,
  item
}: {
  appSlug: TokenProviderAllowedApp
  item: PersistentItem
}): string {
  return `${appSlug}:${getOrgSlugFromCurrentUrl()}:${item}`
}

export function getPersistentAccessToken({
  appSlug
}: {
  appSlug: TokenProviderAllowedApp
}): string | null {
  const storedAccessToken = window.localStorage.getItem(
    makeStorageKey({ appSlug, item: 'accessToken' })
  )
  return storedAccessToken
}

export function savePersistentAccessToken({
  appSlug,
  accessToken
}: {
  appSlug: TokenProviderAllowedApp
  accessToken: string
}): void {
  window.localStorage.setItem(
    makeStorageKey({ appSlug, item: 'accessToken' }),
    accessToken
  )
}
