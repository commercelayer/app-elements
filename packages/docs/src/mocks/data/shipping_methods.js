import { HttpResponse, http } from "msw"

const mockedShippingMethods = [
  {
    id: "BdlQvFgYyw",
    type: "shipping_methods",
    links: {
      self: "https://mock.localhost/api/shipping_methods/BdlQvFgYyw",
    },
    attributes: {
      name: "Standard Shipping",
      scheme: "flat",
      currency_code: "EUR",
      price_amount_cents: 700,
      formatted_price_amount: "€7,00",
      created_at: "2022-03-11T09:40:49.000Z",
      updated_at: "2023-03-13T13:30:32.184Z",
      reference: "standard",
      reference_origin: "",
      metadata: {},
    },
    meta: { mode: "test", organization_id: "WXlEOFrjnr" },
  },
  {
    id: "NOVmgFOnxw",
    type: "shipping_methods",
    links: {
      self: "https://mock.localhost/api/shipping_methods/NOVmgFOnxw",
    },
    attributes: {
      name: "Express Delivery",
      scheme: "flat",
      currency_code: "EUR",
      price_amount_cents: 1200,
      formatted_price_amount: "€12,00",
      created_at: "2022-03-11T09:40:49.000Z",
      updated_at: "2023-03-13T13:30:32.184Z",
      reference: "express",
      reference_origin: "",
      metadata: {},
    },
    meta: { mode: "test", organization_id: "WXlEOFrjnr" },
  },
  {
    id: "kOxgXFKmwj",
    type: "shipping_methods",
    links: {
      self: "https://mock.localhost/api/shipping_methods/kOxgXFKmwj",
    },
    attributes: {
      name: "Store Pickup",
      scheme: "flat",
      currency_code: "EUR",
      price_amount_cents: 0,
      formatted_price_amount: "€0,00",
      created_at: "2022-05-13T12:27:05.075Z",
      updated_at: "2022-05-13T12:27:05.075Z",
      reference: "pickup",
      reference_origin: "",
      metadata: {},
    },
    meta: { mode: "test", organization_id: "WXlEOFrjnr" },
  },
]

const singleShippingMethod = http.get(
  `https://mock.localhost/api/:version/shipping_methods/:shippingMethodId`,
  async ({ params }) => {
    const shippingMethod = mockedShippingMethods.find(
      (item) => item.id === params.shippingMethodId,
    )
    return HttpResponse.json({
      data: shippingMethod ?? mockedShippingMethods[0],
    })
  },
)

const organizationShippingMethods = http.get(
  `https://mock.localhost/api/:version/shipping_methods`,
  async ({ request }) => {
    const url = new URL(request.url)
    const name =
      url.searchParams.get("filter[q][name_i_cont]")?.toLowerCase() ?? ""
    const idIn = url.searchParams.get("filter[q][id_in]")

    const filtered = mockedShippingMethods.filter((shippingMethod) => {
      if (idIn != null) {
        return idIn.split(",").includes(shippingMethod.id)
      }
      return shippingMethod.attributes.name.toLowerCase().includes(name)
    })

    return HttpResponse.json({
      data: filtered,
      meta: { record_count: filtered.length, page_count: 1 },
    })
  },
)

export default [singleShippingMethod, organizationShippingMethods]
