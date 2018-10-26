'use strict';
const nodemon = require('gulp-nodemon');
const gulp = require('gulp');

gulp.task('setupDevEnv', done => {
  gulp.src('environments/**/*.js').pipe(gulp.dest('./bin/config/env'));
  done();
});

gulp.task('dev', ['build'], () => {
  gulp.watch('src/**/*.ts', ['compileForDev']);
});

gulp.task('devTest', ['watchTest'], () => {
  let stream = nodemon({
    exec: 'gulp test',
    watch: 'test',
    env: { NODE_ENV: process.env.NODE_ENV }
  });
  return stream;
});

gulp.task('devTest-nyan', ['watchTest'], () => {
  let stream = nodemon({
    exec: 'gulp test-nyan',
    watch: 'test',
    env: { NODE_ENV: process.env.NODE_ENV }
  });
  return stream;
});
