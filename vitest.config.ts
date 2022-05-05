/// <reference types="vitest" />
import { defineConfig } from 'vite'
import stachePlugin from "./src";

export default defineConfig({
  plugins: [stachePlugin()],
  test: {
    mockReset: true,
    clearMocks: true,
    testTimeout: 30_000,
    hookTimeout: 30_000,
    coverage: {
      enabled: false,
      clean: true,
      cleanOnRerun: true,
      reportsDirectory: './coverage',
      excludeNodeModules: true,
      reporter: ['clover','text', 'json', 'html']
    }
  }
})
