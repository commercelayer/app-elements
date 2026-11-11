import type { Order } from "@commercelayer/sdk"
import { t } from "i18next"
import {
  getAgentOrderReviewNote,
  getLastOrderReview,
  getOrderReviewDisplayStatus,
  isAgentOrderReview,
} from "./orderReviews"

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

describe("agent order reviews", () => {
  const agent = { type: "agents", id: "agent-1", name: "Frankie" } as never

  test("are the ones an agent asked for", () => {
    expect(isAgentOrderReview({ requester: agent })).toBe(true)
    expect(
      isAgentOrderReview({
        requester: { type: "users", id: "user-1" } as never,
      }),
    ).toBe(false)
    expect(isAgentOrderReview({})).toBe(false)
    expect(isAgentOrderReview(null)).toBe(false)
  })

  test("say why the agent held the order, then its notes", () => {
    expect(
      getAgentOrderReviewNote({
        requester: agent,
        reason: "inbound_pending",
      }),
    ).toBe(t("dictionaries.order_reviews.agent_reasons.inbound_pending"))
    expect(
      getAgentOrderReviewNote({
        requester: agent,
        reason: "inbound_needs_review",
        notes: "  Price differs from the email.  ",
      }),
    ).toBe(
      `${t("dictionaries.order_reviews.agent_reasons.inbound_needs_review")} Price differs from the email.`,
    )
    expect(
      getAgentOrderReviewNote({
        requester: agent,
        reason: "something_new",
        notes: "Only the notes.",
      }),
    ).toBe("Only the notes.")
  })

  test("leave a seller's review alone", () => {
    expect(
      getAgentOrderReviewNote({
        requester: { type: "users", id: "user-1" } as never,
        reason: "Please check the quantities",
      }),
    ).toBeNull()
  })
})
