import { computeFullname, formatDisplayName } from '#helpers/name'
import {
  type TokenProviderAllowedApp,
  type TokenProviderTokenApplicationKind
} from '#providers/TokenProvider'
import { getCoreApiBaseEndpoint } from '@commercelayer/js-auth'
import { type ListableResourceType } from '@commercelayer/sdk'
import fetch from 'cross-fetch'
import isEmpty from 'lodash/isEmpty'
import { getInfoFromJwt, type ParsedScopes } from './getInfoFromJwt'
import {
  type Mode,
  type TokenProviderAuthUser,
  type TokenProviderPermissionItem,
  type TokenProviderRolePermissions,
  type TokenProviderTokenInfo
} from './types'

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
  scopes?: ParsedScopes
}
interface InvalidToken {
  isValidToken: false
}

export async function isValidTokenForCurrentApp({
  accessToken,
  kind,
  isProduction,
  currentMode,
  organizationSlug
}: {
  accessToken: string
  kind: TokenProviderTokenApplicationKind
  isProduction: boolean
  currentMode: Mode
  /**
   * only required when app is self-hosted, to check if the token is valid for the current organization.
   * When app is hosted by Commerce Layer, the organization slug is retrieved from the url subdomain.
   */
  organizationSlug?: string
}): Promise<ValidToken | InvalidToken> {
  const jwtInfo = getInfoFromJwt(accessToken)

  if (jwtInfo.orgSlug == null) {
    return {
      isValidToken: false
    }
  }

  // this means we are trying to use a token for a different mode (live|test) the app is running on
  if (jwtInfo.mode !== currentMode) {
    return {
      isValidToken: false
    }
  }

  try {
    const tokenInfo = await fetchTokenInfo({
      accessToken,
      orgSlug: jwtInfo.orgSlug
    })

    const isValidOnCore = Boolean(tokenInfo?.token)
    const isValidKind = jwtInfo.appKind === kind
    const isValidOrganizationSlug = isEmpty(organizationSlug)
      ? true // skip validation if organizationSlug is not provided
      : jwtInfo.orgSlug === organizationSlug

    const isAllValid = isValidKind && isValidOrganizationSlug && isValidOnCore

    // running validation only in production
    if (isProduction && !isAllValid) {
      console.error(
        'Invalid token. Please check if token is valid and if you have properly set your organization slug.',
        {
          tokenInfo,
          isValidKind,
          isValidOrganizationSlug,
          isValidOnCore
        }
      )
      return {
        isValidToken: false
      }
    }

    return {
      isValidToken: true,
      accessToken,
      mode: tokenInfo?.token.test === true ? 'test' : 'live',
      organizationSlug: jwtInfo.orgSlug,
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
          : null,
      scopes: jwtInfo.scopes
    }
  } catch {
    return {
      isValidToken: false
    }
  }
}

async function fetchTokenInfo({
  accessToken,
  orgSlug
}: {
  accessToken: string
  orgSlug: string
}): Promise<TokenProviderTokenInfo | null> {
  try {
    const coreApiBaseEndpoint = getCoreApiBaseEndpoint(accessToken)
    const tokenInfoResponse = await fetch(
      `${coreApiBaseEndpoint}/oauth/tokeninfo`,
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
