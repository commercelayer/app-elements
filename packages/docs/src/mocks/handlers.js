import addresses from "./data/addresses"
import adjustments from "./data/adjustments"
import bundles from "./data/bundles"
import customers from "./data/customers"
import event_stores from "./data/event_stores"
import lineItems from "./data/line_items"
import markets from "./data/markets"
import orders from "./data/orders"
import organization from "./data/organization"
import sku_lists from "./data/sku_lists"
import skus from "./data/skus"
import tags from "./data/tags"

/** @type {import('msw').RequestHandler[]} */
export const handlers = [
  ...addresses,
  ...adjustments,
  ...bundles,
  ...customers,
  ...lineItems,
  ...markets,
  ...orders,
  ...skus,
  ...sku_lists,
  ...tags,
  ...event_stores,
  ...organization,
]
