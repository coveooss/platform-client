const gulp = require('gulp');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const runsequence = require('run-sequence');

gulp.task('definitions', function(done) {
  runsequence('externalDefs', 'internalDefs', 'cleanDefs', done);
});

gulp.task('cleanDefs', function() {
  return gulp
    .src('bin/ts/index.d.ts')
    .pipe(replace(/import.*$/gm, ''))
    .pipe(replace(/(declare module )(.*)( {$)/gm, '$1PlatformClient$3'))
    .pipe(replace(/export =.+;$/gm, ''))
    .pipe(replace(/export .+ from .+$/gm, ''))
    .pipe(replace(/export (?:default )?(.*)$/gm, '$1'))
    .pipe(replace(/private .+;$/gm, ''))
    .pipe(replace(/\t[A-Za-z]+;$/gm, ''))
    .pipe(replace(/\n\t\s*(\n\t\s*)/g, '$1'))
    .pipe(replace(/never/gm, 'void'))
    .pipe(replace(/^(\s*const\s\w+\s)(=\s\w+);$/gm, '$1: any;'))
    .pipe(replace(/\n\t(?:const|let|var)\s.*;/gm, ''))
    .pipe(replace(/readonly/gm, ''))
    .pipe(replace(/undefined/g, 'any'))
    .pipe(replace(/ Record<.*>;/g, ' any;'))
    .pipe(replace(/(enum [a-zA-Z_$]+\s{$)((?:\n^\s*[a-zA-Z_$]+ = "[a-zA-Z_$]+",$)*)/gm, clearEnumVariableDeclaration))
    .pipe(gulp.dest('bin/ts/'));
});

function clearEnumVariableDeclaration(match, p1, p2) {
  let lines = p2.split('\n');
  lines = lines.map(line => line.replace(/ = ["|'][a-zA-Z_$]*["|']/, ''));
  return p1 + lines.join('\n');
}

gulp.task('externalDefs', function() {
  return gulp
    .src(['./node_modules/@types/request/index.d.ts', './lib/promise/index.d.ts'])
    .pipe(concat('Externals.d.ts'))
    .pipe(gulp.dest('./bin/ts'));
});

gulp.task('internalDefs', function() {
  return require('dts-generator').default({
    name: 'PlatformClient',
    project: './',
    out: 'bin/ts/index.d.ts',
    externs: ['Externals.d.ts'],
    verbose: true,
    exclude: ['lib/**/*.d.ts', 'node_modules/**/*.d.ts', 'src/*.ts', 'bin/**/*.d.ts', 'test/**/*.ts']
  });
});
