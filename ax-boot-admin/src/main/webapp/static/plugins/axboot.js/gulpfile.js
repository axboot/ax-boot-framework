'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var babel = require('gulp-babel');

var PATHS = {
    "axboot.js": {
        isPlugin: true,
        root: "",
        src: "src",
        dest: "dist",
        js: "axboot"
    }
};

function errorAlert(error) {
    notify.onError({title: "Gulp Error", message: "Check your terminal", sound: "Purr"})(error); //Error Notification
    console.log(error.toString());//Prints Error to Console
    this.emit("end"); //End function
}

/**
 * for JS
 */
for (var k in PATHS) {
    var __p = PATHS[k];
    if (__p.isPlugin && __p.js) {
        gulp.task(k + '-scripts', (function (k, __p) {
            return function () {
                gulp.src(PATHS[k].src + '/*.js')
                    .pipe(plumber({errorHandler: errorAlert}))
                    .pipe(concat(__p.js + '.js'))
                    .pipe(babel({
                        presets: ['es2015']
                    }))
                    .pipe(gulp.dest(PATHS[k].dest))
                    .pipe(concat(__p.js + '.min.js'))
                    .pipe(uglify())
                    .pipe(gulp.dest(PATHS[k].dest));
            }
        })(k, __p));
    }
}

/**
 * watch
 */
gulp.task('default', function () {

    // scripts
    for (var k in PATHS) {

        var __p = PATHS[k];
        if (__p.isPlugin && __p.js) {
            gulp.watch(PATHS[k].src + '/*.js', [k + '-scripts']);
        }
    }
});