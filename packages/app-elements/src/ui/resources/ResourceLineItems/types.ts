import type { StockLineItem, StockTransfer } from "@commercelayer/sdk"

export type StockLineItemWithStockTransfer = StockLineItem & {
  stockTransfer?: StockTransfer
}
