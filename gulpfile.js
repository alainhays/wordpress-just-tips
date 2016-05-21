var gulp = require('gulp'),
  assign = require('lodash.assign'),
  babel = require('gulp-babel'),
  compose = require('lodash.compose'),
  tsify = require('tsify'),
  sourcemaps = require('gulp-sourcemaps'),
  notify = require('gulp-notify'),
  flow = require('gulp-flowtype'),
  reporter = require('jshint-sourcemap-reporter'),
  source = require('vinyl-source-stream'),
  browserify = require('browserify'),
  exorcist = require('exorcist'),
  watchify = require('watchify'),
  less = require('gulp-less'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  concatcss = require('gulp-concat-css'),
  gls = require('gulp-live-server'),
  watch = require('gulp-watch');

var server,
  appDir = 'src',
  srcDir = 'src/client/scripts',
  styleDir = 'src/client/styles',
  entry = 'video-tooltip.ts',
  buildDir = 'plugin';

/** The array of things to copy over directly */
var assetGlobs = [
  'src/php/**/*.php'
];

function timeTask(stream, taskFn) {
  var start = Date.now();
  taskFn(stream)
    .pipe(notify({
      title: 'Built in ' + (Date.now() - start) + 'ms',
      sound: false
    }));
}

function getBrowserifyBundler(useSourceMaps, useWatchify) {
  var params = useWatchify ? assign({ debug: useSourceMaps }, watchify.args) : { debug: useSourceMaps };
  var wrapper = useWatchify ? compose(watchify, browserify) : browserify;
  params = assign(params, {});
  return wrapper(params).add(require.resolve("./" + srcDir + "/" + entry));
}

gulp.task('watchify', function () {
  var bundle =
    getBrowserifyBundler(true, true)
      // Add a Typescript plugin, and use the ES6 definitions
      .plugin('tsify', { noImplicitAny: true, module: 'commonjs', noLib: false })
      .add('typings/index.d.ts');

  // The bundling process
  var rebundle = function () {
    var start = Date.now();
    var stream = bundle
      .bundle()
      .on("error", notify.onError('<%= error.message %>'))
      .pipe(exorcist(buildDir + '/js/index.js.map')) // for Safari
      .pipe(source("bundle.js"))
      .pipe(gulp.dest(buildDir + '/js'))
      .pipe(notify({
        title: 'Built in ' + (Date.now() - start) + 'ms',
        sound: false
      }));

    // Trigger live reload if the client server is running
    if (server) stream.pipe(server.notify());
  };

  bundle.on('update', rebundle);

  return rebundle();
});

gulp.task('less', function () {
  var stream = gulp.src([styleDir + '/**/*.less'])
    .pipe(sourcemaps.init())
    .pipe(less())
    .on("error", notify.onError('<%= error.message %>'))
    .pipe(postcss([autoprefixer({ map: true, browsers: ['last 2 version'] })]))
    .pipe(concatcss("bundle.css"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(buildDir + "/css"));

  // Trigger live reload if the client server is running
  if (server) stream.pipe(server.notify());

  return stream;
});

gulp.task('less:watch', function () {
  gulp.watch([styleDir + '/**/*.less'], ['less']);
});

gulp.task('copy-assets', function () {
  // Copy everything apart from the src and style folders into the client build folder
  gulp.src(assetGlobs)
    .pipe(gulp.dest(buildDir));
});

gulp.task('copy-assets:watch', function () {
  gulp.watch(assetGlobs, ['copy-assets']);
});

gulp.task('dev', ['watchify', 'less', 'less:watch', 'copy-assets', 'copy-assets:watch']);

gulp.task('default', ['dev'], function () {
  // Serve the root folder as well to give access to assets in node_modules when developing
  // server = gls.static([buildDir, '/']);
  // server = gls.new('server.js');
  // server.start();
});
