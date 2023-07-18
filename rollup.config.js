import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import html from '@rollup/plugin-html';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import { string } from 'rollup-plugin-string';
import css from 'rollup-plugin-import-css';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'iife', // immediately-invoked function expression — suitable for <script> tags
    sourcemap: true,
  },
  plugins: [
    resolve(), // tells Rollup how to find date-fns in node_modules
    postcss({
      extract: true,
      include: 'src/*.css',
    }),
    string({
      include: '**/*.html',
    }),
    css({
      include: '**/components/**/*.css',
    }),
    commonjs(), // converts date-fns to ES modules
    typescript(),
    html({
      title: 'sudoku viz',
      publicPath: './',
      fileName: 'index.html',
      attributes: { html: { lang: 'en' } },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width' },
      ],
      // template: templateExternalFiles([
      //   { type: 'css', file: 'index.css', pos: 'before' },
      // ]),
    }),
    production && terser(), // minify, but only in production
  ],
};
