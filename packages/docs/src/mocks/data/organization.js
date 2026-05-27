import { delay, HttpResponse, http } from "msw"

const restGet = http.get(
  `https://mock.localhost/api/organization`,
  async () => {
    await delay(1000)
    return HttpResponse.json({
      data: {
        id: "mQ7vR2nLp8",
        type: "organizations",
        links: {
          self: "https://mock.localhost/api/organization",
        },
        attributes: {
          name: "Mock Organization",
          slug: "mock-organization",
          support_email: "development@commercelayer.io",
          config: {
            api: {
              stream: {
                scope: "both",
              },
            },
          },
          metadata: {},
        },
      },
    })
  },
)

export default [restGet]
