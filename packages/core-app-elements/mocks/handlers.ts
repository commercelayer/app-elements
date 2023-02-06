import { rest } from 'msw'

export const handlers = [
  rest.get(`https://*.commercelayer.*/oauth/tokeninfo`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: {
          test: true,
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
