import { createRoute, createTypedRoute } from '#ui/composite/Routes'
import { type StoryFn } from '@storybook/react'
import { CodeSample, type CodeSampleProps } from 'src/components/CodeSample'

export const createRouteExamples: CodeSampleProps[] = [
  {
    fn: () => {
      // eslint-disable-next-line no-eval
      eval('')

      const route = createRoute('/orders/:id/:opt?/')

      return route.path
    }
  },
  {
    fn: () => {
      // eslint-disable-next-line no-eval
      eval('')

      const route = createRoute('/orders/:id/:opt?/')

      return route.makePath({
        id: 'ABC123'
      })
    }
  },
  {
    fn: () => {
      // eslint-disable-next-line no-eval
      eval('')

      const route = createRoute('/orders/:id/:opt?/')

      return route.makePath({
        id: 'ABC123',
        opt: 'yes'
      })
    }
  }
]

export const createTypedRouteExamples: CodeSampleProps[] = [
  {
    fn: () => {
      const route = createTypedRoute<{ status: 'open' | 'close' }>()(
        '/statues/:status/'
      )

      return route.path
    },
    code: `
      const route = createTypedRoute<{ status: 'open' | 'close' }>()(
        '/statues/:status/'
      );

      return route.path;
    `
  },
  {
    fn: () => {
      const route = createTypedRoute<{ status: 'open' | 'close' }>()(
        '/statues/:status/'
      )

      return route.makePath({
        status: 'close'
      })
    },
    code: `
      const route = createTypedRoute<{ status: 'open' | 'close' }>()(
        '/statues/:status/'
      );

      return route.makePath({
        status: 'close'
      });
    `
  }
]

export const CreateTypedRoute: StoryFn = () => {
  return (
    <>
      <CodeSample
        code={`
          const route = createTypedRoute<{ status: 'open' | 'close' }>()(
            '/statues/:status/'
          );

          return route.makePath({
            status: 'close'
          })
        `}
        fn={() => {
          const route = createTypedRoute<{ status: 'open' | 'close' }>()(
            '/statues/:status/'
          )

          return route.makePath({
            status: 'close'
          })
        }}
      />
    </>
  )
}
