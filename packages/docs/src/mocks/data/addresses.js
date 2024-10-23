import { HttpResponse, http } from 'msw'

const mockedAddress = {
  type: 'addresses',
  attributes: {
    business: true,
    first_name: null,
    last_name: null,
    company: 'The Brand SRL',
    full_name: 'The Brand SRL',
    line_1: 'Via Morte Nera 123',
    line_2: null,
    city: 'Firenze',
    zip_code: '50123',
    state_code: 'FI',
    country_code: 'IT',
    phone: '+39 055 1234567890',
    full_address:
      'Via Morte Nera 123, 50123 Firenze FI (IT) +39 055 1234567890',
    name: 'The Brand SRL, Via Morte Nera 123, 50123 Firenze FI (IT) +39 055 1234567890',
    email: 'touch@example.com',
    notes: null,
    lat: null,
    lng: null,
    is_localized: false,
    is_geocoded: false,
    provider_name: null,
    map_url: null,
    static_map_url: null,
    billing_info: null,
    created_at: '2022-02-24T14:08:14.712Z',
    updated_at: '2022-02-24T14:08:14.712Z',
    reference: 'address_1',
    reference_origin: 'CLI',
    metadata: {}
  },
  meta: {
    mode: 'test',
    organization_id: 'WXlEOFrjnr'
  }
}

const restPost = http.post('https://mock.localhost/api/addresses', async () => {
  return HttpResponse.json({
    data: {
      ...mockedAddress,
      id: 'zzZYuDJVXW'
    }
  })
})

const restPatch = ['aaZYuDJVXW', 'bbZYuDJVXW', 'ccZYuDJVXW'].map((id) =>
  http.patch(`https://mock.localhost/api/addresses/${id}`, async () => {
    return HttpResponse.json({
      data: {
        ...mockedAddress,
        id
      }
    })
  })
)

const apiErrorPatch = http.patch(
  `https://mock.localhost/api/addresses/ddZYuDJVXW`,
  async () => {
    return HttpResponse.json(
      {
        errors: [
          {
            title: "can't be blank",
            detail: "first_name - can't be blank",
            code: 'VALIDATION_ERROR',
            source: {
              pointer: '/data/attributes/first_name'
            },
            status: '422',
            meta: {
              error: 'blank'
            }
          },
          {
            title: "can't be blank",
            detail: "last_name - can't be blank",
            code: 'VALIDATION_ERROR',
            source: {
              pointer: '/data/attributes/last_name'
            },
            status: '422',
            meta: {
              error: 'blank'
            }
          }
        ]
      },
      { status: 422 }
    )
  }
)

// const restPatch = ['aaZYuDJVXW', 'bbZYuDJVXW', 'ccZYuDJVXW'].map((id) =>
//   http.patch(
//     `https://mock.localhost/api/addresses/${id}`,
//     async ({ request }) => {
//       const json = await request.json()
//       console.log(json.data.attributes)
//       return HttpResponse.json({
//         data: {
//           ...mockedAddress,
//           id,
//           attributes: {
//             ...mockedAddress.attributes,
//             ...json.data.attributes
//           }
//         }
//       })
//     }
//   )
// )

export default [...restPatch, restPost, apiErrorPatch]
