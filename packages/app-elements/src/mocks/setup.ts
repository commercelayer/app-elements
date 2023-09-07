import { AssertionError } from 'assert'
import { server } from './server'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})
afterAll(() => {
  server.close()
})
afterEach(() => {
  server.resetHandlers()
})

declare global {
  export function assertToBeDefined<T>(val: T): asserts val is NonNullable<T>
}

global.assertToBeDefined = <T>(
  val: T
): asserts val is Exclude<T, undefined> => {
  if (val === undefined || val === null) {
    throw new AssertionError({
      message: `expected undefined not to be undefined`,
      stackStartFn: global.assertToBeDefined
    })
  }
}
