import { type Mode } from './types'

export function getOrgSlugFromCurrentUrl(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  const [orgSlug] = window.location.hostname.split('.')

  if (orgSlug === undefined) {
    throw new Error('Cannot access to the organization slug.')
  }

  return orgSlug
}

export function makeDashboardUrl({
  domain = 'commercelayer.io',
  mode = 'live',
  organizationSlug
}: {
  domain?: string
  mode?: Mode
  organizationSlug?: string // only if self-hosted
}): string {
  return `https://dashboard.${domain}/${mode}/${
    organizationSlug ?? getOrgSlugFromCurrentUrl()
  }`
}

export function makeReAuthenticationUrl(
  dashboardUrl: string,
  appIdOrSlug?: string
): string {
  if (appIdOrSlug == null || appIdOrSlug === '') {
    return dashboardUrl
  }
  try {
    const baseUrl = new URL(dashboardUrl).toString() // will parse and remove trailing slash
    const currentAppUrl = `${window.location.origin}${window.location.pathname}`
    const authUrl = `${baseUrl}/hub/${appIdOrSlug}/authenticate?redirect_to=${currentAppUrl}`
    return new URL(authUrl).toString()
  } catch {
    return dashboardUrl
  }
}

export function isProductionHostname(): boolean {
  if (typeof window !== 'undefined') {
    return /^[\w-]+\.commercelayer\.app$|^dashboard\.commercelayer\.io$/.test(
      window.location.hostname
    )
  }

  return false
}
