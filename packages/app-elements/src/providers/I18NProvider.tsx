import { initI18n } from '#helpers/i18n'
import { type i18n as I18nInstance } from 'i18next'
import React, { type ReactNode, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'

interface I18NProviderProps {
  localeUrl?: string
  children: ReactNode
}

export const I18NProvider: React.FC<I18NProviderProps> = ({
  localeUrl,
  children
}) => {
  const [i18nInstance, setI18nInstance] = useState<I18nInstance | undefined>()

  useEffect(() => {
    const setupI18n = async (): Promise<void> => {
      try {
        const instance = await initI18n(localeUrl)
        setI18nInstance(instance)
      } catch (error) {
        console.error('Error initializing i18n:', error)
      }
    }

    void setupI18n()
  }, [localeUrl])

  if (i18nInstance == null) {
    return <div>{children}</div>
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}
