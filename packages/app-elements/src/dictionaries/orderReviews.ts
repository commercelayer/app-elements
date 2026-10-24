import type { OrderReview } from "@commercelayer/sdk"
import { t } from "i18next"
import type { DisplayStatus } from "./types"

/**
 * An order review's status, from either side of it.
 *
 * The seller asks and the buyer answers, so the same review reads differently to
 * each: "Customer review" to the seller is "Review required" to the buyer. Both
 * the orders app and the buyer shell go through this, so the two sides never
 * describe one review in unrelated words.
 */
export function getOrderReviewDisplayStatus(
  review: Pick<OrderReview, "status">,
  viewer: "seller" | "buyer",
): DisplayStatus {
  switch (review.status) {
    case "pending":
      return {
        label:
          viewer === "seller"
            ? t("apps.orders.display_status.customer_review")
            : t("resources.order_reviews.attributes.status.pending"),
        icon: "hourglass",
        color: "orange",
      }
    case "accepted":
      return {
        label:
          viewer === "seller"
            ? t("apps.orders.display_status.customer_confirmed")
            : t("resources.order_reviews.attributes.status.accepted"),
        icon: "check",
        color: "green",
      }
    case "rejected":
      return {
        label:
          viewer === "seller"
            ? t("apps.orders.display_status.customer_rejected")
            : t("resources.order_reviews.attributes.status.rejected"),
        icon: "x",
        color: "red",
      }
  }
}
