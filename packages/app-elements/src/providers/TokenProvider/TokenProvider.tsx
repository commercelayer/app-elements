import { type TokenProviderTokenApplicationKind } from '#providers/TokenProvider'
import { PageError } from '#ui/composite/PageError'
import { type Organization } from '@commercelayer/sdk'
import { type ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type ReactNode
} from 'react'
import {
  getAccessTokenFromUrl,
  getCurrentMode,
  removeAuthParamsFromUrl
} from './getAccessTokenFromUrl'
import { getInfoFromJwt } from './getInfoFromJwt'
import { getOrganization } from './getOrganization'
import { initialTokenProviderState, reducer } from './reducer'
import { getPersistentAccessToken, savePersistentAccessToken } from './storage'
import {
  type TokenProviderAllowedApp,
  type TokenProviderAuthSettings,
  type TokenProviderAuthUser,
  type TokenProviderRoleActions
} from './types'
import { makeDashboardUrl, makeReAuthenticationUrl } from './url'
import { isTokenExpired, isValidTokenForCurrentApp } from './validateToken'

export interface TokenProviderValue {
  dashboardUrl?: string
  settings: TokenProviderAuthSettings
  user: TokenProviderAuthUser | null
  organization: Organization | null
  canUser: (
    action: TokenProviderRoleActions,
    resource: ListableResourceType
  ) => boolean
  canAccess: (appSlug: TokenProviderAllowedApp) => boolean
  emitInvalidAuth: (reason: string) => void
}

export interface TokenProviderProps {
  /**
   * Token kind (will be validated)
   * Eg. `integration` or `webapp` but also `imports` or `orders` in case of dashboard-generated token
   */
  kind: TokenProviderTokenApplicationKind
  /**
   * Slug of the current app. It needs to match one of the allowed app slugs enabled in the dashboard.
   * Example: `orders`, `imports`, `exports`, `shipments`, `webhooks`, `returns`
   * Will be used to persist token for current app only.
   */
  appSlug: TokenProviderAllowedApp
  /**
   * Required when application is forked or running as self-hosted.
   * It's used to perform a security check to test the validity of token against current organization.
   */
  organizationSlug?: string
  /**
   * Base domain to be used for Commerce Layer API requests (eg. `commercelayer.io`)
   */
  domain?: string
  /**
   * Automatically redirect to dashboard to start re-authentication flow and return to app with fresh token
   */
  reauthenticateOnInvalidAuth?: boolean
  /**
   * Callback invoked when token is not valid.
   * Can be used to manually handle re-authentication flow when `reauthenticateOnInvalidAuth` is false.
   */
  onInvalidAuth?: (info: { dashboardUrl: string; reason: string }) => void
  /**
   * UI element to be used as loader (eg: skeleton or spinner icon)
   */
  loadingElement?: ReactNode
  /**
   * Element to display in case of invalid token
   */
  errorElement?: ReactNode
  /**
   * skip domain slug validation when is dev mode
   */
  devMode: boolean
  /**
   * Optional. In case you already have an access token, this will skip the retrieval of token from URL or localStorage.
   * When undefined (default scenario), token is expected to be retrieved from `?accessToken=xxxx` query string or localStorage (in this order).
   */
  accessToken?: string
  /**
   * Entire app content
   */
  children: ((props: TokenProviderValue) => ReactNode) | ReactNode
}

export const AuthContext = createContext<TokenProviderValue>({
  dashboardUrl: makeDashboardUrl({
    domain: initialTokenProviderState.settings.domain,
    mode: initialTokenProviderState.settings.mode
  }),
  canUser: () => false,
  canAccess: () => false,
  emitInvalidAuth: () => undefined,
  settings: initialTokenProviderState.settings,
  user: null,
  organization: null
})

export const useTokenProvider = (): TokenProviderValue => {
  return useContext(AuthContext)
}

