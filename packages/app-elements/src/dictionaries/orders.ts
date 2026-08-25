import type { Order } from "@commercelayer/sdk"
import { t } from "i18next"
import type { StatusIconProps } from "#ui/atoms/StatusIcon"
import type { DisplayStatus } from "./types"
export interface OrderDisplayStatus extends DisplayStatus {
  label: string
  icon: StatusIconProps["name"]
  color: StatusIconProps["background"]
  task?: string
}

export function getOrderDisplayStatus(order: Order): OrderDisplayStatus {
  // A partial refund changes neither where the order stands nor what is left to do
  // with it, so it reads as `paid`: the display status then follows the fulfillment
  // status, exactly as for an order that was never refunded. That part of the money
  // went back is told by the payment status itself, beside the transactions.
  const paymentStatus =
    order.payment_status === "partially_refunded"
      ? "paid"
      : order.payment_status

  const combinedStatus =
    `${order.status}:${paymentStatus}:${order.fulfillment_status}` as const

  if (order.status === "cancelled") {
    return {
      label: t("resources.orders.attributes.status.cancelled"),
      icon: "x",
      color: "gray",
    }
  }

  if (order.status === "editing") {
    return {
      label: t("resources.orders.attributes.status.editing"),
      icon: "pencilSimple",
      color: "orange",
      task: t("resources.orders.attributes.status.editing"),
    }
  }

  switch (combinedStatus) {
    case "placed:authorized:unfulfilled":
    case "placed:authorized:not_required":
    case "placed:paid:unfulfilled":
    case "placed:paid:not_required":
    case "placed:free:unfulfilled":
    case "placed:free:not_required":
      return {
        label: t("resources.orders.attributes.status.placed"),
        icon: "arrowDown",
        color: "orange",
        task: t("apps.orders.tasks.awaiting_approval"),
      }

    case "placed:unpaid:unfulfilled":
    case "placed:partially_authorized:unfulfilled":
    case "placed:partially_authorized:not_required":
      return {
        label: t("resources.orders.attributes.status.placed"),
        icon: "x",
        color: "red",
        task: t("apps.orders.tasks.error_to_cancel"),
      }

    case "approved:authorized:unfulfilled":
    case "approved:authorized:not_required":
      return {
        // an approved order whose payment is only authorized says what is left to
        // do rather than what already happened: the money is not captured yet
        label: t("apps.orders.display_status.awaiting_capture"),
        icon: "creditCard",
        color: "orange",
        task: t("apps.orders.tasks.payment_to_capture"),
      }

    case "approved:paid:in_progress":
    case "approved:free:in_progress":
      return {
        label: t("apps.orders.display_status.in_progress"),
        icon: "arrowClockwise",
        color: "orange",
        task: t("apps.orders.tasks.fulfillment_in_progress"),
      }

    case "approved:authorized:in_progress":
      return {
        label: t("apps.orders.display_status.in_progress"),
        icon: "arrowClockwise",
        color: "orange",
        task: t("apps.orders.tasks.fulfillment_in_progress"),
      }

    case "approved:paid:fulfilled":
      return {
        label: t("resources.orders.attributes.fulfillment_status.fulfilled"),
        icon: "check",
        color: "green",
      }

    // TODO: This could be a gift-card and what If i do return?
    case "approved:free:fulfilled":
      return {
        label: t("resources.orders.attributes.fulfillment_status.fulfilled"),
        icon: "check",
        color: "green",
      }

    case "approved:paid:not_required":
      return {
        label: t("resources.orders.attributes.status.approved"),
        icon: "check",
        color: "green",
      }

    case "approved:free:not_required":
      return {
        label: t("resources.orders.attributes.status.approved"),
        icon: "check",
        color: "green",
      }

    case "pending:unpaid:unfulfilled":
    case "pending:authorized:unfulfilled":
    case "pending:free:unfulfilled":
      return {
        label: t("resources.orders.attributes.status.pending"),
        icon: "shoppingBag",
        color: "white",
      }

    default:
      // A combination the switch does not name is not an error to show the user:
      // fall back to the order status, which is always true, and dress it the way
      // that status is dressed elsewhere.
      return {
        label: getOrderStatusName(order.status),
        ...statusAppearance[order.status],
      }
  }
}

