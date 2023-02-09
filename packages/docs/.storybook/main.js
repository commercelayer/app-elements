// @ts-check

const { mergeConfig } = require("vite");
const { resolve } = require("path");
const tsconfigPaths = require('vite-tsconfig-paths')

/** @type import('vite').UserConfig */
const viteOverrides = {
  base: '/core-app-elements',
  plugins: [
    tsconfigPaths.default({
      projects: [
        resolve(__dirname, "../../core-app-elements/tsconfig.json"),
        resolve(__dirname, "../../app-elements-hook-form/tsconfig.json"),
        resolve(__dirname, "../tsconfig.json")
      ]
    })
  ],
   resolve: {
      alias: {
        // we need this so all imports `@commercelayer/core-app-elements` from `app-elements-hook-form`
        // will be resolved to their relative source files instead of looking for bundled ones in node_modules
        '@commercelayer/core-app-elements': resolve(__dirname, '../../core-app-elements/src/main.ts'),
      }
   }
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
    "@storybook/addon-interactions",
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
