import i18n, { type i18n as I18nInstance } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi, { type HttpBackendOptions } from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

export const languages = ['en', 'it'] as const

export type I18NLocale = (typeof languages)[number]

export const initI18n = async (
  localeCode: I18NLocale,
  localeUrl?: string
): Promise<I18nInstance> => {
  await i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init<HttpBackendOptions>({
      load: 'languageOnly',
      supportedLngs: languages,
      lng: localeCode,
      fallbackLng: languages[0],
      preload: ['en'],
      react: {
        useSuspense: true
      },
      backend: {
        loadPath:
          // TODO: Define the path to the i18n public files
          localeUrl ?? 'https://cdn.commercelayer.io/i18n/{{lng}}.json'
      },
      debug: true
    })
  return i18n
}
