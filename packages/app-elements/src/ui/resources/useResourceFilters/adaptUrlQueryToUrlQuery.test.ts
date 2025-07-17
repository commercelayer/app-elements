import { adaptUrlQueryToUrlQuery } from "./adaptUrlQueryToUrlQuery"
import { instructions } from "./mockedInstructions"

describe("adaptUrlQueryToUrlQuery", () => {
  test("should return same string", () => {
    expect(
      adaptUrlQueryToUrlQuery({
        queryString:
          "market_id_in=abc123&status_in=approved&status_in=cancelled&viewTitle=Awaiting%20Approval",
        instructions,
      }),
    ).toBe(
      "market_id_in=abc123&status_in=approved&status_in=cancelled&viewTitle=Awaiting%20Approval",
    )
  })

  test("should strip out params from query string when not defined in the instructions", () => {
    expect(
      adaptUrlQueryToUrlQuery({
        queryString:
          "lastname_eq=doe&market_id_in=abc123&status_in=approved&status_in=cancelled&viewTitle=Awaiting%20Approval",
        instructions,
      }),
    ).toBe(
      "market_id_in=abc123&status_in=approved&status_in=cancelled&viewTitle=Awaiting%20Approval",
    )
  })

  test("should include whitelisted predicates", () => {
    expect(
      adaptUrlQueryToUrlQuery({
        queryString:
          "lastname_eq=doe&market_id_in=abc123&status_in=approved&status_in=cancelled&viewTitle=Awaiting%20Approval",
        instructions,
        predicateWhitelist: ["lastname_eq"],
      }),
    ).toBe(
      "lastname_eq=doe&market_id_in=abc123&status_in=approved&status_in=cancelled&viewTitle=Awaiting%20Approval",
    )
  })

  test("should re-sort query params alphabetically same string", () => {
    expect(
      adaptUrlQueryToUrlQuery({
        queryString:
          "status_in=approved&market_id_in=abc123&status_in=cancelled",
        instructions,
      }),
    ).toBe("market_id_in=abc123&status_in=approved&status_in=cancelled")
  })

  test("should cleanup empty values", () => {
    expect(
      adaptUrlQueryToUrlQuery({
        queryString: "market_id_in=&status_in=approved&status_in=cancelled",
        instructions,
      }),
    ).toBe("status_in=approved&status_in=cancelled")
  })

  test("should ignore invalid values", () => {
    expect(
      adaptUrlQueryToUrlQuery({
        queryString:
          "status_in=approved&paymentStatus=not-existing&status_in=draft",
        instructions,
      }),
    ).toBe("status_in=approved")
  })
})
