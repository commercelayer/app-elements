import addresses from './data/addresses'
import adjustments from './data/adjustments'
import bundles from './data/bundles'
import customers from './data/customers'
import lineItems from './data/line_items'
import markets from './data/markets'
import orders from './data/orders'
import tags from './data/tags'

/** @type {import('msw').RequestHandler[]} */
export const handlers = [
  ...addresses,
  ...adjustments,
  ...bundles,
  ...customers,
  ...lineItems,
  ...markets,
  ...orders,
  ...tags
]
