import baseConfig from './base.config';

import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  build: {
    outDir: 'dist',
  },
})
