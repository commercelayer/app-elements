import { CommerceLayerClient } from '@commercelayer/sdk'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { makeSdkClient } from './makeSdkClient'
import { useTokenProvider } from '../TokenProvider'

interface SdkProviderValue {
  /**
   * Signed SDK client
   */
  sdkClient?: CommerceLayerClient
}

interface SdkProviderProps {
  /**
   * Entire app content
   */
  children: ((props: SdkProviderValue) => ReactNode) | ReactNode
}

const Context = createContext<SdkProviderValue>({})

export const useSdkProvider = (): SdkProviderValue => {
  return useContext(Context)
}

function SdkProvider({ children }: SdkProviderProps): JSX.Element | null {
  const {
    emitInvalidAuth,
    settings: { accessToken, domain, organizationSlug }
  } = useTokenProvider()

  const [sdkClient, setSdkClient] = useState<CommerceLayerClient>()

  useEffect(
    function signSdk() {
      if (accessToken == null || organizationSlug == null) {
        return
      }
      setSdkClient(
        makeSdkClient({
          accessToken,
          organization: organizationSlug,
          domain,
          onInvalidToken: () =>
            emitInvalidAuth('got 401 invalid token from sdk')
        })
      )
    },
    [accessToken, organizationSlug]
  )

  const value: SdkProviderValue = {
    sdkClient
  }

  return (
    <Context.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </Context.Provider>
  )
}

export default SdkProvider
