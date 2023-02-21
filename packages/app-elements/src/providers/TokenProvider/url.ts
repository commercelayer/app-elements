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

export function makeReAuthenticationUrl(
  dashboardUrl: string,
  appName: string
): string | undefined {
  if (appName == null || appName === '') {
    return undefined
  }
  try {
    const baseUrl = new URL(dashboardUrl).toString() // will parse and remove trailing slash
    const currentAppUrl = `${window.location.origin}${window.location.pathname}`
    const authUrl = `${baseUrl}/hub/${appName}/authenticate?redirect_to=${currentAppUrl}`
    return new URL(authUrl).toString()
  } catch {
    return undefined
  }
}
