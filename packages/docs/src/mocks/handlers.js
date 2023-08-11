import bundles from './data/bundles'
import lineItems from './data/line_items'
import markets from './data/markets'
import orders from './data/orders'
import tags from './data/tags'

export const handlers = [
  ...bundles,
  ...lineItems,
  ...markets,
  ...orders,
  ...tags
]
