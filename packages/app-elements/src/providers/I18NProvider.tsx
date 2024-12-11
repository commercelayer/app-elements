import { type I18NLocale, initI18n, languages } from '#helpers/i18n'
import { type i18n as I18nInstance } from 'i18next'
import React, { type ReactNode, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'

export { useTranslation } from 'react-i18next'

interface I18NProviderProps {
  localeCode?: I18NLocale
  baseUrl?: string
  children: ReactNode
}

export const I18NProvider: React.FC<I18NProviderProps> = ({
  localeCode = languages[0],
  baseUrl,
  children
}) => {
  const [i18nInstance, setI18nInstance] = useState<I18nInstance | undefined>()

  useEffect(() => {
    const setupI18n = async (): Promise<void> => {
      try {
        const instance = await initI18n(localeCode, baseUrl)
        if (instance.isInitialized) {
          setI18nInstance(instance)
        }
      } catch (error) {
        console.error('Error initializing i18n:', error)
      }
    }

    if (
      i18nInstance == null ||
      (i18nInstance != null && !i18nInstance.isInitialized)
    ) {
      void setupI18n()
    }
  }, [localeCode, baseUrl, i18nInstance])

  if (
    i18nInstance == null ||
    (i18nInstance != null && !i18nInstance.isInitialized)
  ) {
    return <div>Loading i18n</div>
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}
