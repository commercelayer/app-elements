import { TokenInfo, RolePermissions, PermissionItem } from 'TokenProvider'
import { getInfoFromJwt } from './getInfoFromJwt'
import { getOrgSlugFromCurrentUrl } from './slug'
import { ResourceTypeLock } from '@commercelayer/sdk/lib/cjs/api'

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
}): Promise<{
  isValidToken: boolean
  permissions?: RolePermissions
}> {
  const { slug, kind } = getInfoFromJwt(accessToken)
  const isValidKind = kind === clientKind
  const isValidSlug = isProduction ? slug === getOrgSlugFromCurrentUrl() : true

  if (slug == null) {
    return {
      isValidToken: false
    }
  }

  try {
    const tokenInfo = await fetchTokenInfo({ accessToken, slug, domain })
    // TODO: implement async verification against tokeninfo endpoint only if `currentApp` is not `custom`
    console.log({ currentApp })
    const isValidPermission = Boolean(tokenInfo?.token)

    return {
      isValidToken: isValidKind && isValidSlug && isValidPermission,
      permissions:
        tokenInfo?.permissions != null
          ? preparePermissions(tokenInfo.permissions)
          : undefined
    }
  } catch {
    return {
      isValidToken: false
    }
  }
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

function preparePermissions(
  apiPermissions: TokenInfo['permissions']
): RolePermissions {
  const resourceList = Object.keys(apiPermissions) as ResourceTypeLock[]

  return resourceList.reduce<RolePermissions>((permissions, resource) => {
    const permissionItem: PermissionItem = {
      create: apiPermissions[resource].actions.includes('create'),
      destroy: apiPermissions[resource].actions.includes('destroy'),
      read: apiPermissions[resource].actions.includes('read'),
      update: apiPermissions[resource].actions.includes('update')
    }
    return {
      ...permissions,
      [resource]: permissionItem
    }
  }, {})
}
