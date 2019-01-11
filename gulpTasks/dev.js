'use strict';
const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('dev', shell.task(['node node_modules/webpack/bin/webpack.js --config webpack.config.js --process --colors --watch true --mode development']));
