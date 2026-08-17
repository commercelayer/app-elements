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

describe("event_stores mock", () => {
  it("advertises a next cursor on the first page", async () => {
    const page = await sdkClient.orders.event_stores("NgojhKoyYN", {
      pageSize: 25,
      sort: { id: "desc" },
    })

    expect(page).toHaveLength(2)
    expect(page.meta.cursor?.next?.after).toBeTypeOf("string")
  })

  it("returns the last page without a next cursor", async () => {
    const firstPage = await sdkClient.orders.event_stores("NgojhKoyYN", {
      pageSize: 25,
      sort: { id: "desc" },
    })
    const cursor = firstPage.meta.cursor?.next?.after
    assertToBeDefined(cursor)

    const lastPage = await sdkClient.orders.event_stores("NgojhKoyYN", {
      pageSize: 25,
      sort: { id: "desc" },
      pageAfter: cursor,
    })

    expect(lastPage).toHaveLength(1)
    expect(lastPage.meta.cursor?.next?.after).toBeUndefined()
  })

  it("scopes the events to the requested resource", async () => {
    const page = await sdkClient.orders.event_stores("AnotherOrder", {
      pageSize: 25,
    })

    expect(page.first()?.resource_id).toBe("AnotherOrder")
  })
})
