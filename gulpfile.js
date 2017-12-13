'use strict'

const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload
const nodemon = require('gulp-nodemon')
const babel = require('gulp-babel')
const filter = require('gulp-filter')
const changed = require('gulp-changed')


gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init({
    proxy: "http://localhost:3000",
    port: 8000,
    notify: true,
    // Disable UI completely
    ui: false,
  })
})


gulp.task('nodemon', ['compile', 'copy'], function (cb) {
  const stream = nodemon({
    watch: './src',
    script: './dist',
    ext: 'js sass pug',
    tasks: ['compile', 'copy'],
    env: {
      'NODE_ENV': 'development',
      'DEBUG': 'ex-es6-template:*',
    },
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  })
  return stream
  .once('start', function() {
    cb()
  })
  .on('restart', function() {
    setTimeout(function() {
      reload({ stream: false })
    }, 1000)
  })
  .on('crash', function() {
    console.error('\nApplication has crashed!\n')
    console.error('Restarting in 2 seconds...\n')
    setTimeout(function () {
      stream.emit('restart')
    }, 2000)
  })
})


gulp.task('compile', function() {
  return gulp.src('./src/**/*.js')
    .pipe(changed('./dist'))
    .pipe(babel())
    .pipe(gulp.dest('./dist'))
})


gulp.task('copy', function() {
  // take everything but .js files
  const f = filter(['**', '!**/*.js'])
  return gulp.src('./src/**')
    .pipe(f)
    .pipe(changed('./dist'))
    .pipe(gulp.dest('./dist'))
})


gulp.task('default', ['browser-sync'])
