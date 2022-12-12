const { mergeConfig } = require("vite");
const { resolve } = require("path");

module.exports = {
  async viteFinal(config, { configType }) {
    // return the customized config
    return mergeConfig(config, {
      // customize the Vite config here
      resolve: {
        alias: { "#core-app-elements": resolve(__dirname, "../../core-app-elements/src/ui") },
      },
    });
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
