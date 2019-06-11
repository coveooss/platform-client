'use strict';

const gulp = require('gulp');

const copyEnv = () => gulp.src('environments/**/*.js').pipe(gulp.dest('./bin/environments'));
const copyViews = () => gulp.src('views/**/*.ejs').pipe(gulp.dest('./bin/views'));
const copyGlobal = () => gulp.src('client-global.js').pipe(gulp.dest('./bin'));

gulp.task('setup', gulp.series(copyEnv, copyGlobal, copyViews));
