import { instructions } from "./mockedInstructions"
import { computeFilterLabel, getActiveFilterCountFromUrl } from "./utils"

describe("computeFilterLabel", () => {
  test("should return valid computed label", () => {
    expect(
      computeFilterLabel({
        label: "Markets",
        selectedCount: 0,
        totalCount: 4,
      }),
    ).toBe("Markets · 4")
  })

  test("should return selected count in computed label", () => {
    expect(
      computeFilterLabel({
        label: "Payment status",
        selectedCount: 2,
        totalCount: 6,
      }),
    ).toBe("Payment status · 2 of 6")
  })
})

describe("getActiveFilterCountFromUrl", () => {
  test("should read current URL query string", () => {
    expect(
      getActiveFilterCountFromUrl({
        instructions,
        queryString:
          "?market_id_in=abc123&status_in=approved&status_in=cancelled",
      }),
    ).toBe(2)
  })

  test("should not count hidden filters", () => {
    expect(
      getActiveFilterCountFromUrl({
        instructions,
        queryString:
          "?market_id_in=abc123&status_in=approved&status_in=cancelled&archived_at_null=show",
      }),
    ).toBe(2)
  })

  test("should return 0 when no filters are in query string", () => {
    expect(getActiveFilterCountFromUrl({ instructions, queryString: "" })).toBe(
      0,
    )
  })

  test("should ignore params that are not a filter", () => {
    expect(
      getActiveFilterCountFromUrl({
        instructions,
        queryString: "?status_in=approved&not-a-filter=yeah",
      }),
    ).toBe(1)
  })

  test("should ignore text filter", () => {
    expect(
      getActiveFilterCountFromUrl({
        instructions,
        includeTextSearch: false,
        queryString: "?status_in=approved&number_or_email_cont=foobar",
      }),
    ).toBe(1)
  })

  test("should include text filter when asked", () => {
    expect(
      getActiveFilterCountFromUrl({
        instructions,
        includeTextSearch: true,
        queryString: "?status_in=approved&number_or_email_cont=foobar",
      }),
    ).toBe(2)
  })
})
