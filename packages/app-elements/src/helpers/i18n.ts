import i18n, { type i18n as I18nInstance } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

export const initI18n = async (
  localeUrl: string | undefined
): Promise<I18nInstance> => {
  await i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      backend: {
        loadPath:
          // TODO: Define the path to the i18n public files
          localeUrl ?? 'https://cdn.commercelayer.io/i18n/{{lng}}.json'
      },
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      },
      react: {
        useSuspense: true
      }
    })
  return i18n
}
