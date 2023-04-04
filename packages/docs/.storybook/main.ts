import { type StorybookConfig } from '@storybook/react-vite'
import { resolve } from 'path'
import { mergeConfig, type UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const viteOverrides: UserConfig = {
  base: '/app-elements',
  plugins: [tsconfigPaths({
    projects: [resolve(__dirname, '../../app-elements/tsconfig.json'), resolve(__dirname, '../tsconfig.json')]
  })]
}

const storybookConfig: StorybookConfig = {
  async viteFinal(config) {
    return mergeConfig(config, viteOverrides)
  },
  stories: ['../src/stories/**/*.stories.@(mdx|js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  // @ts-expect-error This 'managerEntries' exists.
  managerEntries: [require.resolve('./addon-container/manager.tsx')],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  core: {
    disableTelemetry: true
  },
  features: {
    storyStoreV7: true
  },
  docs: {
    autodocs: true
  }
}

module.exports = storybookConfig