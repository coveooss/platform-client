const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('release', shell.task([`sh release.sh`]));
