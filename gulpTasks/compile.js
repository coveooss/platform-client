const gulp = require('gulp');
const shell = require('gulp-shell');
const gutil = require('gulp-util');

// Transpiling the source files into the bin/ folder
gulp.task('compile', shell.task([
  `webpack --process --colors ${gutil.env.minimize? '--minimize': ''}`
]));
