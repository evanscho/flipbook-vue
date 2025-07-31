import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import { name, version } from './package.json'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

const banner = `/*!
 * @license
 * ${name} v${version}
 * Copyright © ${new Date().getFullYear()} Takeshi Sone.
 * Released under the MIT License.
 */
`

export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/wrapper.js'),
      name: 'Flipbook',
      fileName: (format) => `flipbook.${format === 'es' ? 'js' : 'umd.cjs'}`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['vue', 'rematrix'],
      output: {
        globals: {
          vue: 'Vue',
          rematrix: 'Rematrix',
        },
        banner: banner,
      },
    },
  },
});
