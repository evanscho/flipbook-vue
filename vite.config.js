import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue(),
  ],
  extensions: [
    '.js',
    '.vue',
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/Flipbook.vue'),
      name: 'FlipbookVue',
      fileName: (format) => `flipbook-vue.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'rematrix'],
      output: {
        globals: {
          vue: 'Vue',
          rematrix: 'Rematrix',
        },
      },
    },
  },
});
