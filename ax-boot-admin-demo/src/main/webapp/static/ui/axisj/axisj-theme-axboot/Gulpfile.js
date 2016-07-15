'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");

var PATHS = {
    "less":  "less"
};

function errorAlert(error) {
    notify.onError({title: "Gulp Error", message: "Check your terminal", sound: "Purr"})(error); //Error Notification
    console.log(error.toString());//Prints Error to Console
    this.emit("end"); //End function
};

/**
 * LESS
 */
gulp.task('axisj-less', function () {
    return gulp.src('less/*.less')
        .pipe(plumber({errorHandler: errorAlert}))
        .pipe(less())
        .pipe(gulp.dest('.'));
});
gulp.task('axisj-less-min', function () {
    return gulp.src(['*.css', '!' + '*.min.css'])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concat('axisj.min.css'))
        .pipe(gulp.dest('.'));
});


/**
 * watch
 */
gulp.task('default', ['axisj-less-min', 'axisj-less'], function () {
    gulp.watch(['less/*.less', 'inc/*.less'], ['axisj-less-min', 'axisj-less']);
});