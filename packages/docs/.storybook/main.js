// @ts-check

const {
  mergeConfig
} = require("vite")
const {
  resolve
} = require("path")
const tsconfigPaths = require('vite-tsconfig-paths')

/** @type import('vite').UserConfig */
const viteOverrides = {
  base: '/app-elements',
  plugins: [tsconfigPaths.default({
    projects: [resolve(__dirname, "../../app-elements/tsconfig.json"), resolve(__dirname, "../tsconfig.json")]
  })]
}

/** @type import('@storybook/react-vite').StorybookConfig */
module.exports = {
  async viteFinal(config, {
    configType
  }) {
    return mergeConfig(config, viteOverrides)
  },
  stories: ["../src/stories/**/*.stories.@(mdx|js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions"],
  managerEntries: [require.resolve('./addon-container/manager.tsx')],
  framework: {
    name: "@storybook/react-vite",
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