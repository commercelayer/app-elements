import i18n, { type i18n as I18nInstance } from "i18next"
import resourcesToBackend from "i18next-resources-to-backend"
import { type JSX, type ReactNode, useEffect, useState } from "react"
import { I18nextProvider, initReactI18next } from "react-i18next"
import type { MergeDeep } from "type-fest"
import { LoadingPage } from "#ui/composite/Routes/Routes"
import type en from "../locales/en"
import { i18nLocales, loadTranslation } from "./I18NProvider.utils"
import { useTokenProvider } from "./TokenProvider"

export { t } from "i18next"
export { Trans, useTranslation } from "react-i18next"

export { i18nLocales }
export type I18NLocale = (typeof i18nLocales)[number]
export type I18NLanguage = I18NLocale extends `${infer L}-${string}` ? L : never
export type Translation = typeof en

/** The translation resulting from merging `Extension` over `Base`. */
export type MergeTranslations<
  Base extends object,
  Extension extends object,
> = MergeDeep<Base, Extension>

/**
 * Lazy loaders of the translations a consumer adds to (or overrides in) the `app-elements` ones,
 * one for every supported language, each with the same keys as English.
 */
export type I18NTranslations<T extends object = object> = {
  [L in I18NLanguage]: () => Promise<{ default: T }>
}

interface I18NProviderProps<T extends object> {
  /**
   * Whether to enable debug mode for i18n.
   * @default false
   */
  debug?: boolean
  /**
   * Translations merged over the `app-elements` ones. They are read once, when i18n is initialized.
   */
  translations?: I18NTranslations<T>
  /**
   * The children to render.
   */
  children: ReactNode
}

export function I18NProvider<T extends object>({
  children,
  debug = false,
  translations,
}: I18NProviderProps<T>): JSX.Element {
  const { user } = useTokenProvider()
  const localeCode = user?.locale ?? i18nLocales[0]
  const [i18nInstance, setI18nInstance] = useState<I18nInstance | undefined>()

  useEffect(() => {
    const setupI18n = async (): Promise<void> => {
      try {
        const instance = await initI18n(localeCode, debug, translations)
        if (instance.isInitialized) {
          setI18nInstance(instance)
        }
      } catch (error) {
        console.error("Error initializing i18n:", error)
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
    return <LoadingPage />
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}

const initI18n = async <T extends object>(
  localeCode: I18NLocale,
  debug: I18NProviderProps<T>["debug"],
  translations: I18NProviderProps<T>["translations"],
): Promise<I18nInstance> => {
  await i18n
    .use(
      resourcesToBackend(
        async (lang: I18NLocale) => await loadTranslation(lang, translations),
      ),
    )
    .use(initReactI18next)
    .init({
      load: "languageOnly",
      lng: localeCode,
      fallbackLng: i18nLocales[0],
      showSupportNotice: false,
      react: {
        useSuspense: true,
      },
      debug,
    })
  return i18n
}
