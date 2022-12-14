import { CommerceLayerClient } from '@commercelayer/sdk'
import {
  createContext,
  ReactNode,
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

interface TokenProviderValue {
  dashboardUrl?: string
  sdkClient?: CommerceLayerClient
}

export type CurrentApp = 'imports' | 'exports' | 'webhooks'

interface TokenProviderProps {
  clientKind: 'integration' | 'sales_channel' | 'webapp'
  currentApp: CurrentApp
  domain: string
  onInvalidAuth: (info: { dashboardUrl: string; reason: string }) => void
  loadingElement?: ReactNode
  errorElement?: ReactNode
  devMode: boolean
  children: ((props: TokenProviderValue) => ReactNode) | ReactNode
}

export const AuthContext = createContext<TokenProviderValue>({
  dashboardUrl: makeDashboardUrl()
})

export const useTokenProvider = (): TokenProviderValue => {
  const ctx = useContext(AuthContext)
  return {
    dashboardUrl: ctx.dashboardUrl,
    sdkClient: ctx.sdkClient
  }
}

function TokenProvider({
  currentApp,
  clientKind,
  domain,
  onInvalidAuth,
  loadingElement,
  errorElement,
  devMode,
  children
}: TokenProviderProps): JSX.Element {
  const [validAuthToken, setValidAuthToken] = useState<string>()
  const [sdkClient, setSdkClient] = useState<CommerceLayerClient>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isTokenError, setIsTokenError] = useState<boolean>(false)
  const dashboardUrl = makeDashboardUrl()
  const accessToken =
    getAccessTokenFromUrl() ?? getPersistentAccessToken({ currentApp })

  const handleOnInvalidCallback = (reason: string): void => {
    setIsLoading(false)
    setIsTokenError(true)
    onInvalidAuth({ dashboardUrl, reason })
  }

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

      const isTokenValid = await isValidTokenForCurrentApp({
        accessToken,
        clientKind,
        currentApp,
        domain,
        isProduction: !devMode
      })

      if (isTokenValid) {
        savePersistentAccessToken({ currentApp, accessToken })
        setValidAuthToken(accessToken)
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
            handleOnInvalidCallback('catched 401 invalid token from sdk')
        })
      )
      setIsLoading(false)
    }
  }, [validAuthToken])

  const value: TokenProviderValue = {
    dashboardUrl: makeDashboardUrl(),
    sdkClient
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
