
'use strict';

var gulp = require('gulp');
var scss = require("gulp-sass");
var prefix = require("gulp-autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
var ftp = require('gulp-ftp');
var gutil = require('gulp-util');
var cssnano = require('gulp-cssnano');
var rename = require("gulp-rename");

var browserSync = require('browser-sync').create();


//default
gulp.task('default', ['serve', 'scss']);

// server
gulp.task('serve', ['ftp-css'], function() {

    browserSync.init({
        server: "app/",
        // Open the site in Chrome
        //browser: "google chrome"

        // Open the site in Chrome & Firefox
        //browser: ["google chrome", "firefox"]
    });
  
  gulp.watch("app/scss/*.scss", ['ftp']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
    gulp.watch("app/js/*.js").on('change', browserSync.reload);

});



// Compile sass into CSS & auto-inject into browsers
gulp.task('scss', function() {
    return gulp.src("app/scss/style.scss")
      .pipe(sourcemaps.init('.'))
      .pipe(scss())
      .pipe(prefix('last 2 versions', '> 1%', 'ie 9'))
        .pipe(rename({
          prefix: 'secret-'
        }))
      .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('cssnano', function() {
      return gulp.src("app/scss/style.scss")
      .pipe(scss())
      .pipe(prefix('last 2 versions', '> 1%', 'ie 9'))
        .pipe(cssnano())
        .pipe(rename({
          prefix: 'min-'
        }))
        .pipe(gulp.dest('app/css/'));
});


gulp.task('ftp-css', ['scss', 'cssnano'], function () {
    return gulp.src(['app/css/secret-style.css', 'app/css/secret-style.css.map', 'app/css/min-style.css'])
        .pipe(ftp({
            host: 'lafortun.ftp.ukraine.com.ua',
            user: 'lafortun_strtestftp',
            pass: '7h1hi8p4',
            remotePath: 'css'
        }))
        // you need to have some kind of stream after gulp-ftp to make sure it's flushed 
        // this can be a gulp plugin, gulp.dest, or any kind of stream 
        // here we use a passthrough stream 
        .pipe(gutil.noop());
});