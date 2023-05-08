import {
  type TokenProviderTokenInfo,
  type TokenProviderRolePermissions,
  type TokenProviderPermissionItem,
  type TokenProviderResourceType,
  type Mode,
  type TokenProviderAuthUser
} from './types'
import { getInfoFromJwt } from './getInfoFromJwt'
import { getOrgSlugFromCurrentUrl } from './url'
import fetch from 'cross-fetch'
import { computeFullname, formatDisplayName } from '#helpers/name'

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

interface ValidToken {
  isValidToken: true
  accessToken: string
  mode: Mode
  organizationSlug: string
  permissions?: TokenProviderRolePermissions
  user: TokenProviderAuthUser | null
}
interface InvalidToken {
  isValidToken: false
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
}): Promise<ValidToken | InvalidToken> {
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
    const isValidPermission = Boolean(tokenInfo?.token)

    const isAllValid = isValidKind && isValidSlug && isValidPermission
    if (!isAllValid) {
      return {
        isValidToken: false
      }
    }

    return {
      isValidToken: true,
      accessToken,
      mode: tokenInfo?.token.test === true ? 'test' : 'live',
      organizationSlug: slug,
      permissions:
        tokenInfo?.permissions != null
          ? preparePermissions(tokenInfo.permissions)
          : undefined,
      user:
        tokenInfo?.owner != null && tokenInfo.owner.type === 'User'
          ? {
              id: tokenInfo.owner.id,
              email: tokenInfo.owner.email,
              firstName: tokenInfo.owner.first_name,
              lastName: tokenInfo.owner.last_name,
              timezone: tokenInfo.owner.time_zone,
              displayName: formatDisplayName(
                tokenInfo.owner.first_name,
                tokenInfo.owner.last_name
              ),
              fullName: computeFullname(
                tokenInfo.owner.first_name,
                tokenInfo.owner.last_name
              )
            }
          : null
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
}): Promise<TokenProviderTokenInfo | null> {
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
  apiPermissions: TokenProviderTokenInfo['permissions']
): TokenProviderRolePermissions {
  const resourceList = Object.keys(
    apiPermissions
  ) as TokenProviderResourceType[]

  return resourceList.reduce<TokenProviderRolePermissions>(
    (permissions, resource) => {
      const permissionItem: TokenProviderPermissionItem = {
        create: apiPermissions[resource].actions.includes('create'),
        destroy: apiPermissions[resource].actions.includes('destroy'),
        read: apiPermissions[resource].actions.includes('read'),
        update: apiPermissions[resource].actions.includes('update')
      }
      return {
        ...permissions,
        [resource]: permissionItem
      }
    },
    {}
  )
}
