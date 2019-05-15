'use strict';
const gulp = require('gulp');
const shell = require('gulp-shell');

// Get args
const args = (argList => {
  let arg = {}, a, opt, thisOpt, curOpt;
  for (a = 0; a < argList.length; a++) {
    thisOpt = argList[a].trim();
    opt = thisOpt.replace(/^\-+/, '');
    if (opt === thisOpt) {
      if (curOpt) arg[curOpt] = opt;
      curOpt = null;
    } else {
      curOpt = opt;
      arg[curOpt] = true;
    }
  }
  return arg;
})(process.argv);

if (/^win/.test(process.platform)) {
  gulp.task('dev', shell.task([`"node_modules/.bin/cross-env" NODE_ENV=${args.env || args.environment || 'development'} "node_modules/.bin/nyc" "node_modules/.bin/mocha-webpack" --watch --webpack-config webpack.config-test.js `]));
} else {
  gulp.task('dev', shell.task([`cross-env NODE_ENV=${args.env || args.environment || 'development '} nyc mocha-webpack test/test.ts --watch src/**/*.ts --webpack-config webpack.config-test.js --recursive --require ts-node/register`]));
}
