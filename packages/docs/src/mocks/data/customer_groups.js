import { HttpResponse, http } from "msw"

const mockedCustomerGroups = [
  {
    id: "rlEPzheRgO",
    type: "customer_groups",
    links: {
      self: "https://mock.localhost/api/customer_groups/rlEPzheRgO",
    },
    attributes: {
      name: "VIP",
      created_at: "2022-08-23T09:59:25.940Z",
      updated_at: "2022-08-23T09:59:25.940Z",
      reference: "",
      reference_origin: "",
      metadata: {},
    },
    meta: { mode: "test", organization_id: "WXlEOFrjnr" },
  },
  {
    id: "dlQbPhNNop",
    type: "customer_groups",
    links: {
      self: "https://mock.localhost/api/customer_groups/dlQbPhNNop",
    },
    attributes: {
      name: "Wholesale",
      created_at: "2022-03-11T09:40:49.000Z",
      updated_at: "2023-03-13T13:30:32.184Z",
      reference: "customer_group_1",
      reference_origin: "CLI",
      metadata: {},
    },
    meta: { mode: "test", organization_id: "WXlEOFrjnr" },
  },
  {
    id: "AlRevhXQga",
    type: "customer_groups",
    links: {
      self: "https://mock.localhost/api/customer_groups/AlRevhXQga",
    },
    attributes: {
      name: "Employees",
      created_at: "2022-05-13T12:27:05.075Z",
      updated_at: "2022-05-13T12:27:05.075Z",
      reference: "",
      reference_origin: "",
      metadata: {},
    },
    meta: { mode: "test", organization_id: "WXlEOFrjnr" },
  },
]

const singleCustomerGroup = http.get(
  `https://mock.localhost/api/customer_groups/:customerGroupId`,
  async ({ params }) => {
    const customerGroup = mockedCustomerGroups.find(
      (item) => item.id === params.customerGroupId,
    )
    return HttpResponse.json({
      data: customerGroup ?? mockedCustomerGroups[0],
    })
  },
)

const organizationCustomerGroups = http.get(
  `https://mock.localhost/api/customer_groups`,
  async ({ request }) => {
    const url = new URL(request.url)
    const name =
      url.searchParams.get("filter[q][name_i_cont]")?.toLowerCase() ?? ""
    const idIn = url.searchParams.get("filter[q][id_in]")

    const filtered = mockedCustomerGroups.filter((customerGroup) => {
      if (idIn != null) {
        return idIn.split(",").includes(customerGroup.id)
      }
      return customerGroup.attributes.name.toLowerCase().includes(name)
    })

    return HttpResponse.json({
      data: filtered,
      meta: { record_count: filtered.length, page_count: 1 },
    })
  },
)

export default [singleCustomerGroup, organizationCustomerGroups]
