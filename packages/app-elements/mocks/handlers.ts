import { rest } from 'msw'

export const handlers = [
  rest.get(`https://*.commercelayer.*/oauth/tokeninfo`, (req, res, ctx) => {
    const authToken = req.headers
      .get('authorization')
      ?.replace('Bearer ', '')
      .trim()
    if (authToken == null || authToken === '') {
      return res(
        ctx.status(401),
        ctx.json({
          errors: [
            {
              title: 'Invalid token',
              detail: 'The access token you provided is invalid.',
              code: 'INVALID_TOKEN',
              status: '401'
            }
          ]
        })
      )
    }

    // we can use a fake text added at the end of the token to simulate live or test mode
    const isFakeLiveToken = Boolean(authToken.includes('fake-signature-live'))

    return res(
      ctx.status(200),
      ctx.json({
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
          email: 'ringostarr@domain.com',
          owner: false,
          time_zone: 'Europe/Rome'
        },
        permissions: {
          imports: { actions: ['create', 'destroy', 'read', 'update'] }
        }
      })
    )
  }),

  rest.get(`https://*.commercelayer.*/api/orders`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        returnEmptyList(req.url)
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
    )
  })
]

function returnEmptyList(url: URL): boolean {
  return Boolean(url.searchParams.get('filter[q][emptyList]'))
}
