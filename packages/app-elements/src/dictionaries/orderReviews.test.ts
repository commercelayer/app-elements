import { t } from "i18next"
import { getOrderReviewDisplayStatus } from "./orderReviews"

describe("getOrderReviewDisplayStatus", () => {
  it("speaks of the customer to the seller", () => {
    expect(
      getOrderReviewDisplayStatus({ status: "pending" }, "seller"),
    ).toEqual({
      label: t("apps.orders.display_status.customer_review"),
      icon: "hourglass",
      color: "orange",
    })
    expect(
      getOrderReviewDisplayStatus({ status: "accepted" }, "seller").label,
    ).toBe(t("apps.orders.display_status.customer_confirmed"))
    expect(
      getOrderReviewDisplayStatus({ status: "rejected" }, "seller").label,
    ).toBe(t("apps.orders.display_status.customer_rejected"))
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
