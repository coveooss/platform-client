const gulp = require('gulp');
const shell = require('gulp-shell');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.test.json');

// Transpiling the source files into the bin/ folder
gulp.task('buildTest', ['setTestEnvironment', 'copyTestEnv'], () => {
  const tsResult = tsProject.src()
    .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('./bin'));
});

gulp.task('setTestEnvironment', () => {
  process.env.NODE_ENV = 'local-server';
});

gulp.task('test', ['buildTest'], shell.task([
  './node_modules/mocha/bin/mocha bin/test/test.js'
]));

gulp.task('copyTestEnv', function() {
  return gulp.src('environments/local-server.js')
    .pipe(gulp.dest('./bin/src/environments'))
});