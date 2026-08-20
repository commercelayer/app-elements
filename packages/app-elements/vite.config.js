// @ts-check

import { copyFileSync } from "node:fs"
import { resolve } from "node:path"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"
import { defineConfig } from "vitest/config"
import pkg from "./package.json"

const tailwindConfigSource = resolve(__dirname, "src/styles/global.css")

/**
 * Publishes `src/styles/global.css` as `dist/tailwind.global.css`, the file
 * consumers import to get the theme and to scan their own content.
 *
 * Owned by the build rather than a separate `cp` step, so `vite build --watch`
 * reissues it: `addWatchFile` makes the source a dependency of the build, which
 * a plain copy in a script is not, leaving consumers on a stale theme until the
 * next full build.
 *
 * Copying on `writeBundle` rather than earlier because `emptyOutDir` clears
 * `dist` during the write phase and would delete it again.
 * @type {() => import('vite').Plugin}
 */
const emitTailwindConfig = () => ({
  name: "emit-tailwind-config",
  // this config is shared with vitest, which has no `dist` to write into
  apply: "build",
  buildStart() {
    this.addWatchFile(tailwindConfigSource)
  },
  writeBundle() {
    copyFileSync(
      tailwindConfigSource,
      resolve(__dirname, "dist/tailwind.global.css"),
    )
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src"],
    }),
    emitTailwindConfig(),
  ],
  build: {
    // `vendor.css` comes from a separate step of `pnpm build`, so wiping `dist`
    // on a watch rebuild would delete it and leave consumers failing to resolve
    // `@commercelayer/app-elements/vendor.css`.
    emptyOutDir: process.env.APP_ELEMENTS_WATCH !== "true",
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/main.ts"),
      name: "Blocks",
      // the proper extensions will be added
      fileName: "main",
      formats: ["es"],
      cssFileName: "style",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [...Object.keys(pkg.peerDependencies), "react-dom/client"],
      output: {
        banner: `'use client';`,
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  resolve: {
    alias: {
      "#providers": resolve(__dirname, "./src/providers"),
      "#ui": resolve(__dirname, "./src/ui"),
      "#styles": resolve(__dirname, "./src/styles"),
      "#utils": resolve(__dirname, "./src/utils"),
      "#helpers": resolve(__dirname, "./src/helpers"),
      "#hooks": resolve(__dirname, "./src/hooks"),
      "#dictionaries": resolve(__dirname, "./src/dictionaries"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    // Node 25+ ships a native (file-backed) `localStorage` global that throws
    // unless `--localstorage-file` is set, shadowing the one provided by jsdom.
    // Disable Node's experimental Web Storage so jsdom owns localStorage.
    // https://nodejs.org/api/cli.html#--experimental-webstorage
    poolOptions: {
      forks: { execArgv: ["--no-experimental-webstorage"] },
      threads: { execArgv: ["--no-experimental-webstorage"] },
    },
    setupFiles: [
      "./react-testing-library.config.js",
      "./src/mocks/setup.ts",
      "./src/mocks/stubs.ts",
    ],
  },
})
