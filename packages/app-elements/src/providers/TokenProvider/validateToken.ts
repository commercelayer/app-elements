import { computeFullname, formatDisplayName } from '#helpers/name'
import {
  type TokenProviderAllowedApp,
  type TokenProviderTokenApplicationKind
} from '#providers/TokenProvider'
import { type ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import fetch from 'cross-fetch'
import { getInfoFromJwt } from './getInfoFromJwt'
import {
  type Mode,
  type TokenProviderAuthUser,
  type TokenProviderPermissionItem,
  type TokenProviderRolePermissions,
  type TokenProviderTokenInfo
} from './types'
import { getOrgSlugFromCurrentUrl } from './url'

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
  accessibleApps?: TokenProviderAllowedApp[]
  user: TokenProviderAuthUser | null
}
interface InvalidToken {
  isValidToken: false
}

export async function isValidTokenForCurrentApp({
  accessToken,
  kind,
  domain,
  isProduction
}: {
  accessToken: string
  kind: TokenProviderTokenApplicationKind
  domain: string
  isProduction: boolean
}): Promise<ValidToken | InvalidToken> {
  const jwtInfo = getInfoFromJwt(accessToken)

  if (jwtInfo.slug == null) {
    return {
      isValidToken: false
    }
  }

  try {
    const tokenInfo = await fetchTokenInfo({
      accessToken,
      slug: jwtInfo.slug,
      domain
    })
    const isValidPermission = Boolean(tokenInfo?.token)
    const isValidKind = jwtInfo.kind === kind
    const isValidSlug = jwtInfo.slug === getOrgSlugFromCurrentUrl()

    const isAllValid = isValidKind && isValidSlug && isValidPermission

    // running validation only in production
    if (isProduction && !isAllValid) {
      console.error('Invalid token', {
        tokenInfo,
        isValidKind,
        isValidSlug,
        isValidPermission
      })
      return {
        isValidToken: false
      }
    }

    return {
      isValidToken: true,
      accessToken,
      mode: tokenInfo?.token.test === true ? 'test' : 'live',
      organizationSlug: jwtInfo.slug,
      permissions:
        tokenInfo?.permissions != null
          ? preparePermissions(tokenInfo.permissions)
          : undefined,
      accessibleApps:
        tokenInfo?.accessible_apps != null
          ? tokenInfo?.accessible_apps.map((app) => app.kind)
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
  const resourceList = Object.keys(apiPermissions) as ListableResourceType[]

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
