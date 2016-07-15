'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");

var PATHS = {
    "axboot-admin": {
        "static": "src/main/webapp/static"
    }
};

function errorAlert(error) {
    notify.onError({title: "Gulp Error", message: "Check your terminal", sound: "Purr"})(error); //Error Notification
    console.log(error.toString());//Prints Error to Console
    this.emit("end"); //End function
};

/**
 * SASS
 */
gulp.task('ui-scss', function () {
    gulp.src(PATHS["axboot-admin"].static + '/scss/app.scss')
        .pipe(plumber({errorHandler: errorAlert}))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest(PATHS["axboot-admin"].static + '/css'));
});

/**
 * watch
 */
gulp.task('default', function () {

    gulp.watch(PATHS["axboot-admin"].static + '/**/*.scss', ['ui-scss']);

});