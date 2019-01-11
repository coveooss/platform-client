'use strict';

const gulp = require('gulp');
const del = require('del');
const requireDir = require('require-dir');

requireDir('./gulpTasks');

gulp.task('clean', function() {
  return del(['./bin', './zip/**.zip', '*.log']);
});

gulp.task('build', gulp.series('clean', 'setup', 'compile'));

gulp.task('default', gulp.series('build'));

// export default build;
