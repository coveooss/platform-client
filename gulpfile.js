const gulp = require('gulp');
const del = require('del');
const requireDir = require('require-dir');
const ts = require('gulp-typescript');
const runsequence = require('run-sequence');

requireDir('./gulpTasks');

gulp.task('default', ['build']);

gulp.task('build:prod', function(done) {
  runsequence('build', 'zip', done);
});

gulp.task('build', function(done) {
  runsequence('clean', ['src'], done);
});

const tsProject = ts.createProject('tsconfig.json');

// Transpiling the source files into the bin/ folder
gulp.task('src', () => {
  const tsResult = tsProject.src()
    .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('./bin'));
});

gulp.task('watch', ['watchTS']);

// Watches the typescript files.
gulp.task('watchTS', ['src'], () => {
  gulp.watch('src/**/*.ts', ['src']);
});

// Remove bin and all zip folders.
gulp.task('clean', function() {
  return del(['./bin', './zip/**.zip']);
});