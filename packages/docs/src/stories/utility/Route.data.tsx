import type { StoryFn } from "@storybook/react-vite"
import { CodeSample, type CodeSampleProps } from "src/components/CodeSample"
import { createRoute, createTypedRoute } from "#ui/composite/Routes"

export const createRouteExamples: CodeSampleProps[] = [
  {
    fn: () => {
      // biome-ignore lint/security/noGlobalEval: This is a controlled example.
      eval("")

      const route = createRoute("/orders/:id/:opt?/")

      return route.path
    },
  },
  {
    fn: () => {
      // biome-ignore lint/security/noGlobalEval: This is a controlled example.
      eval("")

      const route = createRoute("/orders/:id/:opt?/")

      return route.makePath({
        id: "ABC123",
      })
    },
  },
  {
    fn: () => {
      // biome-ignore lint/security/noGlobalEval: This is a controlled example.
      eval("")

      const route = createRoute("/orders/:id/:opt?/")

      return route.makePath({
        id: "ABC123",
        opt: "yes",
      })
    },
  },
]

export const createTypedRouteExamples: CodeSampleProps[] = [
  {
    fn: () => {
      const route = createTypedRoute<{ status: "open" | "close" }>()(
        "/statues/:status/",
      )

      return route.path
    },
    code: `
      const route = createTypedRoute<{ status: 'open' | 'close' }>()(
        '/statues/:status/'
      );

      return route.path;
    `,
  },
  {
    fn: () => {
      const route = createTypedRoute<{ status: "open" | "close" }>()(
        "/statues/:status/",
      )

      return route.makePath({
        status: "close",
      })
    },
    code: `
      const route = createTypedRoute<{ status: 'open' | 'close' }>()(
        '/statues/:status/'
      );

      return route.makePath({
        status: 'close'
      });
    `,
  },
]

export const CreateTypedRoute: StoryFn = () => {
  return (
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
        const route = createTypedRoute<{ status: "open" | "close" }>()(
          "/statues/:status/",
        )

        return route.makePath({
          status: "close",
        })
      }}
    />
  )
}
