/**
 * v1.0.0 2023/01/17 gqd Add less options;
 */
import { resolve } from 'path';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Markdown from 'unplugin-vue-markdown/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    vueJsx(),
    Markdown(),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    },
  },
  resolve: {
    alias: {
      // '@': fileURLToPath(new URL('./src', import.meta.url))
        '@': resolve(__dirname, '../src'),
    }
  }
})
