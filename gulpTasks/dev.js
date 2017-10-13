'use strict';

const nodemon = require('gulp-nodemon');
const gulp = require('gulp');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

gulp.task('dev', ['watch'], () => {
  let stream = nodemon({
    exec: 'npm start',
    env: { 'NODE_ENV': process.env.NODE_ENV}
  });
  return stream;
});

var webpackConfigTest = require('../webpackConfigFiles/webpack.test.config');
webpackConfigTest.entry['tests'].unshift('webpack-dev-server/client?http://localhost:3001/');
const compilerTest = webpack(webpackConfigTest);

gulp.task('devTest', function(done) {
  let serverTests = new WebpackDevServer(compilerTest, {
    contentBase: 'bin/',
    publicPath: '/tests/',
    compress: true
  });
  serverTests.listen(3001, 'localhost', () => {})
  done();
})