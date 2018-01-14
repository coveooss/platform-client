const gulp = require('gulp');
const shell = require('gulp-shell');

// Transpiling the source files into the bin/ folder
gulp.task('buildTest', shell.task(['node node_modules/webpack/bin/webpack.js --config webpack.test.config.js --process --colors']));

gulp.task('setTestEnvironment', () => {
  process.env.NODE_ENV = 'local-server';
});

gulp.task('test', shell.task(['NODE_ENV=test nyc mocha test/test.ts --recursive --require ts-node/register']));

gulp.task('copyTestEnv', function() {
  return gulp.src('environments/local-server.js').pipe(gulp.dest('./bin/src/environments'));
});
