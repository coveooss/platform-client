'use strict';

const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task(
  'test',
  shell.task(['cross-env NODE_ENV=test nyc mocha-webpack test/test.ts --webpack-config webpack.config-test.js --recursive --require ts-node/register'])
);
