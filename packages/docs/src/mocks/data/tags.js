// @ts-check

import { HttpResponse, http } from "msw"

const mockedTags = Array(15)
  .fill(null)
  .map((_item, idx) => ({
    id: Math.random().toString().substring(2, 12),
    type: "tags",
    attributes: {
      name: `tag-${idx}`,
      created_at: "2023-03-17T14:07:36.604Z",
      updated_at: "2023-03-17T14:07:36.604Z",
    },
    meta: { mode: "test", organization_id: "WXlEOFrjnr" },
  }))

const customerTags = http.get(
  `https://mock.localhost/api/customers/NMWYhbGorj/tags`,
  async () => {
    return HttpResponse.json({
      data: mockedTags.slice(0, 2),
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
      data: mockedTags.filter((tag) =>
        tag.attributes.name.toLowerCase().includes(name),
      ),
      meta: { record_count: 100, page_count: 10 },
    })
  },
)

export default [customerTags, organizationTags]
