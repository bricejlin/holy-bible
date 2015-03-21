var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('jshint', function () {
  return gulp.src(['index.js', 'test/*.js'])
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('test', ['jshint'], function () {
  return require('./test/index');
});