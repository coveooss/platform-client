'use strict';
const nodemon = require('gulp-nodemon');
const gulp = require('gulp');

// var webpack = require('webpack');
// var WebpackDevServer = require('webpack-dev-server');
// var webpackConfig = require('../webpack.config.js');


gulp.task('setupDevEnv', (done) => {
  gulp.src('environments/**/*.js')
    .pipe(gulp.dest('./bin/config/env'))
  done();
})

gulp.task('dev', ['build'], () => {
  gulp.watch('src/**/*.ts', ['compileForDev']);
});

gulp.task('devTest', ['buildTest', 'watchTest'],() => {
  let stream = nodemon({
    exec: 'npm test',
    watch: 'test',
    env: { 'NODE_ENV': process.env.NODE_ENV }
  });
  return stream;
});
// gulp.task('dev', ['setupDevEnv', 'watchTS'], (done) => {

//   webpackConfig.entry.unshift('webpack-dev-server/client?http://localhost:8080/');

//   // Add Dev plugins
//   // webpackConfig.plugins.push(plugins);

//   const compiler = webpack(webpackConfig);

//   new WebpackDevServer(compiler, {
//     compress: true,
//     contentBase: 'bin/',
//     publicPath: 'http://localhost:8080/js/',
//     disableHostCheck: true,
//     stats: {
//       colors: true,
//       publicPath: true
//     }

//   }).listen(8080, 'localhost', () => {});
//   done();
// });