'use strict';

var dist = 'dist'; // Name the output folder
var ignore = []; // <---------- Provide a list of selectors that should not be removed by UnCSS.

const gulp          = require('gulp'),                        // Automate and enhance your workflow
      babel         = require('gulp-babel'),                  // Use next generation JavaScript, today
      cache         = require('gulp-cache'),                  // A cache proxy plugin for gulp
      cached        = require('gulp-cached'),                 // A simple in-memory file cache for gulp
      concat        = require('gulp-concat'),                 // Concatenates files
      csso          = require('gulp-csso'),                   // Minify CSS with CSSO
      debug         = require('gulp-debug'),                  // Debug vinyl file streams to see what files are run through your gulp pipeline
      fileInclude   = require('gulp-file-include'),           // A gulp plugin for file include (->)
      filesize      = require('gulp-filesize'),               // Logs filesizes in human readable Strings
      util          = require('gulp-util' ),                  // Utility functions for gulp plugins
      imagemin      = require('gulp-imagemin'),               // Minify PNG, JPEG, GIF and SVG images
      include       = require('gulp-include'),                // Makes inclusion of files a breeze.
      newer         = require('gulp-newer'),                  // Only pass through newer source files
      notify        = require("gulp-notify"),                 // Gulp plugin to send messages based on Vinyl Files or Errors to Mac OS X, Linux or Windows using the node-notifier module. Fallbacks to Growl or simply logging
      postcss       = require('gulp-postcss'),                // Pipe CSS through PostCSS processors with a single parse
      plumber       = require('gulp-plumber'),                // Prevent pipe breaking caused by errors from gulp plugins
      rename        = require('gulp-rename'),                 // Rename files
      sass          = require('gulp-sass'),                   // Gulp plugin for sass
      sassmixins    = require('gulp-sass-to-postcss-mixins'), // Plugin to replace sass-syntax mixins with PostCSS mixins.
      scss          = require('gulp-scss'),                   // Gulp plugin for scss
      bourbon       = require('node-bourbon'),                // Node-sass wrapper for thoughtbot's bourbon library
      shorthand     = require('gulp-shorthand'),              // Makes your CSS files lighter and more readable
      size          = require('gulp-size'),                   // Display the size of your project
      sourcemaps    = require('gulp-sourcemaps'),             // Source map support for gulp.js
      uglify        = require('gulp-uglifyjs'),               // Minify files with UglifyJS
      uncss         = require('gulp-uncss'),                  // Remove unused CSS selectors
      gutil         = require('gulp-util' ),                 // Utility functions for gulp plugins
      zip           = require('gulp-zip'),                    // ZIP compress files
      browserSync   = require('browser-sync'),                // Time-saving synchronised browser testing
      cssnano       = require('cssnano'),                     // A modular minifier, built on top of the PostCSS ecosystem
      del           = require('del'),                         // Delete files and folders
      ftp           = require('vinyl-ftp'),                   // Vinyl adapter for FTP
      pngquant      = require('imagemin-pngquant'),           // Pngquant imagemin plugin
      assets        = require('postcss-assets'),              // PostCSS Assets is an asset manager for CSS
      comments      = require('postcss-discard-comments'),    // Discard comments in your CSS files with PostCSS.
      cssnext       = require('postcss-cssnext'),             // PostCSS plugin to use tomorrow's CSS syntax, today
      hexa          = require('postcss-color-hexa'),          // A postcss plugin that enables the use of hexa() to combine hex codes and opacity into rgba()
      nested        = require('postcss-nested'),              // PostCSS plugin to unwrap nested rules like how Sass does it.
      postscss      = require('postcss-scss'),                // SCSS parser for PostCSS
      precss        = require('precss'),                      // Use Sass-like markup in your CSS
      short         = require('postcss-short'),               // Use advanced shorthand properties in CSS
      sorting       = require('postcss-sorting'),             // PostCSS plugin to sort rules content with specified order
      em            = require('postcss-px-to-em'),            // PostCSS plugin to convert all px measurements to em
      wiredep       = require('wiredep').stream,              // Wire Bower dependencies to your source code.
      mqpacker      = require('css-mqpacker'),                // Pack same CSS media query rules into one media query rule.
      stylefmt      = require('stylefmt'),                    // Stylefmt is a tool that automatically formats stylesheets.
      stripInlineComments = require('postcss-strip-inline-comments'); // Strip inline comments using the postcss-scss parser

