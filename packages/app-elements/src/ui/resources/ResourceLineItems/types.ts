import { type StockLineItem, type StockTransfer } from '@commercelayer/sdk'

export type StockLineItemWithStockTransfer = StockLineItem & {
  stockTransfer?: StockTransfer
}
