var gulp = require('gulp'),
  assign = require('lodash.assign'),
  autoprefixer = require('autoprefixer'),
  babel = require('gulp-babel'),
  bower = require('gulp-bower'),
  browserify = require('browserify'),
  clean = require('gulp-clean'),
  compose = require('lodash.compose'),
  concatcss = require('gulp-concat-css'),
  exorcist = require('exorcist'),
  gls = require('gulp-live-server'),
  less = require('gulp-less'),
  package = JSON.parse(require('fs').readFileSync('./package.json')),
  postcss = require('gulp-postcss'),
  reporter = require('jshint-sourcemap-reporter'),
  shrinkwrap = require('gulp-shrinkwrap'),
  source = require('vinyl-source-stream'),
  sourcemaps = require('gulp-sourcemaps'),
  tsify = require('tsify'),
  typings = require('gulp-typings'),
  watch = require('gulp-watch'),
  watchify = require('watchify'),
  wiredep = require('gulp-wiredep'),
  zip = require('gulp-zip');

var server,
  app = 'app',
  components = 'dist/components',
  destination = 'dist',
  entry = 'video-tooltip.ts',
  html = 'app/**/*.html',
  scripts = 'app/scripts',
  styles = 'app/styles/**/*.less';

var assets = [
  'app/**/*.html',
  'app/php/**/*.php'
];

function bundler(useSourceMaps, useWatchify) {
  function create() {
    var params = useWatchify ? assign({ debug: useSourceMaps }, watchify.args) : { debug: useSourceMaps };
    var wrapper = useWatchify ? compose(watchify, browserify) : browserify;
    params = assign(params, {});
    return wrapper(params)
      .add(require.resolve('./' + scripts + '/' + entry))
      .plugin('tsify', {
        module: 'commonjs',
        noImplicitAny: true,
        noLib: false,
        pretty: true,
        target: 'es5'
      }).add('typings/index.d.ts');
  }

  var bundle = create();

  var rebundle = function () {
    var start = Date.now();
    var stream = bundle.bundle()
      .pipe(exorcist(destination + '/bundle.js.map'))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest(destination))
    return (server ? stream.pipe(server.notify()) : stream);
  };

  bundle.on('update', rebundle);

  return rebundle();
}

function logbuild(start) {
  return 'Built in ' + (Date.now() - start) + 'ms';
}

gulp.task('bower', function () {
  return bower();
});
gulp.task('bower:watch', ['bower'], function () {
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('typings', function () {
  return gulp.src('typings.json').pipe(typings());
});
gulp.task('typings:watch', ['typings'], function () {
  gulp.watch('typings.json', ['typings']);
});

gulp.task('watchify', ['bower:watch', 'typings:watch', 'assets:watch', 'less:watch', 'wiredep:watch'], function () {
  return bundler(true, true);
});

gulp.task('less', ['bower'], function () {
  var stream = gulp.src(styles)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(postcss([autoprefixer({ map: true, browsers: ['last 2 version'] })]))
    .pipe(concatcss('bundle.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destination));
  return (server ? stream.pipe(server.notify()) : stream);
});
gulp.task('less:watch', ['less'], function () {
  gulp.watch(styles, ['less']);
});

gulp.task('assets', ['less'], function () {
  return gulp.src(assets).pipe(gulp.dest(destination));
});
gulp.task('assets:watch', ['assets'], function () {
  gulp.watch(assets, ['assets']);
});

gulp.task('shrinkwrap', function () {
  return gulp.src('package.json')
    .pipe(shrinkwrap())
    .pipe(gulp.dest('.'));
});

gulp.task('package', ['build', 'shrinkwrap'], function () {
  return gulp.src(destination + '/**/*')
    .pipe(zip('plugin-video-tooltip-' + package.version + '.zip'))
    .pipe(gulp.dest(destination));
});

gulp.task('wiredep', ['assets', 'bower'], function () {
  var stream = gulp.src(destination + '/**/*.html').pipe(wiredep({
    directory: components,
    options: {
      cwd: 'dist'
    }
  })).pipe(gulp.dest(destination));
  return (server ? stream.pipe(server.notify()) : stream);
});
gulp.task('wiredep:watch', ['wiredep'], function () {
  gulp.watch([html], ['wiredep']);
});

/* Entry-points */

gulp.task('clean:dist', function () {
  return gulp.src(['dist']).pipe(clean());
});

gulp.task('default', ['watch'], function () {
  server = gls.static([destination]);
  server.start();
});

gulp.task('build', ['assets', 'less', 'typings', 'wiredep'], function () { return bundler(true, false); });
gulp.task('release', ['clean:dist'], function () { return gulp.start(['bower', 'build', 'package']); });
gulp.task('watch', ['watchify']);
