import type { Order } from "@commercelayer/sdk"
import { t } from "i18next"
import { getLastOrderReview, getOrderReviewDisplayStatus } from "./orderReviews"

describe("getOrderReviewDisplayStatus", () => {
  it("speaks of the customer to the seller", () => {
    expect(
      getOrderReviewDisplayStatus({ status: "pending" }, "seller"),
    ).toEqual({
      label: t("dictionaries.orders.display_status.customer_review"),
      icon: "hourglass",
      color: "orange",
    })
    expect(
      getOrderReviewDisplayStatus({ status: "accepted" }, "seller").label,
    ).toBe(t("dictionaries.orders.display_status.customer_confirmed"))
    expect(
      getOrderReviewDisplayStatus({ status: "rejected" }, "seller").label,
    ).toBe(t("dictionaries.orders.display_status.customer_rejected"))
  })

  it("asks the buyer for their review", () => {
    expect(
      getOrderReviewDisplayStatus({ status: "pending" }, "buyer").label,
    ).toBe(t("resources.order_reviews.attributes.status.pending"))
    expect(
      getOrderReviewDisplayStatus({ status: "accepted" }, "buyer").label,
    ).toBe(t("resources.order_reviews.attributes.status.accepted"))
    expect(
      getOrderReviewDisplayStatus({ status: "rejected" }, "buyer").color,
    ).toBe("red")
  })
})

describe("getLastOrderReview", () => {
  test("picks the latest review by creation", () => {
    expect(
      getLastOrderReview({
        order_reviews: [
          { id: "older", created_at: "2026-10-01T10:00:00Z" },
          { id: "latest", created_at: "2026-10-02T10:00:00Z" },
        ] as Order["order_reviews"],
      })?.id,
    ).toBe("latest")
  })

  test("is null when the seller never asked", () => {
    expect(getLastOrderReview({ order_reviews: [] })).toBeNull()
    expect(getLastOrderReview(undefined)).toBeNull()
  })
})
