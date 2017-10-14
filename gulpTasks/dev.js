'use strict';

const nodemon = require('gulp-nodemon');
const gulp = require('gulp');

gulp.task('dev', ['watchTS'], () => {
  let stream = nodemon({
    exec: 'npm start',
    watch: 'src',
    env: { 'NODE_ENV': process.env.NODE_ENV }
  });
  return stream;
});

gulp.task('devTest', ['watchTest'],() => {
  let stream = nodemon({
    exec: 'npm test',
    // legacyWatch: true,
    runOnChangeOnly: true,
    watch: 'test',
    env: { 'NODE_ENV': 'test' }
  });
  return stream;
});