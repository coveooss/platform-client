const gulp = require('gulp');
const ejs = require('gulp-ejs');
const livereload = require('gulp-livereload');

gulp.task('setup', ['ejs', 'copy']);

gulp.task('ejs', function() {
  return gulp.src('views/**/*.ejs')
    .pipe(gulp.dest('./bin/views'))
})

gulp.task('copy', ['copyJS']);

gulp.task('copyJS', function() {
  return gulp.src('vendor/**/*.js')
    .pipe(gulp.dest('./bin/js'))
})

// gulp.task('ejs', function() {
//   gulp.src(['views/pages/*.ejs'])
//     .pipe(ejs({
//       prototypeTitle: 'Coveo Client',
//     }, { ext: '.html' }))
//     .pipe(gulp.dest('./bin'))
//     .pipe(livereload());
// });
