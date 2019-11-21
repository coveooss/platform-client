const webpack = require('webpack');
const path = require('path');
const WebpackNotifierPlugin = require('webpack-notifier');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const plugins = [
  new WebpackNotifierPlugin(),
  new CleanWebpackPlugin(),
  new CopyPlugin([{ from: 'environments/**/*.js', to: '.' }, { from: 'views/**/*.ejs', to: '.' }, { from: 'client-global.js', to: '.' }]),
  new webpack.ProvidePlugin({
    _: 'underscore'
  })
];

module.exports = {
  name: 'client',
  target: 'node',
  entry: './src/client.ts',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'bin'),
    filename: 'index.js',
    library: 'PlatformClient',
    publicPath: '/bin/'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      env: __dirname + '/environments'
      // views: __dirname + '/views'
    }
  },
  module: {
    noParse: /update-notifier/,
    rules: [{ test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ }]
  },
  plugins: plugins
};
