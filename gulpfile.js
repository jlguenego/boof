var gulp = require('gulp');
var del = require('del');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var templateCache = require('gulp-angular-templatecache');


gulp.task('default', ['clean', 'html']);

var dist = 'dist/';
var html = ['app/index.html'];
var template = ['tmpl/**/*.html'];

// Delete the dist directory
gulp.task('clean', function() {
	return del(dist);
});

gulp.task('html', function() {
	return gulp.src(html)
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(gulp.dest(dist));
});

gulp.task('templates', function () {
  return gulp.src(template)
    .pipe(templateCache())
    .pipe(gulp.dest('dist'));
});

