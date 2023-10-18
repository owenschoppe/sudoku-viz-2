import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import html2 from 'rollup-plugin-html2';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import { string } from 'rollup-plugin-string';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';

import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcssPresetEnv from 'postcss-preset-env';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    resolve(), // tells Rollup how to find date-fns in node_modules
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
    commonjs(), // converts date-fns to ES modules
    typescript(),
    html2({
      template: './src/index.html',
    }),
    copy({
      targets: [{ src: 'assets/**/*', dest: 'dist/public' }],
    }),
    production && terser(), // minify, but only in production
    !production &&
      serve({
        contentBase: ['dist'],
        open: true,
      }),
    !production && livereload({ watch: 'dist' }),
  ],
};
