import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import html from '@rollup/plugin-html';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import { string } from 'rollup-plugin-string';
import css from 'rollup-plugin-import-css';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';

const production = !process.env.ROLLUP_WATCH;

// const template = ({ attributes, bundle, files, publicPath, title }) => {
//   return `<!DOCTYPE html>
// <html ${attributes}>
//   <head>
//     ${metas}
//     <title>${title}</title>
//     ${links}
//   </head>
//   <body class="theme">
//     ${scripts}
//   </body>
// </html>`;
// };

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
      include: ['src/*.css', 'src/base-components/*.css'],
    }),
    string({
      include: '**/*.html',
    }),
    css({
      include: '**/*components/**/*.css',
    }),
    commonjs(), // converts date-fns to ES modules
    typescript(),
    html({
      title: 'Sudoku Viz',
      publicPath: './',
      fileName: 'index.html',
      attributes: { html: { lang: 'en' } },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width' },
      ],
      // template,
      // template: templateExternalFiles([
      //   { type: 'css', file: 'index.css', pos: 'before' },
      // ]),
    }),
    production && terser(), // minify, but only in production
    !production &&
      serve({
        contentBase: 'dist',
        open: true,
      }),
    !production && livereload({ watch: 'dist' }),
  ],
};
