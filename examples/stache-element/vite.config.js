const stachePlugin = require("vite-plugin-stache").default;

module.exports = {
  build: {
    manifest: true,
    minify: false,
    polyfillDynamicImport: false,
    rollupOptions: {
      input: {
        main: './index.html',
      },
      output: {
        manualChunks: undefined
      },
    }
  },
  plugins: [
   [...stachePlugin()]
  ]
}
