/// <reference types="vite/client" />

import { Container } from '#ui/atoms/Container'
import { PARAM_KEY } from '.storybook/addon-container/constants'
import { Controls, Description, Primary, Stories, Subtitle, Title } from '@storybook/addon-docs'
import type { Decorator, Parameters } from '@storybook/react'
import React from 'react'
import { worker } from '../src/mocks/browser'

import '../../app-elements/src/styles/global.css'

export const parameters: Parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  layout: 'centered',
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      method: 'alphabetical',
      locales: 'en-US',
      order: [
        'Getting Started', [
          'Welcome',
          'Applications',
          'Custom apps',
          'Token provider',
          'Core SDK provider'
        ],
        'Atoms',
        'Forms', ['react-hook-form'],
        'Hooks',
        'Lists',
        'Composite',
        'Resources',
        'Examples'
      ]
    }
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
    )
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

  if (containerEnabled === true) {
    return (
      <Container minHeight={false}>
        <Story />
      </Container>
    )
  }

  return <Story />
}

export const decorators: Decorator[] = [
  withContainer
]

export const globals = {
  [PARAM_KEY]: true,
}

// Storybook executes this module in both bootstap phase (Node)
// and a story's runtime (browser). However, we cannot call `setupWorker`
// in Node environment, so need to check if we're in a browser.
if (typeof global.process === 'undefined') {
  // Start the mocking when each story is loaded.
  // Repetitive calls to the `.start()` method do not register a new worker,
  // but check whether there's an existing once, reusing it, if so.
  worker.start({
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`
    },
    quiet: import.meta.env.PROD,
    onUnhandledRequest: !import.meta.env.PROD ? (req, reqPrint) => {
      const url = new URL(req.url)
      if (url.hostname === 'mock.localhost') {
        reqPrint.warning()
      }
    } : () => {}
  })
}
