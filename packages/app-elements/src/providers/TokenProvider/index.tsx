import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type ReactNode
} from 'react'

import { type TokenProviderTokenApplicationKind } from '#providers/TokenProvider/types'
import { PageError } from '#ui/composite/PageError'
import { type ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import { getAccessTokenFromUrl } from './getAccessTokenFromUrl'
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

interface TokenProviderValue {
  dashboardUrl?: string
  settings: TokenProviderAuthSettings
  user: TokenProviderAuthUser | null
  canUser: (
    action: TokenProviderRoleActions,
    resource: ListableResourceType
  ) => boolean
  emitInvalidAuth: (reason: string) => void
}

export interface TokenProviderProps {
  /**
   * Token kind (will be validated)
   * Eg. `integration` or `webapp` but also `imports` or `orders` in case of dashboard-generated token
   */
  kind: TokenProviderTokenApplicationKind
  /**
   * Slug of the current app. Can be one of imports, exports, webhooks, resources, orders or custom.
   * Will be used to persist token for current app only.
   */
  appSlug: TokenProviderAllowedApp
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
  settings: initialTokenProviderState.settings,
  user: null
})

export const useTokenProvider = (): TokenProviderValue => {
  return useContext(AuthContext)
}

function MockTokenProvider({ children }: TokenProviderProps): JSX.Element {
  const value: TokenProviderValue = {
    dashboardUrl: '',
    settings: {
      accessToken: '1234',
      domain: 'localhost',
      mode: 'test',
      organizationSlug: 'mock'
    },
    user: {
      displayName: 'J. Doe',
      email: 'john.doe@commercelayer.io',
      firstName: 'John',
      fullName: 'John Doe',
      id: '1234',
      lastName: 'Doe',
      timezone: 'Europe/Rome'
    },
    canUser: () => true,
    emitInvalidAuth: () => {}
  }

  return (
    <AuthContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </AuthContext.Provider>
  )
}

function TokenProvider({
  appSlug,
  kind,
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
    getPersistentAccessToken({ appSlug })

  const emitInvalidAuth = useCallback(function (reason: string): void {
    dispatch({ type: 'invalidAuth' })
    if (onInvalidAuth != null) {
      onInvalidAuth({ dashboardUrl, reason })
    }
    if (reauthenticateOnInvalidAuth === true) {
      window.location.href =
        makeReAuthenticationUrl(dashboardUrl, appSlug) ?? dashboardUrl
    }
  }, [])

  const canUser = useCallback(
    function (
      action: TokenProviderRoleActions,
      resource: ListableResourceType
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
          kind,
          domain,
          isProduction: !devMode
        })

        if (!tokenInfo.isValidToken) {
          emitInvalidAuth('accessToken is not valid')
          return
        }

        // all good
        savePersistentAccessToken({ appSlug, accessToken })
        dispatch({
          type: 'validToken',
          payload: {
            settings: {
              accessToken: tokenInfo.accessToken,
              organizationSlug: tokenInfo.organizationSlug,
              mode: tokenInfo.mode,
              domain
            },
            user: tokenInfo.user,
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
    user: _state.user,
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
MockTokenProvider.displayName = 'TokenProvider'
export { MockTokenProvider, TokenProvider }
