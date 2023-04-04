import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer
} from 'react'

import { isTokenExpired, isValidTokenForCurrentApp } from './validateToken'
import { makeDashboardUrl, makeReAuthenticationUrl } from './url'
import { getPersistentAccessToken, savePersistentAccessToken } from './storage'
import { getAccessTokenFromUrl } from './getAccessTokenFromUrl'
import { PageError } from '#ui/composite/PageError'
import {
  type TokenProviderAllowedApp,
  type TokenProviderRoleActions,
  type TokenProviderResourceType,
  type TokenProviderAuthSettings
} from './types'
import { initialTokenProviderState, reducer } from './reducer'

interface TokenProviderValue {
  dashboardUrl?: string
  settings: TokenProviderAuthSettings
  canUser: (
    action: TokenProviderRoleActions,
    resource: TokenProviderResourceType
  ) => boolean
  emitInvalidAuth: (reason: string) => void
}

export interface TokenProviderProps {
  /**
   * Token kind (will be validated)
   */
  clientKind: 'integration' | 'sales_channel' | 'webapp'
  /**
   * Slug of the current app (will be validated). Can be one of imports, exports, webhooks, resources, orders or custom
   */
  currentApp: TokenProviderAllowedApp
  /**
   * Base domain to be used for Commerce Layer API requests (eg. `commercelayer.io`)
   */
  domain?: string
  /**
   * Callback invoked when token is not valid
   */
  onInvalidAuth?: (info: { dashboardUrl: string; reason: string }) => void
  /**
   * Automatically redirect to dashboard to start re-authentication flow and return to app with fresh token
   */
  reauthenticateOnInvalidAuth?: boolean
  /**
   * Element to be used as loader (eg: skeleton or spinner icon)
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
  emitInvalidAuth: () => undefined,
  settings: initialTokenProviderState.settings
})

export const useTokenProvider = (): TokenProviderValue => {
  return useContext(AuthContext)
}

function TokenProvider({
  currentApp,
  clientKind,
  domain = 'commercelayer.io',
  onInvalidAuth,
  reauthenticateOnInvalidAuth,
  loadingElement,
  errorElement,
  devMode,
  children,
  accessToken: accessTokenFromProp
}: TokenProviderProps): JSX.Element {
  const [_state, dispatch] = useReducer(reducer, initialTokenProviderState)
  const dashboardUrl = makeDashboardUrl({
    domain,
    mode: _state.settings.mode
  })
  const accessToken =
    accessTokenFromProp ??
    getAccessTokenFromUrl() ??
    getPersistentAccessToken({ currentApp })

  const emitInvalidAuth = useCallback(function (reason: string): void {
    dispatch({ type: 'invalidAuth' })
    if (onInvalidAuth != null) {
      onInvalidAuth({ dashboardUrl, reason })
    }
    if (reauthenticateOnInvalidAuth === true) {
      window.location.href =
        makeReAuthenticationUrl(dashboardUrl, currentApp) ?? dashboardUrl
    }
  }, [])

  const canUser = useCallback(
    function (
      action: TokenProviderRoleActions,
      resource: TokenProviderResourceType
    ): boolean {
      return Boolean(_state.rolePermissions?.[resource]?.[action])
    },
    [_state.rolePermissions]
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
          clientKind,
          currentApp,
          domain,
          isProduction: !devMode
        })

        if (!tokenInfo.isValidToken) {
          emitInvalidAuth('accessToken is not valid')
          return
        }

        // all good
        savePersistentAccessToken({ currentApp, accessToken })
        dispatch({
          type: 'validToken',
          payload: {
            settings: {
              accessToken: tokenInfo.accessToken,
              organizationSlug: tokenInfo.organizationSlug,
              mode: tokenInfo.mode,
              domain,
              timezone: tokenInfo.timezone
            },
            rolePermissions: tokenInfo.permissions ?? {}
          }
        })
      })()
    },
    [accessToken]
  )

  const value: TokenProviderValue = {
    dashboardUrl,
    settings: _state.settings,
    canUser,
    emitInvalidAuth
  }

  if (_state.isTokenError) {
    return reauthenticateOnInvalidAuth === true ? (
      // while browser is redirecting back and forth, we don't want to show `<PageError>` component
      <div />
    ) : (
      <>
        {errorElement == null ? (
          <PageError
            pageTitle='Commerce Layer'
            errorName='Invalid token'
            errorDescription='The provided authorization token is not valid'
          />
        ) : (
          errorElement
        )}
      </>
    )
  }

  if (_state.isLoading) {
    return (
      <>{loadingElement == null ? <div>Loading...</div> : loadingElement}</>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </AuthContext.Provider>
  )
}

TokenProvider.displayName = 'TokenProvider'
export { TokenProvider }
