'use strict';
const webpack = require('webpack');
const minimize = process.argv.indexOf('--minimize') !== -1;
const colors = require('colors');
const failPlugin = require('webpack-fail-plugin');
const nodeExternals = require('webpack-node-externals');

// Fail plugin will allow the webpack ts-loader to fail correctly when the TS compilation fails
var plugins = [failPlugin];

if (minimize) {
    plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = {
    resolve: {
        extensions: ['', '.ts', '.js'],
    },
    devtool: 'source-map',
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' },
            { test: /\.json$/, loader: 'json-loader' }
        ]
    },
    externals: [nodeExternals()],
    plugins: plugins,
    bail: true
}