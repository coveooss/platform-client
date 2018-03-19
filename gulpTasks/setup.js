const gulp = require('gulp');

gulp.task('setup', ['copy']);

gulp.task('copy', ['copyEnv', 'copyGlobal']);

gulp.task('copyEnv', function() {
  return gulp.src('environments/**/*.js').pipe(gulp.dest('./bin/environments'));
});

gulp.task('copyGlobal', function() {
  return gulp.src('client-global.js').pipe(gulp.dest('./bin'));
});
