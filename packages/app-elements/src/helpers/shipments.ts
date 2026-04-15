import type { Shipment } from "@commercelayer/sdk"

export function isAllStockTransfersCancelled(shipment: Shipment) {
  const stockTransfers = shipment.stock_transfers ?? []

  return (
    stockTransfers.length > 0 &&
    stockTransfers.every(
      (stockTransfer) => stockTransfer.status === "cancelled",
    )
  )
}
