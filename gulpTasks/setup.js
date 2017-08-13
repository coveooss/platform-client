const gulp = require('gulp');
const ejs = require('gulp-ejs');
const livereload = require('gulp-livereload');

gulp.task('setup', ['ejs']);

gulp.task('ejs', function() {
  return gulp.src('views/**/*.ejs')
    .pipe(gulp.dest('./bin/views'))
})

// gulp.task('ejs', function() {
//   gulp.src(['views/pages/*.ejs'])
//     .pipe(ejs({
//       prototypeTitle: 'Coveo Client',
//     }, { ext: '.html' }))
//     .pipe(gulp.dest('./bin'))
//     .pipe(livereload());
// });
