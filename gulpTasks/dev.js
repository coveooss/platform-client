const nodemon = require('gulp-nodemon');
const gulp = require('gulp');

gulp.task('dev', ['watch'], () => {
  let stream = nodemon({
    script: './bin/coveo-client.js',
    env: { 'NODE_ENV': 'development' }
  });
  stream
    .on('restart', function() {
      console.log('restarted!');
    })
    .on('crash', function() {
      console.error('Application has crashed!\n');
    });
});