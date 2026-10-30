import merge from "lodash-es/merge"
import type {
  I18NLanguage,
  I18NLocale,
  I18NTranslations,
  Translation,
} from "./I18NProvider"

export const i18nLocales = ["en-US", "it-IT"] as const

/** Loads the `app-elements` translation of a language and merges the consumer one over it. */
export async function loadTranslation<T extends object>(
  lang: I18NLocale | I18NLanguage,
  translations?: I18NTranslations<T>,
): Promise<object> {
  const language = getLanguage(lang)
  const [base, extension] = await Promise.all([
    import(`../locales/${language}.ts`) as Promise<{
      default: Translation
    }>,
    translations?.[language](),
  ])
  return merge({}, base.default, extension?.default)
}

/** Returns the supported locale with the same language as the given one, or English when there is none. */
export function getSupportedLocale(locale?: string | null): I18NLocale {
  const language = locale?.split(/[-_]/)[0]?.toLowerCase()
  return (
    i18nLocales.find((supported) => supported.startsWith(`${language}-`)) ??
    i18nLocales[0]
  )
}

function getLanguage(lang?: I18NLocale | I18NLanguage): I18NLanguage {
  return getSupportedLocale(lang).split("-")[0] as I18NLanguage
}
