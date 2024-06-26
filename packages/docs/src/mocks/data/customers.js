// @ts-check

import { HttpResponse, http } from 'msw'

/** @type {import('msw').RequestHandler[]} */
export default [
  ...mockCustomer('OEMAhobdgO'),
  ...mockCustomer('NMWYhbGorj', {
    first_name: 'John',
    last_name: 'Doe',
    age: 35,
    is_vip: true,
    other: { pet: 'cat' }
  }),
  ...mockCustomer('ASEYfdNrwa', {
    hidden: 'true'
  })
]

/** @type {(id: string, metadata?: Record<string, unknown>) => import('msw').RequestHandler[]} */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function mockCustomer(id, metadata = {}) {
  const data = {
    id,
    type: 'customers',
    links: {
      self: `https://myorg.commercelayer.co/api/customers/${id}`
    },
    attributes: {
      email: 'customer@tk.com',
      status: 'repeat',
      has_password: false,
      total_orders_count: 2753,
      created_at: '2022-03-14T09:13:06.633Z',
      updated_at: '2023-07-31T09:13:06.049Z',
      reference: null,
      reference_origin: null,
      metadata
    },
    meta: { mode: 'test', organization_id: 'WXlEOFrjnr' }
  }

  return [
    http.get(`https://mock.localhost/api/customers/${id}`, async () => {
      return HttpResponse.json({
        data
      })
    }),
    http.patch(`https://mock.localhost/api/customers/${id}`, async () => {
      return HttpResponse.json({
        data
      })
    })
  ]
}
