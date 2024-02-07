import { HttpResponse, http } from 'msw'

import countries from './data/countries'
import customers from './data/customers'

export const handlers = [
  http.get(`https://*.commercelayer.*/oauth/tokeninfo`, async ({ request }) => {
    const authToken = request.headers
      .get('authorization')
      ?.replace('Bearer ', '')
      .trim()
    if (authToken == null || authToken === '') {
      return new Response(
        JSON.stringify({
          errors: [
            {
              title: 'Invalid token',
              detail: 'The access token you provided is invalid.',
              code: 'INVALID_TOKEN',
              status: '401'
            }
          ]
        }),
        {
          headers: {
            'Content-Type': 'application/json'
          },
          status: 401
        }
      )
    }

    // we can use a fake text added at the end of the token to simulate live or test mode
    const isFakeLiveToken = Boolean(authToken.includes('fake-signature-live'))

    return HttpResponse.json({
      token: {
        test: !isFakeLiveToken,
        market_ids: [],
        stock_location_ids: [],
        lifespan: 7193
      },
      role: { id: 'xcsdAsdcSX', kind: 'admin', name: 'Admin' },
      application: {
        id: 'jvoDvkEgAx',
        kind: 'integration',
        name: 'MyApplicationCredentials',
        core: false
      },
      owner: {
        id: 'kdRvPYzXfy',
        type: 'User',
        first_name: 'Ringo',
        last_name: 'Starr',
        email: 'user@commercelayer.io',
        owner: false,
        time_zone: 'Europe/Rome'
      },
      permissions: {
        imports: { actions: ['create', 'destroy', 'read', 'update'] }
      },
      accessible_apps: [
        {
          name: 'Orders',
          kind: 'orders',
          core: true
        },
        {
          name: 'Imports',
          kind: 'imports',
          core: true
        }
      ]
    })
  }),

  http.get(`https://*/api/orders`, async ({ request }) => {
    return HttpResponse.json(
      returnEmptyList(new URL(request.url))
        ? {
            data: [],
            meta: { record_count: 0, page_count: 1 }
          }
        : {
            data: Array(10)
              .fill(null)
              .map(() => ({
                id: Math.random().toString().substring(2, 12),
                type: 'orders',
                attributes: {
                  number: Math.floor(Math.random() * 100_000),
                  status: 'placed',
                  payment_status: 'authorized',
                  fulfillment_status: 'unfulfilled',
                  formatted_total_amount: '€39,00',
                  updated_at: '2023-03-17T14:07:36.604Z'
                },
                meta: { mode: 'test', organization_id: 'WXlEOFrjnr' }
              })),
            meta: { record_count: 15, page_count: 2 }
          }
    )
  }),

  ...customers,
  ...countries
]

function returnEmptyList(url: URL): boolean {
  return Boolean(url.searchParams.get('filter[q][emptyList]'))
}
