import { HttpResponse, http } from "msw"

/**
 * Mirrors a real `event_stores` response.
 *
 * Two details matter and are easy to get wrong:
 * - `meta` carries **no** `page_count`/`record_count`. The SDK only builds
 *   `meta.cursor` when `page_count` is absent; supplying it would silently
 *   switch the response to offset pagination and drop the cursor.
 * - the next cursor is advertised through `links.next`, as a URL carrying a
 *   `page[after]` param. The SDK parses it out of there, not out of `meta`.
 */

const ORGANIZATION_ID = "mockOrgIdXX"
const TRACE_ID =
  "0000000000000000000000000000000000000000000000000000000000000000"
const APPLICATION_ID = "mockAppIdXX"
const CLIENT_ID = "mock-client-id"

/**
 * The SDK now pins an `apiVersion` and puts it in the path, so every URL is
 * `/api/<version>/…`. Handlers match the segment as `:version` and the links
 * echoed back reuse whatever the request asked for, so a version bump does not
 * need a touch here.
 */
const baseUrl = (version: string) => `https://mock.localhost/api/${version}`

const salesChannel = {
  id: APPLICATION_ID,
  client_id: CLIENT_ID,
  kind: "sales_channel",
  public: true,
  confidential: false,
}

const responseMeta = {
  mode: "test",
  organization_id: ORGANIZATION_ID,
  trace_id: TRACE_ID,
}

const makeEvent = ({
  id,
  resourceId,
  createdAt,
  payload,
  who,
  version,
}: {
  id: string
  resourceId: string
  createdAt: string
  payload: Record<string, { from: unknown; to: unknown }>
  who: Record<string, unknown>
  version: string
}) => ({
  id,
  type: "event_stores",
  links: { self: `${baseUrl(version)}/event_stores/${id}` },
  attributes: {
    resource_type: "orders",
    resource_id: resourceId,
    event: "update",
    payload,
    who,
    created_at: createdAt,
    updated_at: createdAt,
    reference: {},
    reference_origin: {},
    metadata: {},
  },
  meta: responseMeta,
})

const EVENTS_PER_PAGE = 12
const PAGE_COUNT = 3

/**
 * Cursor handed out for each following page. Real ones are opaque base64
 * blobs; these decode to `{"page":N}` so they are readable while debugging.
 */
const PAGE_CURSORS: Record<number, string | undefined> = {
  2: "eyJwYWdlIjoyfQ==",
  3: "eyJwYWdlIjozfQ==",
}

const whoVariants: Array<Record<string, unknown>> = [
  {
    owner: {
      email: "ringo@commercelayer.io",
      first_name: "Ringo",
      last_name: "Starr",
    },
  },
  { application: salesChannel },
  { worker: { id: "mockWorkerId", type: "OrderWorker" } },
]

const payloadVariants: Array<Record<string, { from: unknown; to: unknown }>> = [
  { status: { from: "placed", to: "approved" } },
  { payment_status: { from: "unpaid", to: "authorized" } },
  { fulfillment_status: { from: "unfulfilled", to: "in_progress" } },
  {
    subtotal_amount_cents: { from: 0, to: 900 },
    total_amount_cents: { from: 0, to: 900 },
    updated_at: {
      from: "2026-08-13T07:28:44.018Z",
      to: "2026-08-13T07:28:44.256Z",
    },
  },
]

/**
 * Builds one page of events. Each page spans two days, so the day grouping in
 * the timeline is visible while scrolling rather than only between pages.
 */
const pageEvents = (resourceId: string, page: number, version: string) =>
  Array.from({ length: EVENTS_PER_PAGE }, (_, indexInPage) => {
    const index = (page - 1) * EVENTS_PER_PAGE + indexInPage
    const day =
      13 - (page - 1) * 2 - (indexInPage < EVENTS_PER_PAGE / 2 ? 0 : 1)
    const minute = 59 - indexInPage

    return makeEvent({
      id: `17866061${String(99999 - index).padStart(5, "0")}-0`,
      resourceId,
      createdAt: `2026-08-${String(day).padStart(2, "0")}T07:${String(minute).padStart(2, "0")}:00.000Z`,
      payload: payloadVariants[index % payloadVariants.length] ?? {},
      who: whoVariants[index % whoVariants.length] ?? {},
      version,
    })
  })

/** Resolves the requested page from the cursor, defaulting to the first. */
const pageFromCursor = (cursor: string | null): number => {
  const found = Object.entries(PAGE_CURSORS).find(
    ([, value]) => value === cursor,
  )
  return found != null ? Number(found[0]) : 1
}

const eventStoresList = http.get(
  `https://*/api/:version/:resourceType/:resourceId/event_stores`,
  async ({ request, params }) => {
    const url = new URL(request.url)
    const version = String(params.version)
    const resourceId = String(params.resourceId)
    const page = pageFromCursor(url.searchParams.get("page[after]"))
    const nextCursor = PAGE_CURSORS[page + 1]

    const pageSize = url.searchParams.get("page[size]") ?? "25"
    const nextLink = `${baseUrl(version)}/${String(params.resourceType)}/${resourceId}/event_stores?page%5Bafter%5D=${nextCursor}&page%5Bsize%5D=${pageSize}&sort=-id`

    return HttpResponse.json({
      data: pageEvents(resourceId, page, version),
      meta: responseMeta,
      links: page < PAGE_COUNT ? { next: nextLink } : {},
    })
  },
)

export default [eventStoresList]
