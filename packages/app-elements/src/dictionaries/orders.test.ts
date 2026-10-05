import type { Order } from "@commercelayer/sdk"
import { t } from "i18next"
import {
  getOrderDisplayStatus,
  getOrderFulfillmentStatusName,
  getOrderStatusName,
} from "./orders"

/** The three attributes the display status is derived from, and nothing else. */
function order(
  status: Order["status"],
  paymentStatus: Order["payment_status"],
  fulfillmentStatus: Order["fulfillment_status"],
): Order {
  return {
    status,
    payment_status: paymentStatus,
    fulfillment_status: fulfillmentStatus,
  } as Order
}

describe("getOrderDisplayStatus", () => {
  it("reads a partial refund as a payment that went through", () => {
    const fulfillmentStatuses = [
      "in_progress",
      "fulfilled",
      "not_required",
    ] as const

    fulfillmentStatuses.forEach((fulfillmentStatus) => {
      expect(
        getOrderDisplayStatus(
          order("approved", "partially_refunded", fulfillmentStatus),
        ),
      ).toEqual(
        getOrderDisplayStatus(order("approved", "paid", fulfillmentStatus)),
      )
    })

    expect(
      getOrderDisplayStatus(
        order("placed", "partially_refunded", "unfulfilled"),
      ),
    ).toEqual(getOrderDisplayStatus(order("placed", "paid", "unfulfilled")))
  })

  it("shows the fulfillment status of an approved, partially refunded order", () => {
    expect(
      getOrderDisplayStatus(
        order("approved", "partially_refunded", "fulfilled"),
      ),
    ).toEqual({
      label: getOrderFulfillmentStatusName("fulfilled"),
      icon: "check",
      color: "green",
    })
  })

  it("reads a partial capture or void like an authorized order", () => {
    const partialStatuses = ["partially_paid", "partially_voided"] as const

    partialStatuses.forEach((paymentStatus) => {
      expect(
        getOrderDisplayStatus(order("placed", paymentStatus, "unfulfilled")),
      ).toEqual({
        label: t("resources.orders.attributes.status.placed"),
        icon: "arrowDown",
        color: "orange",
        task: t("apps.orders.tasks.awaiting_approval"),
      })
      expect(
        getOrderDisplayStatus(order("approved", paymentStatus, "unfulfilled")),
      ).toEqual({
        label: t("apps.orders.display_status.awaiting_capture"),
        icon: "creditCard",
        color: "orange",
        task: t("apps.orders.tasks.payment_to_capture"),
      })
      expect(
        getOrderDisplayStatus(order("approved", paymentStatus, "in_progress")),
      ).toEqual({
        label: t("apps.orders.display_status.in_progress"),
        icon: "arrowClockwise",
        color: "orange",
        task: t("apps.orders.tasks.fulfillment_in_progress"),
      })
      expect(
        getOrderDisplayStatus(order("approved", paymentStatus, "fulfilled")),
      ).toEqual({
        label: getOrderFulfillmentStatusName("fulfilled"),
        icon: "check",
        color: "green",
      })
    })
  })

  it("shows a fulfilled order as fulfilled after a full refund", () => {
    expect(
      getOrderDisplayStatus(order("approved", "refunded", "fulfilled")),
    ).toEqual({
      label: getOrderFulfillmentStatusName("fulfilled"),
      icon: "check",
      color: "green",
    })
  })

  it("falls back to the order status when the combination is not named", () => {
    expect(
      getOrderDisplayStatus(
        order("approved", "partially_refunded", "unfulfilled"),
      ),
    ).toEqual({
      label: getOrderStatusName("approved"),
      icon: "check",
      color: "green",
    })

    expect(
      getOrderDisplayStatus(order("draft", "unpaid", "unfulfilled")),
    ).toEqual({
      label: getOrderStatusName("draft"),
      icon: "minus",
      color: "gray",
    })
  })
})
