import type { Shipment } from "@commercelayer/sdk"
import { isEmpty } from "lodash-es"
import { getShipmentDisplayStatus } from "#dictionaries/shipments"
import { formatDate } from "#helpers/date"
import { isAllStockTransfersCancelled } from "#helpers/shipments"
import { RadialProgress } from "#ui/atoms/RadialProgress"
import {
  ListItemDescription,
  ListItemIcon,
} from "#ui/resources/ResourceListItem/common"
import type { ResourceToProps } from "../types"

export const shipmentToProps: ResourceToProps<Shipment> = ({
  resource,
  user,
  t,
}) => {
  const stockTransfersToBeAwaited =
    resource.stock_transfers?.filter(
      (stockTransfer) =>
        stockTransfer.status !== "completed" &&
        stockTransfer.status !== "cancelled" &&
        stockTransfer.status !== "draft",
    ) ?? []

  const awaitingStockTransfer = stockTransfersToBeAwaited.length > 0
  const displayStatus = getShipmentDisplayStatus(
    resource,
    awaitingStockTransfer,
  )
  const reference = isEmpty(resource.reference)
    ? ""
    : `Ref. ${resource.reference} · `
  const info =
    resource.stock_location?.name != null
      ? `${t("common.from")} ${resource.stock_location.name} `
      : resource.shipping_method?.name != null
        ? `${resource.shipping_method.name} `
        : ""
  const number = resource.number != null ? `#${resource.number}` : ""

  return {
    name: `${t("resources.shipments.name")} ${number}`,
    description: (
      <ListItemDescription
        displayStatus={displayStatus}
        date={formatDate({
          format: "full",
          isoDate: resource.updated_at,
          timezone: user?.timezone,
          locale: user?.locale,
        })}
        additionalInfos={`${reference}${info}`}
        additionalSuffix={
          isAllStockTransfersCancelled(resource)
            ? t("apps.shipments.details.stock_transfer_cancelled", {
                count: resource.stock_transfers?.length ?? 0,
              })
            : undefined
        }
      />
    ),
    icon:
      !awaitingStockTransfer && resource.status === "upcoming" ? (
        <RadialProgress icon="truck" />
      ) : (
        <ListItemIcon icon={displayStatus.icon} color={displayStatus.color} />
      ),
  }
}
