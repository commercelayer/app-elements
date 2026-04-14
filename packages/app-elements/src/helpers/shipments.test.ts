import type { Shipment } from "@commercelayer/sdk"
import { presetResourceListItem } from "#ui/resources/ResourceListItem/ResourceListItem.mocks"
import { isAllStockTransfersCancelled } from "./shipments"

describe("isAllStockTransfersCancelled", () => {
  test("returns false when stock_transfers is an empty array", () => {
    expect(
      isAllStockTransfersCancelled(presetResourceListItem.shipmentOnHold),
    ).toBe(false)
  })

  test("returns true when all stock transfers are cancelled", () => {
    expect(
      isAllStockTransfersCancelled(
        presetResourceListItem.shipmentStockTransferCancelled,
      ),
    ).toBe(true)
  })

  test("returns false when stock_transfers is undefined", () => {
    expect(
      isAllStockTransfersCancelled(presetResourceListItem.shipmentUpcoming),
    ).toBe(false)
  })

  test("returns false when not all stock transfers are cancelled", () => {
    const shipment: Shipment = {
      ...presetResourceListItem.shipmentStockTransferCancelled,
      stock_transfers: [
        ...(presetResourceListItem.shipmentStockTransferCancelled
          .stock_transfers ?? []),
        {
          id: "abc123",
          type: "stock_transfers",
          status: "upcoming",
          quantity: 1,
          created_at: "2026-01-21T14:37:15.049Z",
          updated_at: "2026-01-21T14:37:15.049Z",
        },
      ],
    }
    expect(isAllStockTransfersCancelled(shipment)).toBe(false)
  })
})
