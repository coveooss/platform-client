'use strict';

const nodemon = require('gulp-nodemon');
const gulp = require('gulp');
const WebpackShellPlugin = require('webpack-shell-plugin');

// var plugins;

// plugins = new WebpackShellPlugin({
//   onBuildStart: ['echo "Starting----------------------------------------"'],
//   // onBuildEnd: ['cat coveo-client.js | pbcopy && echo "process.env.DEV_SERVER = true;" > coveo-client.js && pbpaste >> coveo-client.js']
//   onBuildEnd: ['echo "Dsadfg">>coveo-client.js']
// });

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


gulp.task('setupDevEnv', (done) => {
  gulp.src('environments/**/*.js')
    .pipe(gulp.dest('./bin/config/env'))
  done();
})

gulp.task('dev', ['setupDevEnv', 'watchTS'], (done) => {

  webpackConfig.entry.unshift('webpack-dev-server/client?http://localhost:8080/');

  // Add Dev plugins
  // webpackConfig.plugins.push(plugins);

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