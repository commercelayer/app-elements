import { AssertionError } from "node:assert"
import { server } from "./server"

beforeAll(() => {
  server.listen({
    onUnhandledRequest(request, print) {
      const url = new URL(request.url)

      if (url.href === "https://core.commercelayer.io/api/public/resources") {
        return
      }

      if (
        url.href ===
        "https://core.commercelayer.io/api/public/schemas/order_rules"
      ) {
        return
      }

      // Otherwise, print a warning for any unhandled request.
      print.error()
    },
  })
})
afterAll(() => {
  server.close()
})
afterEach(() => {
  server.resetHandlers()
})

process.env.TZ = "UTC"

declare global {
  export function assertToBeDefined<T>(val: T): asserts val is NonNullable<T>
}

global.assertToBeDefined = <T>(
  val: T,
): asserts val is Exclude<T, undefined> => {
  if (val === undefined || val === null) {
    throw new AssertionError({
      message: `expected undefined not to be undefined`,
      stackStartFn: global.assertToBeDefined,
    })
  }
}
