import { rest } from 'msw'

const restPatch = rest.patch(
  `https://mock.localhost/api/line_items/:id`,
  async (req, res, ctx) => {
    return await res(ctx.status(200), ctx.body(`Update ${req.params.id}`))
  }
)

const restDelete = rest.delete(
  `https://mock.localhost/api/line_items/:id`,
  async (req, res, ctx) => {
    return await res(ctx.status(200), ctx.body(`Removed ${req.params.id}`))
  }
)

export default [restPatch, restDelete]
