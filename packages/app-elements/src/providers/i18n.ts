/**
 * What components need to translate, without the `I18NProvider` component.
 *
 * The provider renders a loading page while translations load, so it depends on
 * the page layout and everything it renders. Components import `t` from here
 * instead: importing it from the provider made every translated component part
 * of that same graph, in an import cycle with the layout it is rendered in.
 */
import type { MergeDeep } from "type-fest"
import type en from "../locales/en"
import { i18nLocales } from "./I18NProvider.utils"

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
