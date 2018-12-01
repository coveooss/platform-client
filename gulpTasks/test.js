const gulp = require('gulp');
const shell = require('gulp-shell');

// Transpiling the source files into the bin/ folder
gulp.task('buildTest', shell.task(['node node_modules/webpack/bin/webpack.js --config webpack.test.config.js --process --colors']));

gulp.task('test', shell.task(['cross-env NODE_ENV=test nyc mocha test/test.ts --recursive --require ts-node/register']));

gulp.task(
  'test-nyan',
  shell.task(['cross-env NODE_ENV=test nyc mocha test/test.ts --recursive --require ts-node/register --reporter nyan'])
);
