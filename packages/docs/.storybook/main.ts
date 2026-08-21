// This file has been automatically migrated to valid ESM format by Storybook.

import { createRequire } from "node:module"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import type { StorybookConfig } from "@storybook/react-vite"
import remarkGfm from "remark-gfm"
import { mergeConfig, type UserConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)

const viteOverrides: UserConfig = {
  base: process.env.VITE_BASE_URL,
  plugins: [
    tsconfigPaths({
      projects: [
        resolve(__dirname, "../../app-elements/tsconfig.json"),
        resolve(__dirname, "../tsconfig.json"),
      ],
    }),
  ],
}

const storybookConfig: StorybookConfig = {
  async viteFinal(config) {
    return mergeConfig(config, viteOverrides)
  },
  staticDirs: ["../public"],
  stories: [
    "../src/stories/**/*.mdx",
    "../src/stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    {
      name: getAbsolutePath("@storybook/addon-docs"),
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    getAbsolutePath("@storybook/addon-styling-webpack"),
  ],
  // @ts-expect-error This 'managerEntries' exists.
  managerEntries: [
    require.resolve("./addon-container/manager.tsx"),
    require.resolve("./addon-version/manager.tsx"),
    require.resolve("./addon-gh-repository/manager.tsx"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  docs: {
    docsMode: true,
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      // The components live in the sibling package, outside this Storybook's
      // root: without widening the glob the docgen plugin never reads them, and
      // every props table falls back to whatever the story happens to pass in
      // `args` — which is why `AvatarLetter` listed `text` and nothing else.
      include: [
        "**/*.tsx",
        resolve(__dirname, "../../app-elements/src/**/*.tsx"),
      ],
      tsconfigPath: resolve(__dirname, "../../app-elements/tsconfig.json"),
      // A union of string literals is reported as one opaque type name unless the
      // values are extracted, and Storybook then falls back to an object control
      // for what should be a select — `size` showed a JSON editor instead of
      // medium/large.
      shouldExtractLiteralValuesFromEnum: true,
      // `undefined` is already conveyed by the prop being optional; leaving it in
      // the union adds an empty entry to every select
      shouldRemoveUndefinedFromOptional: true,
      // keep React's own HTML attributes out of the table
      propFilter: (prop) =>
        prop.parent == null || !/node_modules/.test(prop.parent.fileName),
    },
  },
}

export default storybookConfig

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")))
}