export const TokenProvider: React.FC<TokenProviderProps> = ({
  appSlug,
  organizationSlug,
  kind,
  domain = 'commercelayer.io',
  onInvalidAuth,
  reauthenticateOnInvalidAuth,
  loadingElement,
  errorElement,
  devMode,
  children,
  accessToken: accessTokenFromProp
}) => {
  const [_state, dispatch] = useReducer(reducer, initialTokenProviderState)
  const isSelfHosted = organizationSlug != null

  const accessToken =
    accessTokenFromProp ??
    getAccessTokenFromUrl() ??
    getPersistentAccessToken({ appSlug })

  const dashboardUrl = makeDashboardUrl({
    domain,
    mode: getCurrentMode({ accessToken }),
    organizationSlug
  })

  const emitInvalidAuth = useCallback(function (reason: string): void {
    dispatch({ type: 'invalidAuth' })
    if (onInvalidAuth != null) {
      onInvalidAuth({ dashboardUrl, reason })
    }
    if (reauthenticateOnInvalidAuth === true) {
      // trying to build the re-authentication URL with app ID when is self-hosted/forked
      // this only works when we already have a token to read the app ID from otherwise `makeReAuthenticationUrl` will return the original dashboard URL.
      // For non-forked apps we can use the appSlug
      const { appId } = getInfoFromJwt(accessToken ?? '')
      const appIdentifier = isSelfHosted ? appId : appSlug
      window.location.href = makeReAuthenticationUrl(
        dashboardUrl,
        appIdentifier
      )
    }
  }, [])

  const canUser = useCallback(
    function (
      action: TokenProviderRoleActions,
      resource: ListableResourceType | 'organizations'
    ): boolean {
      return Boolean(_state.rolePermissions?.[resource]?.[action])
    },
    [_state.rolePermissions]
  )

  const canAccess = useCallback(
    function (appSlug: TokenProviderAllowedApp): boolean {
      return _state.accessibleApps.includes(appSlug)
    },
    [_state.accessibleApps]
  )

  useEffect(
    function validateAndSetToken() {
      void (async (): Promise<void> => {
        if (accessToken == null) {
          emitInvalidAuth('accessToken is missing')
          return
        }

        if (
          isTokenExpired({
            accessToken,
            compareTo: new Date()
          })
        ) {
          emitInvalidAuth('accessToken is expired')
          return
        }

        const tokenInfo = await isValidTokenForCurrentApp({
          accessToken,
          kind,
          domain,
          isProduction: !devMode,
          currentMode: getCurrentMode({ accessToken }),
          organizationSlug
        })

        if (!tokenInfo.isValidToken) {
          emitInvalidAuth('accessToken is not valid')
          return
        }

        // fetching organization details if user has read permission
        const organization =
          tokenInfo.permissions?.organizations?.read === true
            ? await getOrganization({
                accessToken,
                domain,
                organizationSlug: tokenInfo.organizationSlug
              })
            : null

        // all good
        savePersistentAccessToken({ appSlug, accessToken })
        removeAuthParamsFromUrl()

        dispatch({
          type: 'validToken',
          payload: {
            settings: {
              accessToken: tokenInfo.accessToken,
              organizationSlug: tokenInfo.organizationSlug,
              appSlug,
              mode: tokenInfo.mode,
              domain
            },
            user: tokenInfo.user,
            organization,
            rolePermissions: tokenInfo.permissions ?? {},
            accessibleApps: tokenInfo.accessibleApps ?? []
          }
        })
      })()
    },
    [accessToken]
  )

  const value: TokenProviderValue = {
    dashboardUrl,
    settings: _state.settings,
    user: _state.user,
    organization: _state.organization,
    canUser,
    canAccess,
    emitInvalidAuth
  }

  if (_state.isTokenError) {
    return reauthenticateOnInvalidAuth === true ? (
      // while browser is redirecting back and forth, we don't want to show `<PageError>` component
      <div />
    ) : (
      <>
        {errorElement ?? (
          <PageError
            pageTitle='Commerce Layer'
            errorName='Invalid token'
            errorDescription='The provided authorization token is not valid'
          />
        )}
      </>
    )
  }

  if (_state.isLoading) {
    return <>{loadingElement}</>
  }

  return (
    <AuthContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </AuthContext.Provider>
  )
}

TokenProvider.displayName = 'TokenProvider'
