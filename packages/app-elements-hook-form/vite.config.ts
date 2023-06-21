import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic'
    }),
    dts({
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'ElementsHookForm',
      // the proper extensions will be added
      fileName: 'main',
      formats: ['es']
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        'react',
        'react-dom',
        'react-hook-form',
        '@commercelayer/app-elements',
        'query-string',
        '@commercelayer/sdk'
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  resolve: {
    alias: {
      '#components': resolve(__dirname, './src/components'),
      '#filters': resolve(__dirname, './src/filters'),
      '#helpers': resolve(__dirname, './src/helpers')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./react-testing-library.config.js'],
    silent: true
  }
})
