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
        permissions: {
          imports: { actions: ['create', 'destroy', 'read', 'update'] }
        }
      })
    )
  })
]
