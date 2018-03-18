require('colors');
const TSLintPlugin = require('tslint-webpack-plugin');
const webpack = require('webpack');
const minimize = process.argv.indexOf('--minimize') !== -1;
const devMode = process.argv.indexOf('--dev-mode') !== -1;
const failPlugin = require('webpack-fail-plugin');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const WebpackNotifierPlugin = require('webpack-notifier');

if (minimize) {
  console.log('Building minified version of the library'.bgGreen.red);
} else {
  console.log('Building non minified version of the library'.bgGreen.red);
}

// Fail plugin will allow the webpack ts-loader to fail correctly when the TS compilation fails
const plugins = [failPlugin];

plugins.push(
  new webpack.HotModuleReplacementPlugin({
    multiStep: true
  })
);

if (devMode) {
  plugins.push(new WebpackNotifierPlugin());
  plugins.push(
    new TSLintPlugin({
      files: ['./src/**/*.ts']
    })
  );
}

if (minimize) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = {
  name: 'client',
  target: 'node',
  entry: ['./src/client.ts'],
  output: {
    path: path.resolve('./bin/'),
    filename: 'index.js',
    library: 'CoveoClient',
    publicPath: '/bin/'
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['', '.ts', '.js'],
    alias: {
      env: __dirname + '/environments'
    }
  },
  module: {
    loaders: [{ test: /\.ts$/, loader: 'ts-loader' }, { test: /\.json$/, loader: 'json-loader' }]
  },
  plugins: plugins,
  bail: true
};
