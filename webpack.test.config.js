require('colors');
const webpack = require('webpack');
const minimize = process.argv.indexOf('--minimize') !== -1;
const failPlugin = require('webpack-fail-plugin');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

if (minimize) {
  console.log('TEST: Building minified version of the library'.bgGreen.red);
} else {
  console.log('TEST: Building non minified version of the library'.bgGreen.red);
}

// Fail plugin will allow the webpack ts-loader to fail correctly when the TS compilation fails
const plugins = [failPlugin];

plugins.push(new webpack.HotModuleReplacementPlugin({
  multiStep: true
}));

if (minimize) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = {
  name: 'client',
  target: 'node',
  entry: ['./test/test.ts'],
  output: {
    path: path.resolve('./bin/tests'),
    filename: 'test.js',
    library: 'CoveoClientTest',
    publicPath: '/bin/test'
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['', '.ts', '.js'],
    alias: {
      env: __dirname + '/environments'
    }
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  plugins: plugins,
  bail: true
}