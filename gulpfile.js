var gulp = require('gulp'),
webserver = require('gulp-webserver'),
rename = require('gulp-rename'),
del = require('del'),
browserify = require('browserify'),
sourcemaps = require('gulp-sourcemaps'),
minifyCSS = require('gulp-minify-css'),
uglify = require('gulp-uglify'),
buffer = require('vinyl-buffer'),
source = require('vinyl-source-stream'),
jshint = require('gulp-jshint'),
merge = require('merge-stream'),
plumber = require('gulp-plumber');

var path = {
  images:    './src/app/assets/images/**/*.*',
  js:        './src/app/assets/js/**/*.js',
  vendor:    './src/app/assets/js/vendor/**/*.*',
  style:     './src/app/assets/style/**/*.css',
  templates: './src/app/assets/templates/**/*.html',
  index:     './src/app/index.html'
};

gulp.task('delete', function(){
  return del(['build/**/*'])
    .then(function(err){
      console.log('Files Deleted');
    });
});

gulp.task('images', function() {
  return gulp.src(path.images)
    .pipe(gulp.dest('./build/assets/images'));
});

gulp.task('style', function(){
  return gulp
    .src('./src/assets/style/style.css')
    //.pipe(minifyCSS())
    //.pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./build/assets/style'));
});

gulp.task('styleVendor', function(){
  return gulp.src('./src/app/assets/style/vendor/**/*.*')
  .pipe(gulp.dest('./build/assets/style/vendor'));
});

// gulp.task('jsVendor', function(){
//   return gulp.src(path.vendor)
//   .pipe(gulp.dest('./build/assets/js/vendor'));
// });

gulp.task('jsAll', function(){
  return gulp.src('./src/app/assets/js/*/*.js')
  .pipe(gulp.dest('./build/assets/js/'));
});

gulp.task('js', function(){
  var bundler = browserify({
    entries: ['./src/app/assets/js/app.js', './src/app/assets/js/routes.js'],
    debug: true
  });


  var bundle = function(){
    return bundler
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./build/assets/js/'));
  };

  return bundle();
  /*return gulp
    .src('js/script.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(jshint())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./build/js'));
    */
});

gulp.task('index', function(){
  return gulp.src(path.index)
    .pipe(gulp.dest('./build/'));
});

gulp.task('templates', function(){
  return gulp.src('./src/app/assets/templates/**/*')
    .pipe(gulp.dest('./build/assets/templates'));
});

gulp.task('build', [ 'jsAll', 'js', 'style', 'styleVendor', 'index', 'templates', 'images']);

gulp.task('watch', ['build'], function(){
  gulp.watch('./src/app/assets/js/*/*.js', ['jsAll']);
  gulp.watch(path.js, ['js']);
  gulp.watch(path.style, ['style']);
  gulp.watch(path.images, ['images']);
  gulp.watch(path.index, ['index']);
  gulp.watch(path.templates, ['templates']);
});

gulp.task('default', ['watch']);
