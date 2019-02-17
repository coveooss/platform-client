'use strict';
const gulp = require('gulp');
const shell = require('gulp-shell');

// gulp.task('dev', shell.task(['node node_modules/webpack/bin/webpack.js --config webpack.config.js --process --colors --watch true --mode development']));

gulp.task(
  'dev',
  shell.task(['cross-env NODE_ENV=test nyc mocha-webpack test/test.ts --watch src/**/*.ts --webpack-config webpack.config-test.js --recursive --require ts-node/register --mode development'])
);