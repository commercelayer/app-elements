// @ts-check

import { resolve } from "node:path"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"
import { defineConfig } from "vitest/config"
import pkg from "./package.json"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src"],
    }),
  ],
  build: {
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
