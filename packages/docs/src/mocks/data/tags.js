// @ts-check

import { HttpResponse, http } from "msw"

async function hash(/** @type {string} */ target) {
  var buffer = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(target),
  )
  var chars = Array.prototype.map
    .call(new Uint8Array(buffer), (ch) => String.fromCharCode(ch))
    .join("")
  return btoa(chars)
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 10)
}

const mockedTags = Promise.all(
  Array(15)
    .fill(null)
    .map(async (_item, idx) => ({
      id: await hash(`tag-${idx}`),
      type: "tags",
      attributes: {
        name: `tag-${idx}`,
        created_at: "2023-03-17T14:07:36.604Z",
        updated_at: "2023-03-17T14:07:36.604Z",
      },
      meta: { mode: "test", organization_id: "WXlEOFrjnr" },
    })),
)

const customerTags = http.get(
  `https://mock.localhost/api/customers/NMWYhbGorj/tags`,
  async () => {
    return HttpResponse.json({
      data: (await mockedTags).slice(0, 2),
      meta: { record_count: 2, page_count: 1 },
    })
  },
)

const organizationTags = http.get(
  `https://mock.localhost/api/tags`,
  async ({ request }) => {
    const url = new URL(request.url)
    const name =
      url.searchParams.get("filter[q][name_cont]")?.toLowerCase() ?? ""
    return HttpResponse.json({
      data: (await mockedTags).filter((tag) =>
        tag.attributes.name.toLowerCase().includes(name),
      ),
      meta: { record_count: 100, page_count: 10 },
    })
  },
)

export default [customerTags, organizationTags]
