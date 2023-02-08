import { Mode } from './types'

export function getOrgSlugFromCurrentUrl(): string {
  return window.location.hostname.split('.')[0]
}

export function makeDashboardUrl({
  domain = 'commercelayer.io',
  mode = 'live'
}: {
  domain?: string
  mode?: Mode
}): string {
  return `https://dashboard.${domain}/${mode}/${getOrgSlugFromCurrentUrl()}`
}
