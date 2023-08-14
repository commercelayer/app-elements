import { rest } from 'msw'

const restPatch = rest.patch(
  `https://mock.localhost/api/line_items/:id`,
  async (req, res, ctx) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(res(ctx.status(200), ctx.body(`Update ${req.params.id}`)))
      }, 1000)
    })
  }
)

const restDelete = rest.delete(
  `https://mock.localhost/api/line_items/:id`,
  async (req, res, ctx) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(res(ctx.status(200), ctx.body(`Removed ${req.params.id}`)))
      }, 1000)
    })
  }
)

export default [restPatch, restDelete]
