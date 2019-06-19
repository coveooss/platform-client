'use strict';
const gulp = require('gulp');
const shell = require('gulp-shell');

const command = /^win/.test(process.platform)
  ? ['"node_modules/.bin/nyc" "node_modules/.bin/mocha-webpack" --webpack-config webpack.config-test.js --watch']
  : [
      'cross-env NODE_ENV=test nyc mocha-webpack test/test.ts --watch src/**/*.ts --webpack-config webpack.config-test.js --recursive'
    ];

gulp.task('dev', shell.task(command));
