'use strict';

const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('compile', shell.task([`"node_modules/.bin/webpack" --process --progress --colors`]));
