import { HttpResponse, delay, http } from 'msw'

const restPost = http.post(
  `https://mock.localhost/api/adjustments`,
  async () => {
    await delay(1000)
    return HttpResponse.json(adjustment)
  }
)

const restGet = http.get(
  `https://mock.localhost/api/adjustments/QWOaGhpKbd`,
  async () => {
    await delay(1000)
    return HttpResponse.json(adjustment)
  }
)

const restPatch = http.patch(
  `https://mock.localhost/api/adjustments/QWOaGhpKbd`,
  async () => {
    await delay(1000)
    return HttpResponse.json(adjustment)
  }
)

const restDelete = http.delete(
  `https://mock.localhost/api/adjustments/QWOaGhpKbd`,
  async () => {
    await delay(1000)
    return HttpResponse.json(adjustment)
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
