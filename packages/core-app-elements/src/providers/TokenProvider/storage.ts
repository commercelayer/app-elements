import { AllowedApp } from 'TokenProvider'
import { getOrgSlugFromCurrentUrl } from './slug'

type PersistentItem = 'accessToken'

export function makeStorageKey({
  currentApp,
  item
}: {
  currentApp: AllowedApp
  item: PersistentItem
}): string {
  return `${currentApp}:${getOrgSlugFromCurrentUrl()}:${item}`
}

export function getPersistentAccessToken({
  currentApp
}: {
  currentApp: AllowedApp
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
  currentApp: AllowedApp
  accessToken: string
}): void {
  window.localStorage.setItem(
    makeStorageKey({ currentApp, item: 'accessToken' }),
    accessToken
  )
}
