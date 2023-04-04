import { type TokenProviderAllowedApp } from './types'
import { getOrgSlugFromCurrentUrl } from './url'

type PersistentItem = 'accessToken'

export function makeStorageKey({
  currentApp,
  item
}: {
  currentApp: TokenProviderAllowedApp
  item: PersistentItem
}): string {
  return `${currentApp}:${getOrgSlugFromCurrentUrl()}:${item}`
}

export function getPersistentAccessToken({
  currentApp
}: {
  currentApp: TokenProviderAllowedApp
}): string | null {
  const storedAccessToken = window.localStorage.getItem(
    makeStorageKey({ currentApp, item: 'accessToken' })
  )
  return storedAccessToken
}

export function savePersistentAccessToken({
  currentApp,
  accessToken
}: {
  currentApp: TokenProviderAllowedApp
  accessToken: string
}): void {
  window.localStorage.setItem(
    makeStorageKey({ currentApp, item: 'accessToken' }),
    accessToken
  )
}
