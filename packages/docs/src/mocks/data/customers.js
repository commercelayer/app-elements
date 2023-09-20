import { rest } from 'msw'

const mockedCustomer = {
  id: 'NMWYhbGorj',
  type: 'customers',
  links: {
    self: 'https://alessani.commercelayer.co/api/customers/NMWYhbGorj'
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
    metadata: {
      first_name: 'John',
      last_name: 'Doe'
    }
  },
  meta: { mode: 'test', organization_id: 'WXlEOFrjnr' }
}

const customer = rest.get(
  `https://mock.localhost/api/customers/NMWYhbGorj`,
  async (req, res, ctx) => {
    return await res(
      ctx.status(200),
      ctx.json({
        data: mockedCustomer
      })
    )
  }
)

const customerUpdate = rest.patch(
  `https://mock.localhost/api/customers/NMWYhbGorj`,
  async (req, res, ctx) => {
    return await res(
      ctx.status(200),
      ctx.json({
        data: mockedCustomer
      })
    )
  }
)

export default [customer, customerUpdate]
