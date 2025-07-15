import type { Shipment } from "@commercelayer/sdk"
import { t } from "i18next"
import type { StatusIconProps } from "#ui/atoms/StatusIcon"
import type { DisplayStatus } from "./types"

export interface ShipmentDisplayStatus extends DisplayStatus {
  label: string
  icon: StatusIconProps["name"]
  color: StatusIconProps["background"]
  task?: string
}

export function getShipmentDisplayStatus(
  shipment: Shipment,
  awaitingStockTransfer: boolean = false,
): ShipmentDisplayStatus {
  const shipmentStatus = awaitingStockTransfer
    ? "awaiting_stock_transfer"
    : shipment.status

  switch (shipmentStatus) {
    case "upcoming":
      return {
        label: t("resources.shipments.attributes.status.upcoming"),
        icon: "truck",
        color: "gray",
      }

    case "cancelled":
      return {
        label: t("resources.shipments.attributes.status.cancelled"),
        icon: "x",
        color: "gray",
      }

    case "draft":
      return {
        label: t("resources.shipments.attributes.status.draft"),
        icon: "minus",
        color: "gray",
      }

    case "on_hold":
      return {
        label: t("resources.shipments.attributes.status.on_hold"),
        icon: "hourglass",
        color: "orange",
        task: t("resources.shipments.attributes.status.on_hold"),
      }

    case "packing":
      return {
        label: t("resources.shipments.attributes.status.packing"),
        icon: "package",
        color: "orange",
        task: t("resources.shipments.attributes.status.packing"),
      }

    case "picking":
      return {
        label: t("resources.shipments.attributes.status.picking"),
        icon: "arrowDown",
        color: "orange",
        task: t("resources.shipments.attributes.status.picking"),
      }

    case "ready_to_ship":
      return {
        label: t("resources.shipments.attributes.status.ready_to_ship"),
        icon: "arrowUpRight",
        color: "orange",
        task: t("resources.shipments.attributes.status.ready_to_ship"),
      }

    case "shipped":
      return {
        label: t("resources.shipments.attributes.status.shipped"),
        icon: "arrowUpRight",
        color: "green",
      }

    case "delivered":
      return {
        label: t("resources.shipments.attributes.status.delivered"),
        icon: "check",
        color: "green",
      }

    case "awaiting_stock_transfer":
      return {
        label: t("apps.shipments.details.awaiting_stock_transfer"),
        icon: "hourglass",
        color: "orange",
        task: "Awaiting stock transfers",
      }

    default:
      return {
        label: `${t("common.not_handled")}: (${shipment.status})`,
        icon: "warning",
        color: "white",
      }
  }
}

export function getShipmentStatusName(status: Shipment["status"]): string {
  const dictionary: Record<typeof status, string> = {
    draft: t("resources.shipments.attributes.status.draft"),
    on_hold: t("resources.shipments.attributes.status.on_hold"),
    upcoming: t("resources.shipments.attributes.status.upcoming"),
    packing: t("resources.shipments.attributes.status.packing"),
    picking: t("resources.shipments.attributes.status.picking"),
    ready_to_ship: t("resources.shipments.attributes.status.ready_to_ship"),
    shipped: t("resources.shipments.attributes.status.shipped"),
    cancelled: t("resources.shipments.attributes.status.cancelled"),
    delivered: t("resources.shipments.attributes.status.delivered"),
  }

  return dictionary[status]
}
