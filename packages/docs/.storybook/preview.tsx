/// <reference types="vite/client" />

import { PARAM_KEY } from ".storybook/addon-container/constants"
import {
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from "@storybook/addon-docs/blocks"
import type { Decorator, Parameters } from "@storybook/react-vite"
import React, { StrictMode } from "react"
import { I18NProvider } from "#providers/I18NProvider"
import { Container } from "#ui/atoms/Container"
import { worker } from "../src/mocks/browser"

import "../../app-elements/src/styles/vendor.css"
import "../src/styles/global.css"

export const parameters: Parameters = {
  layout: "centered",
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    values: [
      {
        name: "overlay",
        value: "#F8F8F8",
      },
    ],
  },
  options: {
    storySort: {
      method: "alphabetical",
      locales: "en-US",
      order: [
        "Getting Started",
        [
          "Welcome",
          "Applications",
          "Custom apps",
          "Token provider",
          "Core SDK provider",
        ],
        "Atoms",
        "Forms",
        ["react-hook-form"],
        "Hooks",
        "Lists",
        "Composite",
        "Resources",
        "Examples",
      ],
    },
  },
  docs: {
    page: () => (
      <React.Fragment>
        <Title />
        <Subtitle />
        <Description />
        <Primary />
        <Controls />
        <Stories includePrimary={false} />
      </React.Fragment>
    ),
    // source: {
    //   transform: (input: string) =>
    //     prettier.format(input, {
    //       parser: 'babel',
    //       plugins: [prettierBabel]
    //     }),
    // },
  },
}

export const withContainer: Decorator = (Story, context) => {
  const { containerEnabled } = context.globals
  if (containerEnabled === true && context.parameters.layout !== "fullscreen") {
    return (
      <Container minHeight={false}>
        <Story />
      </Container>
    )
  }

  return <Story />
}

export const withLocale: Decorator = (Story) => {
  const locale = "en-US"
  return (
    <I18NProvider enforcedLocaleCode={locale}>
      <Story />
    </I18NProvider>
  )
}

export const withStrictMode: Decorator = (Story) => {
  return (
    <StrictMode>
      <Story />
    </StrictMode>
  )
}

export const decorators: Decorator[] = [
  withStrictMode,
  withLocale,
  withContainer,
]

// Storybook executes this module in both bootstap phase (Node)
// and a story's runtime (browser). However, we cannot call `setupWorker`
// in Node environment, so need to check if we're in a browser.
if (typeof global.process === "undefined") {
  // Start the mocking when each story is loaded.
  // Repetitive calls to the `.start()` method do not register a new worker,
  // but check whether there's an existing once, reusing it, if so.
  worker.start({
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
    quiet: import.meta.env.PROD,
    onUnhandledRequest: !import.meta.env.PROD
      ? (req, reqPrint) => {
          const url = new URL(req.url)
          if (url.hostname === "mock.localhost") {
            reqPrint.warning()
          }
        }
      : () => {},
  })
}

export const initialGlobals = {
  [PARAM_KEY]: true,
}
export const tags = ["autodocs"]
