'use strict';
const gulp = require('gulp');
const shell = require('gulp-shell');

if (/^win/.test(process.platform)) {
  gulp.task('dev', shell.task(['"node_modules/.bin/nyc" "node_modules/.bin/mocha-webpack" --webpack-config webpack.config-test.js --watch']));
} else {
  gulp.task(
    'dev',
    shell.task(['cross-env NODE_ENV=test nyc mocha-webpack test/test.ts --watch src/**/*.ts --webpack-config webpack.config-test.js --recursive --require ts-node/register --mode development'])
  );
}
