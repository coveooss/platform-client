'use strict';

const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('buildTest', shell.task(['node node_modules/webpack/bin/webpack.js --config webpack.config-test.js --process --colors']));

gulp.task(
  'test',
  shell.task(['nyc mocha-webpack test/test.ts --webpack-config webpack.config-test.js --recursive --require ts-node/register'])
);

gulp.task(
  'devTest',
  shell.task(['nyc mocha-webpack test/test.ts --watch --webpack-config webpack.config-test.js --recursive --require ts-node/register'])
);

// gulp.task(
//   'test-nyan',
//   shell.task(['nyc mocha test/test.ts --recursive --require ts-node/register --reporter nyan'])
// );
