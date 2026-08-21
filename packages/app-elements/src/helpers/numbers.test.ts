import { describe, expect, it } from "vitest"
import { formatNumber } from "./numbers"

describe("formatNumber", () => {
  it("groups thousands", () => {
    expect(formatNumber({ value: 12345, locale: "en-US" })).toBe("12,345")
  })

  it("groups in the given locale", () => {
    expect(formatNumber({ value: 12345, locale: "it-IT" })).toBe("12.345")
  })

  // it-IT groups only from five digits by default, which would style `1234` and
  // `12345` differently in the same column
  it("groups four digits even where the locale would not", () => {
    expect(formatNumber({ value: 1234, locale: "it-IT" })).toBe("1.234")
  })

  it("leaves a small number alone", () => {
    expect(formatNumber({ value: 42, locale: "en-US" })).toBe("42")
  })

  // no locale means the runtime's own, as `toLocaleString()` would
  it("falls back to the runtime locale", () => {
    expect(formatNumber({ value: 12345 })).toBe(
      Intl.NumberFormat(undefined, { useGrouping: "always" }).format(12345),
    )
  })

  // the API omits a count rather than sending zero, and a blank cell would read as
  // "unknown" where the answer is "none"
  it.each([null, undefined])("formats %s as zero", (value) => {
    expect(formatNumber({ value, locale: "en-US" })).toBe("0")
  })
})
