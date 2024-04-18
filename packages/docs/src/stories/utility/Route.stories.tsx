import { createRoute, createTypedRoute } from '#helpers/route'
import { Description, Stories, Subtitle, Title } from '@storybook/blocks'
import { type Meta, type StoryFn } from '@storybook/react'
import { CodeSample } from 'src/components/CodeSample'

/** This list of `route` utilities help to work with routes. */
const setup: Meta = {
  title: 'Utility/Route',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        code: null
      },
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Stories />
        </>
      )
    }
  },
  argTypes: {
    children: {
      table: {
        disable: true
      }
    }
  }
}
export default setup

/**
 * Create a `Route` given a path. Route has the provided `path` and a `makePath` method that helps making a path.
 */
export const CreateRoute: StoryFn = () => {
  return (
    <>
      <CodeSample
        fn={() => {
          // eslint-disable-next-line no-eval
          eval('')

          const route = createRoute('/orders/:id/:opt?/')

          return route.path
        }}
      />
      <CodeSample
        fn={() => {
          // eslint-disable-next-line no-eval
          eval('')

          const route = createRoute('/orders/:id/:opt?/')

          return route.makePath({
            id: 'ABC123'
          })
        }}
      />
      <CodeSample
        fn={() => {
          // eslint-disable-next-line no-eval
          eval('')

          const route = createRoute('/orders/:id/:opt?/')

          return route.makePath({
            id: 'ABC123',
            opt: 'yes'
          })
        }}
      />
    </>
  )
}

export const CreateTypedRoute: StoryFn = () => {
  return (
    <>
      <CodeSample
        code={`
          const route = createTypedRoute<{ status: 'open' | 'close' }>()(
            '/statues/:status/'
          );

          return route.path
        `}
        fn={() => {
          const route = createTypedRoute<{ status: 'open' | 'close' }>()(
            '/statues/:status/'
          )

          return route.path
        }}
      />
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
