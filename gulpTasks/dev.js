'use strict';

const nodemon = require('gulp-nodemon');
var gulp = require('gulp');

// gulp.task('devTest', ['buildTest', 'watchTest'],() => {
//   let stream = nodemon({
//     exec: 'npm test',
//     // legacyWatch: true,
//     // runOnChangeOnly: true,
//     watch: 'test',
//     env: { 'NODE_ENV': process.env.NODE_ENV }
//   });
//   return stream;
// });

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('../webpack.config.js');

gulp.task('dev', ['watchTS'], (done) => {

  // TODO: add a webpack server for the tests
  webpackConfig.entry.unshift('webpack-dev-server/client?http://localhost:3001/');
  const compiler = webpack(webpackConfig);

  new WebpackDevServer(compiler, {
    compress: true,
    contentBase: 'bin/',
    publicPath: 'http://localhost:8080/js/',
    disableHostCheck: true,
    stats: {
      colors: true,
      publicPath: true
    }

  }).listen(8080, 'localhost', () => {});
  done();
});