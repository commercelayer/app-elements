import i18n, { type i18n as I18nInstance } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next'

export const languages = ['en', 'it'] as const

export type I18NLocale = (typeof languages)[number]

export const initI18n = async (
  localeCode: I18NLocale
): Promise<I18nInstance> => {
  await i18n
    .use(
      resourcesToBackend(
        async (language: I18NLocale) =>
          await import(`../../locales/${language}.json`)
      )
    )
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      load: 'languageOnly',
      supportedLngs: languages,
      lng: localeCode,
      fallbackLng: languages[0],
      react: {
        useSuspense: true
      },
      debug: true
    })
  return i18n
}
