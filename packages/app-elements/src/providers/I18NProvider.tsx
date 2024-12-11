import { type I18NLocale, initI18n, languages } from '#helpers/i18n'
import { type i18n as I18nInstance } from 'i18next'
import React, { type ReactNode, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'

interface I18NProviderProps {
  localeCode?: I18NLocale
  localeUrl?: string
  children: ReactNode
}

export const I18NProvider: React.FC<I18NProviderProps> = ({
  localeCode = languages[0],
  localeUrl,
  children
}) => {
  const [i18nInstance, setI18nInstance] = useState<I18nInstance | undefined>()

  useEffect(() => {
    const setupI18n = async (): Promise<void> => {
      try {
        const instance = await initI18n(localeCode, localeUrl)
        console.log('I18n', instance)
        if (instance.isInitialized) {
          console.log('I18n translation:', instance.t('common.all'))
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
  }, [localeCode, localeUrl, i18nInstance])

  if (
    i18nInstance == null ||
    (i18nInstance != null && !i18nInstance.isInitialized)
  ) {
    return <div>Loading i18n</div>
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}
