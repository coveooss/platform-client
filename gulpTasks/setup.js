const gulp = require('gulp');

gulp.task('setup', ['copy']);

gulp.task('copy', ['copyEnv']);

gulp.task('copyEnv', function() {
  return gulp.src('environments/**/*.js')
    .pipe(gulp.dest('./bin/environments'))
})
