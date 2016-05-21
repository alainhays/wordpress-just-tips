var gulp = require('gulp'),
  assign = require('lodash.assign'),
  autoprefixer = require('autoprefixer'),
  babel = require('gulp-babel'),
  bower = require('gulp-bower'),
  browserify = require('browserify'),
  compose = require('lodash.compose'),
  concatcss = require('gulp-concat-css'),
  exorcist = require('exorcist'),
  gls = require('gulp-live-server'),
  less = require('gulp-less'),
  notify = require('gulp-notify'),
  postcss = require('gulp-postcss'),
  reporter = require('jshint-sourcemap-reporter'),
  source = require('vinyl-source-stream'),
  sourcemaps = require('gulp-sourcemaps'),
  tsify = require('tsify'),
  watch = require('gulp-watch'),
  watchify = require('watchify'),
  wiredep = require('gulp-wiredep');

var server,
  app = 'app',
  components = 'dist/components',
  destination = 'dist',
  entry = 'video-tooltip.ts',
  html = 'dist/**/*.html',
  scripts = 'app/scripts',
  styles = 'app/styles/**/*.less';

var assets = [
  'app/**/*.html',
  'app/php/**/*.php'
];

function bundler(useSourceMaps, useWatchify) {
  var params = useWatchify ? assign({ debug: useSourceMaps }, watchify.args) : { debug: useSourceMaps };
  var wrapper = useWatchify ? compose(watchify, browserify) : browserify;
  params = assign(params, {});
  return wrapper(params).add(require.resolve('./' + scripts + '/' + entry));
}

function logbuild(start) {
  return 'Built in ' + (Date.now() - start) + 'ms';
}

function notifier(stream, taskFn) {
  var start = Date.now();
  taskFn(stream)
    .pipe(notify({
      title: logbuild(start),
      sound: false
    }));
}

gulp.task('bower', function () {
  return bower();
});
gulp.task('bower:watch', ['bower'], function () {
  gulp.watch('bower.json', {
    interval: 1000
  }, ['wiredep']).on('error', function (error) {
    console.log(error);
  });
});

gulp.task('watchify', ['bower:watch', 'less:watch', 'assets:watch', 'wiredep:watch'], function () {
  var bundle = bundler(true, true);

  bundle.plugin('tsify', {
    module: 'commonjs',
    noImplicitAny: true,
    noLib: false,
    target: 'es5'
  }).add('typings/index.d.ts');

  var rebundle = function () {
    var start = Date.now();
    var stream = bundle
      .bundle()
      .on('error', notify.onError('<%= error.message %>'))
      .pipe(exorcist(destination + '/js/index.js.map'))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest(destination + '/js'))
      .pipe(notify({
        title: logbuild(start),
        sound: false
      }));

    if (server) stream.pipe(server.notify());
  };

  bundle.on('update', rebundle);

  return rebundle();
});

gulp.task('less', ['bower'], function () {
  var stream = gulp.src([styles])
    .pipe(sourcemaps.init())
    .pipe(less())
    .on('error', notify.onError('<%= error.message %>'))
    .pipe(postcss([autoprefixer({ map: true, browsers: ['last 2 version'] })]))
    .pipe(concatcss('bundle.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destination + '/css'));

  if (server) stream.pipe(server.notify());

  return stream;
});
gulp.task('less:watch', ['bower', 'less'], function () {
  gulp.watch([styles], ['less']);
});

gulp.task('assets', ['bower'], function () {
  gulp.src(assets).pipe(gulp.dest(destination));
});
gulp.task('assets:watch', ['assets', 'bower'], function () {
  gulp.watch(assets, ['assets']);
});

gulp.task('wiredep', ['bower'], function () {
  gulp.src(html).pipe(wiredep({
    directory: components,
    options: {
      cwd: 'dist'
    }
  })).pipe(gulp.dest(destination));
});
gulp.task('wiredep:watch', ['bower', 'wiredep'], function () {
  gulp.watch([html], ['wiredep']);
});

gulp.task('dev', ['watchify']);

gulp.task('default', ['dev'], function () {
  server = gls.static([destination]);
  server.start();
});
