const gulp = require('gulp');
const shell = require('gulp-shell');
const gutil = require('gulp-util');

// Transpiling the source files into the bin/ folder

gulp.task('release', shell.task([`sh release.sh`]));
