import type { Promotion } from "@commercelayer/sdk"
import { getPromotionDisplayStatus } from "./promotions"

/** The attributes the display status is derived from, and nothing else. */
function promotion(
  attributes: Partial<
    Pick<
      Promotion,
      | "starts_at"
      | "expires_at"
      | "disabled_at"
      | "total_usage_limit"
      | "total_usage_count"
    >
  > = {},
): Promotion {
  return {
    starts_at: "2026-10-01T22:00:00.000Z",
    expires_at: "2026-10-06T09:30:00.000Z",
    ...attributes,
  } as Promotion
}

describe("getPromotionDisplayStatus", () => {
  const originalTimezone = process.env.TZ

  beforeEach(() => {
    vi.useFakeTimers().setSystemTime("2026-10-06T07:53:00.000Z")
  })

  afterEach(() => {
    vi.useRealTimers()
    process.env.TZ = originalTimezone
  })

  it("is upcoming until the promotion starts", () => {
    expect(
      getPromotionDisplayStatus(
        promotion({ starts_at: "2026-10-06T08:00:00.000Z" }),
      ).status,
    ).toBe("upcoming")
  })

  it("is active between the start and the expiration", () => {
    expect(getPromotionDisplayStatus(promotion()).status).toBe("active")
  })

  it("is expired once the expiration is past", () => {
    expect(
      getPromotionDisplayStatus(
        promotion({ expires_at: "2026-10-06T07:30:00.000Z" }),
      ).status,
    ).toBe("expired")
  })

  it("does not depend on the browser timezone", () => {
    // https://github.com/commercelayer/issues-app/issues/752
    // East of UTC the promotion was shown as expired as many hours early as
    // the offset, west of UTC it was shown as active as many hours late.
    const timezones = ["UTC", "Europe/Copenhagen", "America/New_York"]

    timezones.forEach((timezone) => {
      process.env.TZ = timezone

      expect(getPromotionDisplayStatus(promotion()).status).toBe("active")
      expect(
        getPromotionDisplayStatus(
          promotion({ expires_at: "2026-10-06T07:30:00.000Z" }),
        ).status,
      ).toBe("expired")
      expect(
        getPromotionDisplayStatus(
          promotion({ starts_at: "2026-10-06T08:00:00.000Z" }),
        ).status,
      ).toBe("upcoming")
    })
  })

  it("is disabled whenever `disabled_at` is set", () => {
    expect(
      getPromotionDisplayStatus(
        promotion({ disabled_at: "2026-10-05T00:00:00.000Z" }),
      ).status,
    ).toBe("disabled")
  })

  it("is used once the usage limit is reached", () => {
    expect(
      getPromotionDisplayStatus(
        promotion({ total_usage_limit: 3, total_usage_count: 3 }),
      ).status,
    ).toBe("used")
  })
})
