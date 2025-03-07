import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // The following is to fix a bug when importing pyodide. (See https://github.com/pyodide/pyodide/issues/4244)
      'node-fetch': 'isomorphic-fetch',
    },
  },
  server: {
    headers: {
      // These are needed to use SharedArrayBuffer in localhost development.
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    },
  },
  assetsInclude: ['**/*.whl'],
})
