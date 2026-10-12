import { HttpResponse, http } from "msw"

const organizationRetrieve = http.get(
  `https://*/api/:version/organization`,
  async () => {
    return HttpResponse.json({
      data: {
        id: "WXlEOFrjnr",
        type: "organization",
        attributes: {
          name: "Test organization",
          slug: "test-organization",
          tags_max_allowed_number: 10,
        },
      },
    })
  },
)

export default [organizationRetrieve]
