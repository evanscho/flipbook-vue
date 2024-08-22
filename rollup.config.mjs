import vue from 'rollup-plugin-vue';  // Include this if you need to process .vue files
import coffeescript from '@bkuri/rollup-plugin-coffeescript';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' assert { type: 'json' };

const { name, version } = pkg;

const banner = `/*!
 * @license
 * ${name} v${version}
 * Copyright © ${new Date().getFullYear()} Takeshi Sone.
 * Released under the MIT License.
 */
`

const plugins = (minify = false) => {
  const plugins = [
    vue(),
    coffeescript(),
  ]
  if (minify) {
    plugins.push(terser({ output: { comments: /copyright|license/i } }));
  }
  return plugins
}

const modules = (dist) => ({
  input: 'src/Flipbook.vue',
  external: ['rematrix', 'vue'],
  output: [
    { banner, format: 'es', file: `${dist}/flipbook.mjs` },
    { banner, format: 'cjs', file: `${dist}/flipbook.cjs.js`, exports: 'default' }
  ],
  plugins: plugins(),
})

const browser = (dist, minify) => ({
  input: 'src/wrapper.coffee',
  external: ['vue'],
  output: {
    banner,
    format: 'iife',
    file: `${dist}/flipbook${minify ? '.min' : ''}.js`,
    globals: { vue: 'Vue'}
  },
  plugins: plugins(minify),
})

export default [
  modules('dist'),
  browser('dist', false),
  browser('dist', true),
]
