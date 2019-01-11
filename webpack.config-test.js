const webpack = require('webpack');
const path = require('path');
const WebpackNotifierPlugin = require('webpack-notifier');

const plugins = [];

plugins.push(new WebpackNotifierPlugin());

module.exports = {
  name: 'client',
  target: 'node',
  entry: './src/client.ts',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'bin'),
    filename: 'test.js',
    library: 'PlatformClientTest',
    publicPath: '/bin/test'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      env: __dirname + '/environments',
      'this.env': 'test'
    }
  },
  module: {
    noParse: /update-notifier/,
    rules: [{ test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ }]
  },
  plugins: plugins,
  bail: true
};
