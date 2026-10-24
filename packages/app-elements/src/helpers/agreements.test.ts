import { isAgreementsEnabled } from "./agreements"

describe("isAgreementsEnabled", () => {
  test("is on for every organization until the flag exists", () => {
    expect(isAgreementsEnabled({ id: "abc", api_rules_engine: false })).toBe(
      true,
    )
  })

  test("does not need the organization to be loaded yet", () => {
    expect(isAgreementsEnabled(undefined)).toBe(true)
    expect(isAgreementsEnabled(null)).toBe(true)
  })
})
