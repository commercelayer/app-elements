// @ts-check

import { HttpResponse, http } from "msw"

/**
 * Mirrors a real `event_stores` response.
 *
 * Two details matter and are easy to get wrong:
 * - `meta` carries no `page_count`/`record_count`. The SDK only builds
 *   `meta.cursor` when `page_count` is absent; supplying it would silently
 *   switch the response to offset pagination and drop the cursor.
 * - the next cursor is advertised through `links.next`, as a URL carrying a
 *   `page[after]` param. The SDK parses it out of there, not out of `meta`.
 *
 * Kept in sync with `app-elements/src/mocks/data/event_stores.ts`, which serves
 * the same payload to the unit tests.
 */

const ORGANIZATION_ID = "mockOrgIdXX"
const TRACE_ID =
  "0000000000000000000000000000000000000000000000000000000000000000"
const APPLICATION_ID = "mockAppIdXX"
const CLIENT_ID = "mock-client-id"
const BASE_URL = "https://mock.localhost/api"

/** Opaque cursor pointing at the second page. Real ones are base64 blobs. */
const SECOND_PAGE_CURSOR = "eyJpZCI6IjE3ODY2MDYxMjQyNTktMCJ9"

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

const makeEvent = (
  /** @type {{ id: string, resourceId: string, createdAt: string, payload: object, who: object }} */
  { id, resourceId, createdAt, payload, who },
) => ({
  id,
  type: "event_stores",
  links: { self: `${BASE_URL}/event_stores/${id}` },
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

const firstPage = (/** @type {string} */ resourceId) => [
  makeEvent({
    id: "1786606128871-0",
    resourceId,
    createdAt: "2026-08-13T07:28:48.867Z",
    payload: {
      updated_at: {
        from: "2026-08-13T07:28:44.284Z",
        to: "2026-08-13T07:28:48.867Z",
      },
      cart_url: {
        from: null,
        to: `https://mock.localhost/cart/${resourceId}`,
      },
    },
    who: {
      owner: {
        email: "ringo@commercelayer.io",
        first_name: "Ringo",
        last_name: "Starr",
      },
    },
  }),
  makeEvent({
    id: "1786606124259-0",
    resourceId,
    createdAt: "2026-08-13T07:28:44.256Z",
    payload: {
      subtotal_amount_cents: { from: 0, to: 900 },
      total_tax_amount_cents: { from: null, to: 0 },
      subtotal_tax_amount_cents: { from: null, to: 0 },
      total_amount_cents: { from: 0, to: 900 },
      updated_at: {
        from: "2026-08-13T07:28:44.018Z",
        to: "2026-08-13T07:28:44.256Z",
      },
    },
    who: { application: salesChannel },
  }),
]

const secondPage = (/** @type {string} */ resourceId) => [
  makeEvent({
    id: "1786606120001-0",
    resourceId,
    createdAt: "2026-08-12T09:21:40.000Z",
    payload: { number: { from: null, to: 2817081 } },
    who: { worker: { id: "mockWorkerId", type: "OrderWorker" } },
  }),
]

const eventStoresList = http.get(
  `https://*/api/:resourceType/:resourceId/event_stores`,
  async ({ request, params }) => {
    const url = new URL(request.url)
    const resourceId = String(params.resourceId)
    const isSecondPage =
      url.searchParams.get("page[after]") === SECOND_PAGE_CURSOR

    const pageSize = url.searchParams.get("page[size]") ?? "25"
    const nextLink = `${BASE_URL}/${String(params.resourceType)}/${resourceId}/event_stores?page%5Bafter%5D=${SECOND_PAGE_CURSOR}&page%5Bsize%5D=${pageSize}&sort=-id`

    return HttpResponse.json({
      data: isSecondPage ? secondPage(resourceId) : firstPage(resourceId),
      meta: responseMeta,
      links: isSecondPage ? {} : { next: nextLink },
    })
  },
)

export default [eventStoresList]
