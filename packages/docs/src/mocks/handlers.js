import bundles from './data/bundles'
import markets from './data/markets'
import orders from './data/orders'
import tags from './data/tags'

export const handlers = [...bundles, ...markets, ...orders, ...tags]
