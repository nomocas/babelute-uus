// Karma configuration
// Generated on Tue Feb 07 2017 16:25:10 GMT+0100 (CET)
const babel = require('rollup-plugin-babel'),
	babelrc = require('babelrc-rollup').default,
	nodeResolve = require('rollup-plugin-node-resolve'),
	commonjs = require('rollup-plugin-commonjs');

module.exports = function(config) {
	config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['mocha', 'chai'],


        // list of files / patterns to load in the browser
		files: [
            { pattern: 'src/**/*.js', included: false }, // watch them but do not include them
			'test/**/*.js'
		],


        // list of files to exclude
		exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'src/**/*.js': ['rollup'],
			'test/**/*.js': ['rollup']
		},
		rollupPreprocessor: {
			plugins: [
				babel(babelrc({
					externalHelpers:true
				})),
				nodeResolve({
                    // use "module" field for ES6 module if possible
					module: true, // Default: true

                    // use "jsnext:main" if possible
                    // – see https://github.com/rollup/rollup/wiki/jsnext:main
					jsnext: true, // Default: false

                    // use "main" field or index.js, even if it's not an ES6 module
                    // (needs to be converted from CommonJS to ES6
                    // – see https://github.com/rollup/rollup-plugin-commonjs
					main: true, // Default: true

                    // if there's something your bundle requires that you DON'T
                    // want to include, add it to 'skip'. Local and relative imports
                    // can be skipped by giving the full filepath. E.g., 
                    // `path.resolve('src/relative-dependency.js')`
                    // skip: ['some-big-dependency'], // Default: []

                    // some package.json files have a `browser` field which
                    // specifies alternative files to load for people bundling
                    // for the browser. If that's you, use this option, otherwise
                    // pkg.browser will be ignored
					browser: true, // Default: false

                    // not all files you want to resolve are .js files
					extensions: ['.js', '.json'], // Default: ['.js']

                    // whether to prefer built-in modules (e.g. `fs`, `path`) or
                    // local ones with the same names
					preferBuiltins: false // Default: true

				}),

				commonjs()
			],
			moduleName: '__MY__PROJECT__',
			format: 'iife', // helps prevent naming collisions
			sourceMap: 'inline', // sensible for testing
		},

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
		browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
		concurrency: Infinity
	});
};

