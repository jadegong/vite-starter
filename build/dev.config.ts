/**
 * Dev config
 */
import baseConfig from './base.config';

import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://192.168.137.1:1111',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  },
})

