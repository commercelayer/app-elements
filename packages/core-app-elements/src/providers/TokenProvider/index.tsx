import { CommerceLayerClient } from '@commercelayer/sdk'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

import { getInfoFromJwt } from './getInfoFromJwt'
import { isTokenExpired, isValidTokenForCurrentApp } from './validateToken'
import { makeDashboardUrl } from './slug'
import { getPersistentAccessToken, savePersistentAccessToken } from './storage'
import { getAccessTokenFromUrl } from './getAccessTokenFromUrl'
import { makeSdkClient } from './makeSdkClient'
import { PageError } from '#ui/composite/PageError'
import {
  TokenProviderAllowedApp,
  TokenProviderRolePermissions,
  TokenProviderRoleActions,
  TokenProviderResourceType
} from './types'

interface TokenProviderValue {
  dashboardUrl?: string
  sdkClient?: CommerceLayerClient
  mode: 'live' | 'test'
  canUser: (
    action: TokenProviderRoleActions,
    resource: TokenProviderResourceType
  ) => boolean
}

interface TokenProviderProps {
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
  domain: string
  /**
   * Callback invoked when token is not valid
   */
  onInvalidAuth: (info: { dashboardUrl: string; reason: string }) => void
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
  dashboardUrl: makeDashboardUrl(),
  canUser: () => false,
  mode: 'test'
})

export const useTokenProvider = (): TokenProviderValue => {
  return useContext(AuthContext)
}

function TokenProvider({
  currentApp,
  clientKind,
  domain,
  onInvalidAuth,
  loadingElement,
  errorElement,
  devMode,
  children,
  accessToken: accessTokenFromProp
}: TokenProviderProps): JSX.Element {
  const [validAuthToken, setValidAuthToken] = useState<string>()
  const [sdkClient, setSdkClient] = useState<CommerceLayerClient>()
  const [rolePermissions, setRolePermissions] =
    useState<TokenProviderRolePermissions>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isTokenError, setIsTokenError] = useState<boolean>(false)
  const [mode, setMode] = useState<'live' | 'test'>('test')
  const dashboardUrl = makeDashboardUrl()
  const accessToken =
    accessTokenFromProp ??
    getAccessTokenFromUrl() ??
    getPersistentAccessToken({ currentApp })

  const handleOnInvalidCallback = (reason: string): void => {
    setIsLoading(false)
    setIsTokenError(true)
    onInvalidAuth({ dashboardUrl, reason })
  }

  const canUser = useCallback(
    function (
      action: TokenProviderRoleActions,
      resource: TokenProviderResourceType
    ): boolean {
      return Boolean(rolePermissions?.[resource]?.[action])
    },
    [rolePermissions]
  )

  // validate token
  useEffect(() => {
    void (async (): Promise<void> => {
      if (accessToken == null) {
        handleOnInvalidCallback('accessToken is missing')
        return
      }

      if (
        isTokenExpired({
          accessToken,
          compareTo: new Date()
        })
      ) {
        handleOnInvalidCallback('accessToken is expired')
        return
      }

      const { isValidToken, permissions, isTestMode } =
        await isValidTokenForCurrentApp({
          accessToken,
          clientKind,
          currentApp,
          domain,
          isProduction: !devMode
        })

      if (isValidToken) {
        savePersistentAccessToken({ currentApp, accessToken })
        setValidAuthToken(accessToken)
        setRolePermissions(permissions ?? {})
        setMode(isTestMode === false ? 'live' : 'test')
      } else {
        handleOnInvalidCallback('accessToken is not valid')
      }
    })()
  }, [accessToken])

  // once we have a validAuthToken set, we can sign an sdkClient to be used within the app
  useEffect(() => {
    if (validAuthToken == null) {
      return
    }
    const decodedTokenData = getInfoFromJwt(validAuthToken)
    if (decodedTokenData.slug != null) {
      setSdkClient(
        makeSdkClient({
          accessToken: validAuthToken,
          organization: decodedTokenData.slug,
          domain,
          onInvalidToken: () =>
            handleOnInvalidCallback('got 401 invalid token from sdk')
        })
      )
      setIsLoading(false)
    }
  }, [validAuthToken])

  const value: TokenProviderValue = {
    dashboardUrl: makeDashboardUrl(),
    sdkClient,
    mode,
    canUser
  }

  if (isTokenError) {
    return (
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

  if (isLoading) {
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

export default TokenProvider
