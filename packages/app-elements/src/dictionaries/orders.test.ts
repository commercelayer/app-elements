import type { Order } from "@commercelayer/sdk"
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
