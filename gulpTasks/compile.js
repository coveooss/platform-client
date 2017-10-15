const gulp = require('gulp');
const shell = require('gulp-shell');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

// Transpiling the source files into the bin/ folder
gulp.task('src', () => {
  const tsResult = tsProject.src()
    .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('./bin'));
});

// Transpiling the source files into the bin/ folder
gulp.task('compile', shell.task([
  'webpack --process --colors --minimize'
]));