const gulp = require('gulp');
const sass = require('gulp-sass');
const event_stream = require('event-stream');

gulp.task('css', ['prepareSass'], function(done) {
  return gulp.src('./scss/index.scss')
    .pipe(sass())
    .pipe(gulp.dest('./bin/css'));
});

gulp.task('prepareSass', function() {
  return event_stream.merge(
    gulp.src('./sass/**/*')
    .pipe(gulp.dest('./bin/sass/'))
  ).pipe(event_stream.wait());
});
