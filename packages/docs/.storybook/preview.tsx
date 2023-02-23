import { Container } from '#ui/atoms/Container'
import type { Parameters } from '@storybook/addons'
import type { DecoratorFn } from '@storybook/react'

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
}

export const withContainer: DecoratorFn = (Story, context) => {
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

export const decorators: DecoratorFn[] = [
  withContainer
]
