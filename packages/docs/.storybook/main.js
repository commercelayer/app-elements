// @ts-check

const { mergeConfig } = require("vite");
const { resolve } = require("path");
const tsconfigPaths = require('vite-tsconfig-paths')

/** @type import('vite').UserConfig */
const viteOverrides = {
  base: '/app-elements',
  plugins: [
    tsconfigPaths.default({
      projects: [
        resolve(__dirname, "../../app-elements/tsconfig.json"),
        resolve(__dirname, "../tsconfig.json")
      ]
    })
  ]
}

/** @type import('@storybook/core-common').StorybookConfig */
module.exports = {
  async viteFinal(config, { configType }) {
    return mergeConfig(config, viteOverrides);
  },
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  managerEntries: [
    './.storybook/addon-container/manager.tsx'
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
    disableTelemetry: true,
  },
  features: {
    storyStoreV7: true,
  },
};
