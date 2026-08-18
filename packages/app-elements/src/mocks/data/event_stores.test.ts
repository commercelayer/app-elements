import CommerceLayer from "@commercelayer/sdk"

/**
 * The `event_stores` mock is only useful if the SDK reads a cursor out of it.
 * That hinges on the response omitting `page_count` and advertising the next
 * page through `links.next`. Get either wrong and the SDK silently falls back
 * to offset pagination, reporting no cursor at all while every other
 * assertion still passes.
 */
const sdkClient = CommerceLayer({
  accessToken: "1234",
  organization: "mock",
  domain: "localhost",
})

const fetchPage = async (pageAfter?: string) =>
  await sdkClient.orders.event_stores("NgojhKoyYN", {
    pageSize: 25,
    sort: { id: "desc" },
    pageAfter,
  })

describe("event_stores mock", () => {
  it("advertises a next cursor on the first page", async () => {
    const page = await fetchPage()

    expect(page.length).toBeGreaterThan(0)
    expect(page.meta.cursor?.next?.after).toBeTypeOf("string")
  })

  it("walks every page and stops without a cursor on the last", async () => {
    const seen: string[] = []
    let cursor: string | undefined
    let pages = 0

    do {
      const page = await fetchPage(cursor)
      seen.push(...page.map((event) => event.id))
      cursor = page.meta.cursor?.next?.after
      pages += 1
      // Guards against a mock that hands out the same cursor forever.
      expect(pages).toBeLessThanOrEqual(10)
    } while (cursor != null)

    expect(pages).toBeGreaterThan(1)
    // Enough records to actually overflow a panel and exercise infinite scroll.
    expect(seen.length).toBeGreaterThanOrEqual(24)
    expect(new Set(seen).size).toBe(seen.length)
  })

  it("scopes the events to the requested resource", async () => {
    const page = await sdkClient.orders.event_stores("AnotherOrder", {
      pageSize: 25,
    })

    expect(page.first()?.resource_id).toBe("AnotherOrder")
  })
})
