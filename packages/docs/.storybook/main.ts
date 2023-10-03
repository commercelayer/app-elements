import { type StorybookConfig } from '@storybook/react-vite'
import { resolve } from 'path'
import { mergeConfig, type UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const viteOverrides: UserConfig = {
  base: process.env.VITE_BASE_URL,
  plugins: [tsconfigPaths({
    projects: [resolve(__dirname, '../../app-elements/tsconfig.json'), resolve(__dirname, '../tsconfig.json')]
  })]
}

const storybookConfig: StorybookConfig = {
  async viteFinal(config) {
    return mergeConfig(config, viteOverrides)
  },
  stories: [
    '../src/stories/**/*.mdx',
    '../src/stories/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-mdx-gfm'
  ],
  // @ts-expect-error This 'managerEntries' exists.
  managerEntries: [
    require.resolve('./addon-container/manager.tsx'),
    require.resolve('./addon-gh-repository/manager.tsx')
  ],
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
    autodocs: true,
    docsMode: true
  }
}

module.exports = storybookConfig