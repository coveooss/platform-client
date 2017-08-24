const gulp = require('gulp');
const del = require('del');
const requireDir = require('require-dir');
const runsequence = require('run-sequence');
const gutil = require('gulp-util');


process.env.NODE_ENV = gutil.env.config || 'development';
process.env.CUSTOM_BUNDLE = gutil.env.bundle || 'support';

requireDir('./gulpTasks');

gulp.task('default', ['build']);

gulp.task('build:prod', function(done) {
  runsequence('build', 'zip', done);
});

gulp.task('build', function(done) {
  runsequence('clean', ['setup', 'css'], 'compile', done);
});

gulp.task('watch', ['watchTS', 'watchEJS', 'watchCSS']);

// Watches the typescript files.
gulp.task('watchTS', ['src'], () => {
  gulp.watch('src/**/*.ts', ['src']);
});

// Watches the SCSS files.
gulp.task('watchCSS', ['css'], () => {
  gulp.watch('scss/**/*.scss', ['css']);
});

// Watches the EJS files.
gulp.task('watchEJS', ['ejs'], () => {
  gulp.watch('ejs/**/*.ejs', ['ejs']);
});

// Remove bin and all zip folders.
gulp.task('clean', function() {
  return del(['./bin', './zip/**.zip']);
});