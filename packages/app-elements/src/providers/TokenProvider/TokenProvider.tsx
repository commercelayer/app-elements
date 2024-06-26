import { type TokenProviderTokenApplicationKind } from '#providers/TokenProvider'
import { isProductionHostname } from '#providers/TokenProvider/url'
import { PageError } from '#ui/composite/PageError'
import { PageSkeleton } from '#ui/composite/PageSkeleton'
import {
  type ListableResourceType,
  type Organization
} from '@commercelayer/sdk'
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
  settings: TokenProviderAuthSettings
  user: TokenProviderAuthUser | null
  organization: Organization | null
  canUser: (
    action: TokenProviderRoleActions,
    resource: ListableResourceType
  ) => boolean
  canAccess: (appSlug: Exclude<TokenProviderAllowedApp, 'dashboard'>) => boolean
  emitInvalidAuth: (reason: string) => void
}

export interface TokenProviderProps {
  /**
   * The token kind (will be validated).
   * For example: `integration`, `sales_channel` or `webapp` but also `imports` or `orders` in case of dashboard-generated token.
   */
  kind: TokenProviderTokenApplicationKind
  /**
   * The slug of the current app. It needs to match one of the allowed app slugs enabled in the dashboard.
   * It is used to persist token for current app only.
   */
  appSlug: TokenProviderAllowedApp
  /**
   * Set this to `true` to skip domain slug validation in dev mode.
   */
  devMode: boolean
  /**
   * The entire app content.
   */
  children: ((props: TokenProviderValue) => ReactNode) | ReactNode
  /**
   * Required when application is running as self-hosted.
   * It's used to perform a security check to test the validity of token against the current organization.
   */
  organizationSlug?: string
  /**
   * The base domain to be used for Commerce Layer API requests (e.g. `commercelayer.io`)
   */
  domain?: string
  /**
   * Set this to `true` to automatically redirect to the dashboard, start the re-authentication flow, and return to the app with a fresh token.
   */
  reauthenticateOnInvalidAuth?: boolean
  /**
   * The callback invoked when token is not valid.
   * Can be used to manually handle the re-authentication flow when `reauthenticateOnInvalidAuth` is false.
   */
  onInvalidAuth?: (info: { dashboardUrl: string; reason: string }) => void
  /**
   * The UI element to be used as loader (e.g. skeleton or spinner icon).
   * This element is ignored when app is running within the dashboard, since it will use the standard PageSkeleton ad not-overridable ui loader.
   */
  loadingElement?: ReactNode
  /**
   * The element to display in case of invalid token.
   */
  errorElement?: ReactNode
  /**
   * Optional. In case you already have an access token, this will skip the retrieval of token from the URL or `localStorage`.
   * When `undefined` (default scenario), the token is expected to be retrieved from the `?accessToken=xxxx` query string or localStorage (in this order).
   */
  accessToken?: string

  /**
   * Optional. Set to `true` to enable the app to be used within the dashboard.
   * In this way the UI can be adapted.
   */
  isInDashboard?: boolean
  /**
   * Optional. Define a callback to be invoked when the app is closed.
   * When this is defined, it means the app is running as micro-frontend (eg: initialized from the dashboard, that needs to handle the go back).
   * This methods will also be returned within the context as part of `TokenProviderValue` object.
   */
  onAppClose?: () => void
}

export const AuthContext = createContext<TokenProviderValue>({
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
  kind,
  appSlug,
  devMode,
  children,
  organizationSlug,
  domain = 'commercelayer.io',
  onInvalidAuth,
  reauthenticateOnInvalidAuth = false,
  loadingElement,
  errorElement,
  accessToken: accessTokenFromProp,
  onAppClose,
  isInDashboard = false
}) => {
  const [_state, dispatch] = useReducer(reducer, initialTokenProviderState)
  const isSelfHosted = organizationSlug != null

  domain = isProductionHostname() ? 'commercelayer.io' : domain

  const accessToken =
    accessTokenFromProp ??
    getAccessTokenFromUrl() ??
    getPersistentAccessToken({ appSlug, organizationSlug })

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
    if (reauthenticateOnInvalidAuth) {
      // trying to build the re-authentication URL with app ID when is self-hosted/custom
      // this only works when we already have a token to read the app ID from otherwise `makeReAuthenticationUrl` will return the original dashboard URL.
      // For non-custom apps we can use the appSlug
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

        // fetching organization details if user has read permission and app is not dashboard
        const organization =
          tokenInfo.permissions?.organizations?.read === true &&
          appSlug !== 'dashboard'
            ? await getOrganization({
                accessToken,
                domain,
                organizationSlug: tokenInfo.organizationSlug
              })
            : null

        // all good
        savePersistentAccessToken({ appSlug, accessToken, organizationSlug })
        removeAuthParamsFromUrl()

        dispatch({
          type: 'validToken',
          payload: {
            settings: {
              accessToken: tokenInfo.accessToken,
              organizationSlug: tokenInfo.organizationSlug,
              appSlug,
              mode: tokenInfo.mode,
              domain,
              dashboardUrl,
              onAppClose,
              isInDashboard
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
    settings: _state.settings,
    user: _state.user,
    organization: _state.organization,
    canUser,
    canAccess,
    emitInvalidAuth
  }

  if (_state.isTokenError) {
    return reauthenticateOnInvalidAuth ? (
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
    return <>{isInDashboard ? <PageSkeleton /> : loadingElement}</>
  }

  return (
    <AuthContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </AuthContext.Provider>
  )
}

TokenProvider.displayName = 'TokenProvider'
