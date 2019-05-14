'use strict';

const gulp = require('gulp');
const shell = require('gulp-shell');

if (/^win/.test(process.platform)) {
  gulp.task('compile', shell.task([`"node_modules/.bin/webpack" --process --progress --colors`]));
} else {
  gulp.task('compile', shell.task([`webpack --process --progress --colors`]));
}

