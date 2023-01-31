import { CommerceLayerClient } from '@commercelayer/sdk'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { makeSdkClient } from './makeSdkClient'
import { PageError } from '#ui/composite/PageError'
import { useTokenProvider } from '#providers/TokenProvider'

interface SdkProviderValue {
  /**
   * Signed SDK client
   */
  sdkClient?: CommerceLayerClient
}

interface SdkProviderProps {
  /**
   * Callback invoked when token is not valid
   */
  onInvalidAuth: (info: { dashboardUrl?: string; reason: string }) => void
  /**
   * Element to be used as loader (eg: skeleton or spinner icon)
   */
  loadingElement?: ReactNode
  /**
   * Element to display in case of invalid token
   */
  errorElement?: ReactNode
  /**
   * Entire app content
   */
  children: ((props: SdkProviderValue) => ReactNode) | ReactNode
}

const Context = createContext<SdkProviderValue>({})

export const useSdkProvider = (): SdkProviderValue => {
  return useContext(Context)
}

function SdkProvider({
  onInvalidAuth,
  errorElement,
  loadingElement,
  children
}: SdkProviderProps): JSX.Element {
  const {
    dashboardUrl,
    settings: { accessToken, domain, organizationSlug }
  } = useTokenProvider()

  const [sdkClient, setSdkClient] = useState<CommerceLayerClient>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isTokenError, setIsTokenError] = useState<boolean>(false)

  const handleOnInvalidCallback = (reason: string): void => {
    setIsLoading(false)
    setIsTokenError(true)
    onInvalidAuth({ dashboardUrl, reason })
  }

  // once we have a validAuthToken set, we can sign an sdkClient to be used within the app
  useEffect(() => {
    if (accessToken == null || organizationSlug == null) {
      return
    }
    setSdkClient(
      makeSdkClient({
        accessToken,
        organization: organizationSlug,
        domain,
        onInvalidToken: () =>
          handleOnInvalidCallback('got 401 invalid token from sdk')
      })
    )
    setIsLoading(false)
  }, [accessToken, organizationSlug])

  const value: SdkProviderValue = {
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
    <Context.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </Context.Provider>
  )
}

export default SdkProvider
