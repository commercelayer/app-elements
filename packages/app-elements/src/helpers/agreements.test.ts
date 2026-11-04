import { isAgreementsEnabled } from "./agreements"

describe("isAgreementsEnabled", () => {
  test("is on when the organization has the agreements feature enabled", () => {
    expect(isAgreementsEnabled({ id: "abc", agreements_enabled: true })).toBe(
      true,
    )
  })

  test("is off when the feature is disabled, or the attribute is missing", () => {
    expect(isAgreementsEnabled({ id: "abc", agreements_enabled: false })).toBe(
      false,
    )
    expect(isAgreementsEnabled({ id: "abc", agreements_enabled: null })).toBe(
      false,
    )
    expect(isAgreementsEnabled({ id: "abc", api_rules_engine: true })).toBe(
      false,
    )
  })

  test("is off until the organization is loaded", () => {
    expect(isAgreementsEnabled(undefined)).toBe(false)
    expect(isAgreementsEnabled(null)).toBe(false)
  })
})
