import { getInfoFromJwt } from './getInfoFromJwt'
import { getOrgSlugFromCurrentUrl } from './slug'

export function isTokenExpired({
  accessToken,
  compareTo
}: {
  accessToken: string
  compareTo: Date
}): boolean {
  const { exp } = getInfoFromJwt(accessToken)

  if (exp == null) {
    return true
  }

  const nowTime = Math.trunc(compareTo.getTime() / 1000)
  return nowTime > exp
}

export async function isValidTokenForCurrentApp({
  accessToken,
  clientKind,
  domain,
  isProduction
}: {
  accessToken: string
  clientKind: string
  currentApp: string
  domain: string
  isProduction: boolean
}): Promise<boolean> {
  const { slug, kind } = getInfoFromJwt(accessToken)
  const isValidKind = kind === clientKind
  const isValidSlug = isProduction ? slug === getOrgSlugFromCurrentUrl() : true

  if (slug == null) {
    return false
  }

  try {
    // TODO: implement async verification against tokeninfo endpoint
    const tokenInfoResponse = await fetch(
      `https://${slug}.${domain}/oauth/tokeninfo`,
      { method: 'GET', headers: { authorization: `Bearer ${accessToken}` } }
    )
    const tokenInfo = await tokenInfoResponse.json()
    console.log('tokenInfo', tokenInfo)

    return isValidKind && isValidSlug
  } catch {
    return false
  }
}
