import { type CommerceLayerClient } from '@commercelayer/sdk'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react'
import { type SetOptional } from 'type-fest'
import { useTokenProvider } from '../TokenProvider'
import { makeSdkClient } from './makeSdkClient'

interface CoreSdkProviderValue {
  /**
   * Valid SDK client
   */
  sdkClient: CommerceLayerClient
}

interface CoreSdkProviderProps {
  /**
   * Entire app content
   */
  children: ((props: CoreSdkProviderValue) => ReactNode) | ReactNode
}

const Context = createContext<SetOptional<CoreSdkProviderValue, 'sdkClient'>>(
  {}
)

export const useCoreSdkProvider = (): CoreSdkProviderValue => {
  // type cast is assumed safe because the provider returns children only when `sdkClient` is defined
  return useContext(Context as React.Context<CoreSdkProviderValue>)
}

export function CoreSdkProvider({
  children
}: CoreSdkProviderProps): JSX.Element | null {
  const {
    emitInvalidAuth,
    settings: { accessToken, domain, organizationSlug }
  } = useTokenProvider()

  const [sdkClient, setSdkClient] = useState<CommerceLayerClient | undefined>(
    undefined
  )

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
          onInvalidToken: () => {
            emitInvalidAuth('got 401 invalid token from sdk')
          }
        })
      )
    },
    [accessToken, organizationSlug]
  )

  if (sdkClient == null) {
    return <></>
  }

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
