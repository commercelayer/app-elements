import type { Order, OrderReview } from "@commercelayer/sdk"
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
            ? t("dictionaries.orders.display_status.customer_review")
            : t("resources.order_reviews.attributes.status.pending"),
        icon: "hourglass",
        color: "orange",
      }
    case "accepted":
      return {
        label:
          viewer === "seller"
            ? t("dictionaries.orders.display_status.customer_confirmed")
            : t("resources.order_reviews.attributes.status.accepted"),
        icon: "check",
        color: "green",
      }
    case "rejected":
      return {
        label:
          viewer === "seller"
            ? t("dictionaries.orders.display_status.customer_rejected")
            : t("resources.order_reviews.attributes.status.rejected"),
        icon: "x",
        color: "red",
      }
  }
}

/**
 * Whether an email-to-order agent asked for the review: it built the order from
 * an email and holds it for the seller, rather than the seller asking the buyer.
 * The seller answers it — the agreement's account manager owns it.
 *
 * Needs the review with its `requester` included.
 */
export function isAgentOrderReview(
  review: Pick<OrderReview, "requester"> | null | undefined,
): boolean {
  return review?.requester?.type === "agents"
}

/**
 * What the agent says about an order it held for review: why it held it, then
 * its own notes when it wrote any — what it found in the email, or why placing
 * failed. `null` for a review the agent did not ask for.
 *
 * Core records the why as a code in `reason`, so the sentence is ours.
 */
export function getAgentOrderReviewNote(
  review: Pick<OrderReview, "requester" | "reason" | "notes">,
): string | null {
  if (!isAgentOrderReview(review)) {
    return null
  }

  const notes = review.notes?.trim() ?? ""
  const why = agentReviewReason(review.reason)

  return [why, notes].filter((part) => part !== "").join(" ") || null
}

function agentReviewReason(reason: OrderReview["reason"]): string {
  switch (reason) {
    case "inbound_pending":
      return t("dictionaries.order_reviews.agent_reasons.inbound_pending")
    case "inbound_needs_review":
      return t("dictionaries.order_reviews.agent_reasons.inbound_needs_review")
    case "inbound_place_failed":
      return t("dictionaries.order_reviews.agent_reasons.inbound_place_failed")
    default:
      return ""
  }
}

/**
 * The order's latest review, the one that decides where it stands, or `null`
 * when the seller never asked. Latest by creation: Core keeps at most one
 * pending review, and a withdrawn one is deleted.
 *
 * Needs the order with its `order_reviews` included.
 */
export function getLastOrderReview(
  order: Pick<Order, "order_reviews"> | null | undefined,
): OrderReview | null {
  return (
    [...(order?.order_reviews ?? [])].sort((a, b) =>
      (b.created_at ?? "").localeCompare(a.created_at ?? ""),
    )[0] ?? null
  )
}
