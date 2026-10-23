import en from "../locales/en"
import it from "../locales/it"
import { getSupportedLocale, loadTranslation } from "./I18NProvider.utils"

const consumerEn = {
  apps: { orders: { cta: "Place order" } },
  common: { all: "Everything" },
}

const consumerIt: typeof consumerEn = {
  apps: { orders: { cta: "Ordina" } },
  common: { all: "Tutto" },
}

const translations = {
  en: async () => ({ default: consumerEn }),
  it: async () => ({ default: consumerIt }),
}

describe("loadTranslation", () => {
  test("returns the app-elements translation when there are no consumer translations", async () => {
    expect(await loadTranslation("en-US")).toEqual(en)
    expect(await loadTranslation("it-IT")).toEqual(it)
  })

  test("merges the consumer translation over the app-elements one", async () => {
    expect(await loadTranslation("en", translations)).toMatchObject({
      apps: { orders: { cta: "Place order" } },
      common: { all: "Everything", search: en.common.search },
    })
  })

  test("loads the consumer translation of the requested language", async () => {
    expect(await loadTranslation("it-IT", translations)).toMatchObject({
      apps: { orders: { cta: "Ordina" } },
      common: { all: "Tutto", search: it.common.search },
    })
  })

  test("does not mutate the app-elements translation", async () => {
    await loadTranslation("en", translations)

    expect(en.common.all).not.toBe("Everything")
  })
})

describe("getSupportedLocale", () => {
  test("returns the supported locale with the same language", () => {
    expect(getSupportedLocale("it-IT")).toBe("it-IT")
    expect(getSupportedLocale("it-CH")).toBe("it-IT")
    expect(getSupportedLocale("it")).toBe("it-IT")
    expect(getSupportedLocale("IT_it")).toBe("it-IT")
    expect(getSupportedLocale("en-GB")).toBe("en-US")
  })

  test("returns English for an unsupported or missing locale", () => {
    expect(getSupportedLocale("fr-FR")).toBe("en-US")
    expect(getSupportedLocale("")).toBe("en-US")
    expect(getSupportedLocale(null)).toBe("en-US")
    expect(getSupportedLocale(undefined)).toBe("en-US")
  })
})
