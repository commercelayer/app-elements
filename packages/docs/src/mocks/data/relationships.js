import { delay, HttpResponse, http } from "msw"

const RECORD_COUNT = 30

/**
 * Any relationship of an order, e.g. `/orders/:id/available_payment_methods`, answered
 * with 30 records paged by the requested `page[size]`, so the pager can be tried out.
 *
 * Keep it after the specific handlers: msw serves the first match, and this
 * one would otherwise swallow `event_stores` and the like.
 */
const orderRelationship = http.get(
  `https://mock.localhost/api/:version/orders/:id/:relationship`,
  async ({ params, request }) => {
    await delay(500)
    const relationship = params.relationship.toString()
    const searchParams = new URL(request.url).searchParams
    const pageNumber = Number(searchParams.get("page[number]") ?? "1")
    const pageSize = Number(searchParams.get("page[size]") ?? "10")
    const from = (pageNumber - 1) * pageSize
    const to = Math.min(from + pageSize, RECORD_COUNT)

    return HttpResponse.json({
      data: Array.from({ length: to - from }, (_, index) => ({
        id: `${relationship.slice(0, 4)}${String(from + index).padStart(6, "0")}`,
        type: relationship,
        attributes: { name: `${relationship} #${from + index + 1}` },
      })),
      meta: {
        record_count: RECORD_COUNT,
        page_count: Math.ceil(RECORD_COUNT / pageSize),
      },
    })
  },
)

export default [orderRelationship]
