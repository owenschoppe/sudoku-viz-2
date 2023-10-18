import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import html2 from 'rollup-plugin-html2';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import { string } from 'rollup-plugin-string';

import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcssPresetEnv from 'postcss-preset-env';

const production = !process.env.ROLLUP_WATCH;

const livereloadScript = production
  ? []
  : [
      {
        tag: 'script',
        text: `document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +
  ':5001/livereload.js?snipver=1"></' + 'script>')`,
      },
    ];

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    resolve(), // tells Rollup how to find node_modules
    postcss({
      extract: true,
      include: ['src/*.css', 'src/base-components/*.css'],
      plugins: [autoprefixer(), postcssPresetEnv(), cssnano()],
    }),
    postcss({
      extract: false,
      include: ['**/*components/**/*.css'],
      exclude: ['src/base-components/*.css'],
      plugins: [autoprefixer(), postcssPresetEnv(), cssnano()],
    }),
    string({
      include: '**/*.html',
    }),
    commonjs(), // converts to ES modules
    typescript(),
    html2({
      template: './src/index.html',
      externals: {
        after: [...livereloadScript],
      },
    }),
    copy({
      targets: [{ src: 'assets/**/*', dest: 'dist/public' }],
    }),
    production && terser(), // minify in production
  ],
};
