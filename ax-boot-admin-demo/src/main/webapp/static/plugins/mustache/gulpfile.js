'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");

gulp.task('min', function () {
    gulp.src('mustache.js')
        .pipe(concat('./mustache.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(''));
});

gulp.task('default', function () {

});