import { getCurrentMode } from './getAccessTokenFromUrl'
import { getInfoFromJwt } from './getInfoFromJwt'

export function makeDashboardUrl({
  domain = 'commercelayer.io',
  accessToken
}: {
  domain?: string
  accessToken?: string | null
}): string {
  if (accessToken == null) {
    // we don't have an access token, so dashboard URL is just the base URL
    return `https://dashboard.${domain}/`
  }

  const mode = getCurrentMode({ accessToken })
  const orgSlug = getInfoFromJwt(accessToken)?.orgSlug

  return `https://dashboard.${domain}/${mode}/${orgSlug}`
}

export function extractDomainFromApiBaseEndpoint(
  apiBaseEndpoint?: string | null
): string {
  if (apiBaseEndpoint == null) {
    return 'commercelayer.io'
  }
  return apiBaseEndpoint.replace('https://', '').split('.').slice(1).join('.')
}