var path = {
  // Sources
  app: {
    app         : 'app/',
    html        : 'app/*.html',
    php         : 'app/*.php',
    img         : 'app/img/**/*',
    loadPaths   : 'app/img/',
    js          : 'app/js/',
    mainjs      : 'app/js/ES6.js',
    JSLibraries : 'app/js/libs.js',
    css         : 'app/css/',
    maincss     : 'app/css/main.scss',
    libs        : 'app/css/libs.scss',
    _base       : 'app/css/_base.scss',
    _media      : 'app/css/_media.scss',
    _vars       : 'app/css/_vars.scss',
    fonts       : 'app/css/fonts.css',
    sass        : 'app/css/sass.sass',
    all_fonts   : 'app/fonts/**/*'
  },
  // Destination
  dist : {
    dist        : dist,
    img         : dist + '/img/',
    css         : dist + '/css/',
    js          : dist + '/js/',
    fonts       : dist + '/fonts/'
  }
};

// Static server
gulp.task('browser-sync', function () {

  browserSync({
    server: {
      baseDir: path.app.app
    },
    notify: false
  });

});

// PostCSS gulp plugin to pipe CSS through several processors, but parse CSS only once.
gulp.task('post-css', function () {

  var processors = [
    stripInlineComments,
    precss,
    sassmixins,
    assets({
      loadPaths: [path.app.loadPaths],
      relativeTo: path.app.css
    }),
    nested,
    short,
    cssnext({browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7']}),
    hexa,
    sorting,
    mqpacker,
    stylefmt
  ];

  return gulp.src(path.app.maincss)
    .pipe(debug({title: 'post-css: src       '}))

  .pipe(plumber({
    errorHandler: notify.onError(function(err) {
      return {
        title: "post-css",
        message: err.message
      }
    })
  }))
    .pipe(debug({title: 'post-css: plumber   '}))

  .pipe(fileInclude({
    prefix: '->'
  }))
    .pipe(debug({title: 'post-css: include   '}))

  .pipe(postcss(processors, {syntax: postscss}))
    .pipe(debug({title: 'post-css: css       '}))

  .pipe(shorthand())
    .pipe(debug({title: 'post-css: shorthand '}))

  .pipe(rename('main.css'))
    .pipe(debug({title: 'post-css: rename    '}))

  .pipe(gulp.dest(path.app.css))
    .pipe(debug({title: 'post-css: dest      '}))

  .pipe(rename({suffix: '.min'}))
    .pipe(debug({title: 'post-css: rename    '}))

  .pipe(csso())
    .pipe(debug({title: 'post-css: csso      '}))

  .pipe(gulp.dest(path.app.css))
    .pipe(debug({title: 'post-css: dest      '}))

  .pipe(browserSync.reload({stream: true}))

});

gulp.task('sass', function () {

  return gulp.src(path.app.sass)
    .pipe(debug({title: 'sass: src           '}))

  .pipe(plumber({
    errorHandler: notify.onError(function(err) {
      return {
        title: "sass",
        message: err.message
      }
    })
  }))
    .pipe(debug({title: 'sass: plumber       '}))

  .pipe(sass({
    includePaths: bourbon.includePaths,
    outputStyle: 'expanded'
  }))
    .pipe(debug({title: 'sass: sass          '}))

  .pipe(rename('sass.css'))
    .pipe(debug({title: 'sass: rename        '}))

  .pipe(gulp.dest(path.app.css))
    .pipe(debug({title: 'sass: dest          '}))

  .pipe(browserSync.reload({stream: true}))

});

// Concatenating and minifying CSS libs
gulp.task('libs-css', function () {

  var processors = [
    sorting,
    cssnext({browsers: ['last 15 versions', '> 1%', 'ie 8']}),
    comments
  ];

  return gulp.src(path.app.libs)
    .pipe(debug({title: 'libs-css: src       '}))

  .pipe(plumber({
    errorHandler: notify.onError(function(err) {
      return {
        title: "libs-css",
        message: err.message
      }
    })
  }))
    .pipe(debug({title: 'libs-css: plumber   '}))

  // .pipe(wiredep({
  //   fileTypes: {
  //
  //     sass: {
  //       block: /(([ \t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
  //       replace: {
  //         css:  '->include("{{filePath}}")',
  //         sass: '->include("{{filePath}}")',
  //         scss: '->include("{{filePath}}")'
  //       }
  //     }
  //
  //   }
  // }))
  //   .pipe(debug({title: 'libs-css: bower     '}))
  //
  // .pipe(rename('bower.scss'))
  //   .pipe(debug({title: 'libs-css: rename    '}))
  //
  // .pipe(gulp.dest(path.app.css))
  //   .pipe(debug({title: 'libs-css: dest      '}))

  .pipe(fileInclude({
    prefix: '->'
  }))
    .pipe(debug({title: 'libs-css: include   '}))

  .pipe(postcss(processors, {syntax: postscss}))
    .pipe(debug({title: 'libs-css: postcss   '}))

  .pipe(uncss({
    html: [path.app.html],
    ignore: ignore
  }))
    .pipe(debug({title: 'libs-css: uncss     '}))

  .pipe(csso()) // Сжимаем
    .pipe(debug({title: 'libs-css: csso      '}))

  .pipe(rename('libs.min.css'))
    .pipe(debug({title: 'libs-css: rename    '}))

  .pipe(gulp.dest(path.app.css))
    .pipe(debug({title: 'libs-css: dest      '}))

  .pipe(browserSync.reload({stream: true}))

});

// Create an js task
gulp.task('es6', function () {

  return gulp.src(path.app.mainjs)
    .pipe(debug({title: 'es6: src            '}))

  .pipe(plumber({
    errorHandler: notify.onError(function(err) {
      return {
        title: "ES6",
        message: err.message
      }
    })
  }))
    .pipe(debug({title: 'es6: plumber        '}))

  .pipe(babel({
    // We need to tell babel to use the babel-preset-es2015
    presets: ['es2015']
  }))
    .pipe(debug({title: 'es6: babel          '}))

  .pipe(rename('main.js'))
    .pipe(debug({title: 'es6: rename         '}))

  .pipe(gulp.dest(path.app.js))
    .pipe(debug({title: 'es6: dest           '}))

  .pipe(uglify())
    .pipe(debug({title: 'es6: uglify         '}))

  .pipe(rename('main.min.js'))
    .pipe(debug({title: 'es6: rename         '}))

  .pipe(gulp.dest(path.app.js))
    .pipe(debug({title: 'es6: dest           '}))

  .pipe(browserSync.reload({stream: true}));

});

// Concatenating and minifying JS libs
gulp.task('libs-scripts', function () {

  return gulp.src(path.app.JSLibraries)
    .pipe(debug({title: 'libs-js: src        '}))

  .pipe(plumber({
    errorHandler: notify.onError(function(err) {
      return {
        title: "libs-scripts",
        message: err.message
      }
    })
  }))
    .pipe(debug({title: 'libs-js: plumber    '}))

  // .pipe(wiredep({
  //   fileTypes: {
  //
  //     js: {
  //       block: /(([ \t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
  //       replace: {
  //         js: '->include("{{filePath}}")'
  //       }
  //     }
  //
  //   }}))
  //   .pipe(debug({title: 'libs-js: bower      '}))
  //
  // .pipe(rename('bower.js'))
  //   .pipe(debug({title: 'libs-js: rename     '}))
  //
  // .pipe(gulp.dest('app/js'))
  //   .pipe(debug({title: 'libs-js: dest       '}))

  .pipe(fileInclude({
    prefix: '->'
  }))
    .pipe(debug({title: 'es6: include        '}))

  .pipe(uglify())
    .pipe(debug({title: 'libs-js: uglify     '}))

  .pipe(rename('libs.min.js'))
    .pipe(debug({title: 'libs-js: rename     '}))

  .pipe(gulp.dest(path.app.js))
    .pipe(debug({title: 'libs-js: dest       '}))

  .pipe(browserSync.reload({stream: true}));

});

gulp.task('html', function () {

  return gulp.src(path.app.html)
  .pipe(browserSync.reload({stream: true}));

});

gulp.task('watch', [ 'browser-sync', 'libs-css', 'post-css', 'libs-scripts', 'es6'], function () {

  gulp.watch([path.app._base, path.app._media, path.app._vars, path.app.maincss], ['post-css']);
  gulp.watch(path.app.libs, ['libs-css']);
  gulp.watch(path.app.mainjs, ['es6']);
  gulp.watch(path.app.JSLibraries, ['libs-scripts']);
  gulp.watch(path.app.html, [ 'html', 'libs-css']);
  gulp.watch(path.app.php, browserSync.reload);
  gulp.watch(path.app.sass, ['sass']);
  // gulp.watch('bower.json', ['libs-scripts', 'libs-css']);

});

gulp.task('clean', function () {

  return del.sync(dist);

});

gulp.task('clear', function (callback) {

  return cache.clearAll();

});

gulp.task('img', function () {

  return gulp.src(path.app.img)
    .pipe(debug({title: 'img: src            '}))

  .pipe(plumber({
    errorHandler: notify.onError(function(err) {
      return {
        title: "img",
        message: err.message
      }
    })
  }))
    .pipe(debug({title: 'img: plumber        '}))

  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  })))
    .pipe(debug({title: 'img: imagemin       '}))

  .pipe(gulp.dest(dist + '/img'))
    .pipe(debug({title: 'img: dest           '}))

});

