import { HttpResponse, http } from "msw"

/**
 * Mock for the Metrics API `search` endpoint.
 *
 * The real endpoint is cursor-paginated: every response carries the cursor that
 * opens the *next* page (or `null` on the last one) plus the total
 * `record_count`. Here the cursor simply encodes the offset, which is enough to
 * exercise both infinite scrolling and prev/next pagination.
 */

const TOTAL_RECORDS = 47

const markets = ["Europe", "US", "New York", "Italy"]
const currencies = ["EUR", "USD", "JPY", "EUR"]
const people = [
  ["Michael", "Jordan"],
  ["Darth", "Vader"],
  ["Ada", "Lovelace"],
  ["Grace", "Hopper"],
]
const countries = ["IT", "US", "US", "IT"]
// status, payment_status, fulfillment_status — only combinations the order
// status dictionary actually maps, so every row renders a real badge
const statuses = [
  ["placed", "authorized", "unfulfilled"], // awaiting approval
  ["approved", "paid", "in_progress"], // in progress
  ["approved", "paid", "fulfilled"], // fulfilled
  ["cancelled", "voided", "unfulfilled"], // cancelled
  ["approved", "authorized", "in_progress"], // in progress
]

/** Deterministic dataset, so stories and screenshots stay stable. */
const allOrders = Array.from({ length: TOTAL_RECORDS }, (_, index) => {
  const [status, paymentStatus, fulfillmentStatus] =
    statuses[index % statuses.length]
  const [firstName, lastName] = people[index % people.length]
  // spread the dates so sorting is visible
  const day = String((index % 28) + 1).padStart(2, "0")
  const placedAt = `2024-06-${day}T${String(index % 24).padStart(2, "0")}:45:00.000Z`

  return {
    id: `metrics-order-${index}`,
    type: "orders",
    number: `${19346512 + index}`,
    status,
    payment_status: paymentStatus,
    fulfillment_status: fulfillmentStatus,
    currency_code: currencies[index % currencies.length],
    // the metrics API returns amounts in units, not cents
    total_amount: 49.99 + index * 37.5,
    total_amount_with_taxes: 49.99 + index * 37.5,
    placed_at: placedAt,
    updated_at: placedAt,
    created_at: placedAt,
    guest: false,
    tax_included: true,
    market: {
      id: `market-${index % markets.length}`,
      name: markets[index % markets.length],
      number: `${350 + (index % markets.length)}`,
    },
    billing_address: {
      first_name: firstName,
      last_name: lastName,
      country_code: countries[index % countries.length],
      city: "Cogorno",
      state_code: "GE",
      zip_code: "16030",
    },
  }
})

/** `order.placed_at` -> `placed_at` */
const toFieldName = (sortBy) => String(sortBy ?? "").replace(/^order\./, "")

const parseOffset = (cursor) => {
  const offset = Number(String(cursor ?? "").replace("offset-", ""))
  return Number.isFinite(offset) && offset > 0 ? offset : 0
}

const metricsOrdersSearch = http.post(
  "https://mock.localhost/metrics/orders/search",
  async ({ request }) => {
    const body = await request.json()
    const search = body?.search ?? {}
    const limit = search.limit ?? 25
    const offset = parseOffset(search.cursor)

    const field = toFieldName(search.sort_by)
    const direction = search.sort === "asc" ? 1 : -1

    const sorted =
      field === ""
        ? [...allOrders]
        : [...allOrders].sort((a, b) => {
            const left = a[field]
            const right = b[field]
            if (left === right) return 0
            return (left > right ? 1 : -1) * direction
          })

    const page = sorted.slice(offset, offset + limit)
    const nextOffset = offset + limit

    return HttpResponse.json({
      data: page,
      meta: {
        pagination: {
          record_count: TOTAL_RECORDS,
          cursor: nextOffset < TOTAL_RECORDS ? `offset-${nextOffset}` : null,
        },
      },
    })
  },
)

export default [metricsOrdersSearch]
