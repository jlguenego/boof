var gulp = require('gulp');
var del = require('del');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var templateCache = require('gulp-angular-templatecache');
var inject = require('gulp-inject');


gulp.task('default', ['html']);

var dist = 'dist';
var html = ['app/index.html'];
var template = ['app/popup/**/*.html', 'app/menu/**/*.html'];

// Delete the dist directory
gulp.task('clean', function() {
	return del(dist);
});

gulp.task('template', ['clean'], function() {
	return gulp.src(template)
		.pipe(templateCache())
		.pipe(gulp.dest(dist));
});

gulp.task('html', ['clean', 'template'], function() {
	
	return gulp.src(html)
		.pipe(inject(gulp.src([dist + '/templates.js'], {read: false}), {addRootSlash: false, ignorePath: dist}))
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(gulp.dest(dist));
});



