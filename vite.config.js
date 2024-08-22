import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/wrapper.js'),
      name: 'Flipbook',
      fileName: 'flipbook',
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
