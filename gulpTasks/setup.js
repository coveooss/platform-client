'use strict';

const gulp = require('gulp');

const copyEnv = () => gulp.src('environments/**/*.js').pipe(gulp.dest('./bin/environments'));
const copyGlobal = () => gulp.src('client-global.js').pipe(gulp.dest('./bin'));

gulp.task('setup', gulp.series(copyEnv, copyGlobal));
