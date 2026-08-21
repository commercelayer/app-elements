import { BG_COLORS, getWhiteContrastRatio } from "./colors"

describe("getWhiteContrastRatio", () => {
  test("Should be 1 against white itself", () => {
    expect(getWhiteContrastRatio("#FFFFFF")).toBeCloseTo(1, 2)
  })

  test("Should be 21 against black", () => {
    expect(getWhiteContrastRatio("#000000")).toBeCloseTo(21, 2)
  })

  test("Should rate a pastel as unreadable", () => {
    // one of the yellows the palette used to hold
    expect(getWhiteContrastRatio("#FFF280")).toBeLessThan(1.5)
  })
})

describe("BG_COLORS", () => {
  test("Should hold no duplicates", () => {
    expect(new Set(BG_COLORS).size).toBe(BG_COLORS.length)
  })

  // Not an assertion that every colour is legible: three pastels are in the
  // palette by choice and carry white initials at under 2.5:1. This only pins the
  // majority, so a batch of new low-contrast colours does not slip in unnoticed.
  test("Should keep most backgrounds able to carry white initials", () => {
    const readable = BG_COLORS.filter(
      (color) => getWhiteContrastRatio(color) >= 4.5,
    )
    expect(readable.length).toBeGreaterThanOrEqual(BG_COLORS.length - 3)
  })
})
