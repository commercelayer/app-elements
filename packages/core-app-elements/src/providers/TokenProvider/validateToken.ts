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
  currentApp,
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
    const tokenInfo = await fetchTokenInfo({ accessToken, slug, domain })
    // TODO: implement async verification against tokeninfo endpoint only if `currentApp` is not `custom`
    console.log({ currentApp })
    const isValidPermission = Boolean(tokenInfo?.token)
    return isValidKind && isValidSlug && isValidPermission
  } catch {
    return false
  }
}

interface TokenInfo {
  token: {
    test: boolean
    market_ids: string[]
    stock_location_ids: string[]
    lifespan: number
  }
  role: { id: string; kind: string; name: string }
  application: {
    id: string
    kind: 'integration' | 'sales_channel' | 'webapp'
    name: string
    core: boolean
  }
  permissions: Record<string, { actions: string[] }>
}

async function fetchTokenInfo({
  accessToken,
  slug,
  domain
}: {
  accessToken: string
  slug: string
  domain: string
}): Promise<TokenInfo | null> {
  try {
    const tokenInfoResponse = await fetch(
      `https://${slug}.${domain}/oauth/tokeninfo`,
      {
        method: 'GET',
        headers: { authorization: `Bearer ${accessToken}` }
      }
    )
    return await tokenInfoResponse.json()
  } catch {
    return null
  }
}
