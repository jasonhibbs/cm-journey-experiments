import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      reactivityTransform: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/citymapper': {
        target: 'https://api.external.citymapper.com/api/',
        headers: {
          'Citymapper-Partner-Key': 'krXj1prs0U64AAgAL0uIuVLzKULf9YL1',
        },
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/citymapper/, ''),
      },
    },
  },
})
