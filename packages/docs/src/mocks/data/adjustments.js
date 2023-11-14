import { rest } from 'msw'

const restPost = rest.post(
  `https://mock.localhost/api/adjustments`,
  async (req, res, ctx) => {
    return await res(ctx.status(200), ctx.delay(1000), ctx.json(adjustment))
  }
)

const restGet = rest.get(
  `https://mock.localhost/api/adjustments/QWOaGhpKbd`,
  async (req, res, ctx) => {
    return await res(ctx.status(200), ctx.delay(1000), ctx.json(adjustment))
  }
)

const restPatch = rest.patch(
  `https://mock.localhost/api/adjustments/QWOaGhpKbd`,
  async (req, res, ctx) => {
    return await res(ctx.status(200), ctx.delay(1000), ctx.json(adjustment))
  }
)

const restDelete = rest.delete(
  `https://mock.localhost/api/adjustments/QWOaGhpKbd`,
  async (req, res, ctx) => {
    return await res(ctx.status(200), ctx.delay(1000), ctx.json(adjustment))
  }
)

const adjustment = {
  data: {
    id: 'QWOaGhpKbd',
    type: 'adjustments',
    links: {
      self: 'https://mock.localhost/api/adjustments/QWOaGhpKbd'
    },
    attributes: {
      name: 'Manual adjustment',
      currency_code: 'EUR',
      amount_cents: -100,
      amount_float: -1.0,
      formatted_amount: '-€1,00',
      created_at: '2023-10-20T14:11:46.083Z',
      updated_at: '2023-10-20T14:11:46.083Z',
      reference: null,
      reference_origin: 'app-orders--manual-adjustment',
      metadata: {}
    },
    relationships: {
      versions: {
        links: {
          self: 'https://mock.localhost/api/adjustments/QWOaGhpKbd/relationships/versions',
          related: 'https://mock.localhost/api/adjustments/QWOaGhpKbd/versions'
        }
      }
    },
    meta: {
      mode: 'test',
      organization_id: 'WXlEOFrjnr'
    }
  }
}

export default [restGet, restPost, restPatch, restDelete]