/** Icon and color of each order status, for when no finer status applies. */
const statusAppearance: Record<
  Order["status"],
  Pick<OrderDisplayStatus, "icon" | "color">
> = {
  draft: { icon: "minus", color: "gray" },
  pending: { icon: "shoppingBag", color: "white" },
  placing: { icon: "shoppingBag", color: "white" },
  placed: { icon: "arrowDown", color: "orange" },
  approved: { icon: "check", color: "green" },
  editing: { icon: "pencilSimple", color: "orange" },
  cancelled: { icon: "x", color: "gray" },
}

export function getOrderTransactionName(
  type: NonNullable<Order["transactions"]>[number]["type"],
): { pastTense: string; singular: string } {
  const pastTenseDictionary: Record<typeof type, string> = {
    authorizations: t(
      "resources.orders.attributes.payment_status.authorized",
    ).toLowerCase(),
    captures: t("apps.orders.details.payment_captured").toLowerCase(),
    refunds: t(
      "resources.orders.attributes.payment_status.refunded",
    ).toLowerCase(),
    voids: t("resources.orders.attributes.payment_status.voided").toLowerCase(),
  }
  const singularDictionary: Record<typeof type, string> = {
    authorizations: t("apps.orders.details.payment_authorization"),
    captures: t("apps.orders.details.payment_capture"),
    refunds: t("apps.orders.details.payment_refund"),
    voids: t("apps.orders.details.payment_void"),
  }

  return {
    pastTense: pastTenseDictionary[type],
    singular: singularDictionary[type],
  }
}

export function getOrderStatusName(status: Order["status"]): string {
  const dictionary: Record<typeof status, string> = {
    approved: t("resources.orders.attributes.status.approved"),
    cancelled: t("resources.orders.attributes.status.cancelled"),
    draft: t("resources.orders.attributes.status.draft"),
    editing: t("resources.orders.attributes.status.editing"),
    pending: t("resources.orders.attributes.status.pending"),
    placed: t("resources.orders.attributes.status.placed"),
    placing: t("resources.orders.attributes.status.placing"),
  }

  return dictionary[status]
}

export function getOrderPaymentStatusName(
  status: Order["payment_status"],
): string {
  const dictionary: Record<typeof status, string> = {
    authorized: t("resources.orders.attributes.payment_status.authorized"),
    paid: t("resources.orders.attributes.payment_status.paid"),
    unpaid: t("resources.orders.attributes.payment_status.unpaid"),
    free: t("resources.orders.attributes.payment_status.free"),
    voided: t("resources.orders.attributes.payment_status.voided"),
    refunded: t("resources.orders.attributes.payment_status.refunded"),
    partially_authorized: t(
      "resources.orders.attributes.payment_status.partially_authorized",
    ),
    partially_paid: t(
      "resources.orders.attributes.payment_status.partially_paid",
    ),
    partially_refunded: t(
      "resources.orders.attributes.payment_status.partially_refunded",
    ),
    partially_voided: t(
      "resources.orders.attributes.payment_status.partially_voided",
    ),
  }

  return dictionary[status]
}

export function getOrderFulfillmentStatusName(
  status: Order["fulfillment_status"],
): string {
  const dictionary: Record<typeof status, string> = {
    unfulfilled: t(
      "resources.orders.attributes.fulfillment_status.unfulfilled",
    ),
    in_progress: t(
      "resources.orders.attributes.fulfillment_status.in_progress",
    ),
    fulfilled: t("resources.orders.attributes.fulfillment_status.fulfilled"),
    not_required: t(
      "resources.orders.attributes.fulfillment_status.not_required",
    ),
  }

  return dictionary[status]
}
