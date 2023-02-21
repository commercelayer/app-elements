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

interface CoreSdkProviderValue {
  /**
   * Valid SDK client
   */
  sdkClient?: CommerceLayerClient
}

interface CoreSdkProviderProps {
  /**
   * Entire app content
   */
  children: ((props: CoreSdkProviderValue) => ReactNode) | ReactNode
}

const Context = createContext<CoreSdkProviderValue>({})

export const useCoreSdkProvider = (): CoreSdkProviderValue => {
  return useContext(Context)
}

function CoreSdkProvider({
  children
}: CoreSdkProviderProps): JSX.Element | null {
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

  const value: CoreSdkProviderValue = {
    sdkClient
  }

  return (
    <Context.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </Context.Provider>
  )
}

CoreSdkProvider.displayName = 'CoreSdkProvider'

export { CoreSdkProvider }
