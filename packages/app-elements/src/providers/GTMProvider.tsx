import isEmpty from 'lodash/isEmpty'
import { createContext, useContext, useEffect, useMemo } from 'react'
import TagManager, { type DataLayerArgs } from 'react-gtm-module'

interface GTMProviderValue {
  push: (
    data: DataLayerArgs['dataLayer'],
    customDataLayerName?: DataLayerArgs['dataLayerName']
  ) => void
}

const GTMContext = createContext<GTMProviderValue | null>(null)

/**
 * Hook that is aimed to expose the provider context containing the `tagManager` object and its methods.
 */
export const useTagManager = (): GTMProviderValue | null => {
  return useContext(GTMContext)
}

interface GTMProviderProps {
  /**
   * Entire app content
   */
  children: React.ReactNode
  /**
   * Optional Google Tag Manager id. If set the provider will take care of GTM initialization.
   */
  gtmId?: string
}

/**
 * Provider that is aimed to initialize a `TagManager` instance of `react-gtm-module` package if a valid `gtmId` prop is set.
 */
export const GTMProvider: React.FC<GTMProviderProps> = ({
  children,
  gtmId
}) => {
  useEffect(() => {
    if (isValidGtmId(gtmId)) {
      TagManager.initialize({ gtmId })
    }
  }, [gtmId])

  const push = useMemo<GTMProviderValue['push']>(
    () => (data, customDataLayerName) => {
      TagManager.dataLayer({
        dataLayer: data,
        dataLayerName: customDataLayerName
      })
    },
    []
  )

  if (gtmId == null || isEmpty(gtmId)) {
    return <>{children}</>
  }

  return <GTMContext.Provider value={{ push }}>{children}</GTMContext.Provider>
}

function isValidGtmId(gtmId?: string): gtmId is string {
  const gtmIdRegex = /^GTM-[A-Z0-9]{1,7}$/
  return gtmIdRegex.test(gtmId ?? '')
}