gulp.task('build', ['clean', 'post-css', 'libs-css', 'es6', 'libs-scripts', 'img', 'zip'], function () {

  var buildCss = gulp.src([
    'app/css/libs.min.css',
    'app/css/main.min.css',
    'app/css/main.css',
    'app/css/fonts.css'
  ])
  .pipe(gulp.dest(dist + '/css/'));

  var buildFonts = gulp.src('app/fonts/**/*')
  .pipe(gulp.dest(dist + '/fonts/'));

  var buildJs = gulp.src([
    'app/js/libs.min.js',
    'app/js/main.min.js',
    'app/js/main.js'
  ])
  .pipe(gulp.dest(dist + '/js/'));

  var buildHtml = gulp.src('app/*.html')
  .pipe(gulp.dest(dist));

  var buildPHP = gulp.src('app/*.php')
  .pipe(gulp.dest(dist));

});

gulp.task('zip', function () {

  return gulp.src([dist + '/**/*'])
  .pipe(zip(dist + '.zip'))
  .pipe(gulp.dest('.'))

});

gulp.task('deploy', function() {

  var conn = ftp.create({
    host:      'ivanchaban.hol.es',
    user:      'u257672573',
    password:  'IQ5rkKkPrq',
    parallel:  10,
    log: gutil.log
  });

  var globs = dist + '/**/*';
  return gulp.src(globs, {base: '.', buffer: false})

  .pipe(plumber({
    errorHandler: notify.onError(function(err) {
      return {
        title: "img",
        message: err.message
      }
    })
  }))
    .pipe(debug({title: 'deploy: plumber     '}))

  .pipe(conn.newer('/public_html'))
    .pipe(debug({title: 'deploy: newer       '}))

  .pipe(conn.dest( '/public_html' ))
    .pipe(debug({title: 'deploy: dest        '}))

});

gulp.task('default', ['watch']);
