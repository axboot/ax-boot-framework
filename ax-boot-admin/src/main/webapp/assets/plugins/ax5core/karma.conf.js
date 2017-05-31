// Karma configuration
// Generated on Wed Sep 21 2016 00:37:04 GMT+0900 (KST)

module.exports = function (config) {
    var configuration = {
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha'],

        // list of files / patterns to load in the browser
        files: [
            'https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/should.js/11.1.2/should.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js',
            'dist/ax5core.js',
            'https://rawgit.com/aeei/aejs/master/dist/ae.min.js',
            'test/test.*.js'
        ],
        // list of files to exclude
        exclude: [],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],
        // web server port
        port: 9876,
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        //browsers: ['PhantomJS'],
        browsers: ['Chrome', 'Firefox'],
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        singleRun: true,
        concurrency: Infinity
    };

    if (process.env.TRAVIS) {
        configuration.browsers = ['PhantomJS'];
    }

    config.set(configuration);
}
