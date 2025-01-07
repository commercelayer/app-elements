import { LoadingPage } from '#ui/composite/Routes/Routes'
import i18n, { type i18n as I18nInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import React, { useEffect, useState, type ReactNode } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import type en from '../locales/en'
import { useTokenProvider } from './TokenProvider'

export { t } from 'i18next'
export { Trans, useTranslation } from 'react-i18next'

export const i18nLocales = ['en-US', 'it-IT'] as const
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
  /** Optional locale to use for i18n translations that will override the locale set in the user's token. */
  enforcedLocaleCode?: I18NLocale
  /**
   * The children to render.
   */
  children: ReactNode
}

export const I18NProvider: React.FC<I18NProviderProps> = ({
  children,
  enforcedLocaleCode
}) => {
  const { user } = useTokenProvider()
  const localeCode = enforcedLocaleCode ?? user?.locale ?? i18nLocales[0]
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

  useEffect(() => {
    if (
      i18nInstance?.isInitialized === true &&
      i18nInstance.language !== enforcedLocaleCode
    ) {
      void i18nInstance.changeLanguage(enforcedLocaleCode)
    }
  }, [enforcedLocaleCode])

  if (
    i18nInstance == null ||
    (i18nInstance != null && !i18nInstance.isInitialized)
  ) {
    return <LoadingPage />
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}

const initI18n = async (localeCode: I18NLocale): Promise<I18nInstance> => {
  await i18n
    .use(
      resourcesToBackend(
        async (lang: I18NLocale) =>
          await import(`../locales/${getLocaleFileName(lang)}.ts`)
      )
    )
    .use(initReactI18next)
    .init({
      load: 'languageOnly',
      lng: localeCode,
      fallbackLng: i18nLocales[0],
      react: {
        useSuspense: true
      },
      debug: true
    })
  return i18n
}

function getLocaleFileName(lang?: I18NLocale): string {
  return lang?.split('-')[0] === 'it' ? 'it' : 'en'
}
