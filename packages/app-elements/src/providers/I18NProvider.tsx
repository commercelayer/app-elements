import i18n, { type i18n as I18nInstance } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'
import React, { type ReactNode, useEffect, useState } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import type en from '../locales/en'

export { t } from 'i18next'
export { useTranslation } from 'react-i18next'

export const i18nLocales = ['en', 'it'] as const
export type I18NLocale = (typeof i18nLocales)[number]

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof en
    }
  }
}

interface I18NProviderProps {
  localeCode?: I18NLocale
  children: ReactNode
}

export const I18NProvider: React.FC<I18NProviderProps> = ({
  localeCode = i18nLocales[0],
  children
}) => {
  const [i18nInstance, setI18nInstance] = useState<I18nInstance | undefined>()

  useEffect(() => {
    const setupI18n = async (): Promise<void> => {
      try {
        const instance = await initI18n(localeCode)
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
  }, [localeCode, i18nInstance])

  if (
    i18nInstance == null ||
    (i18nInstance != null && !i18nInstance.isInitialized)
  ) {
    return <div>Loading i18n</div>
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}

const initI18n = async (localeCode: I18NLocale): Promise<I18nInstance> => {
  await i18n
    .use(
      resourcesToBackend(
        async (language: I18NLocale) =>
          await import(`../locales/${language}.ts`)
      )
    )
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      load: 'languageOnly',
      supportedLngs: i18nLocales,
      lng: localeCode,
      fallbackLng: i18nLocales[0],
      react: {
        useSuspense: true
      },
      debug: true
    })
  return i18n
}
