var gulp = require('gulp');
var del = require('del');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var templateCache = require('gulp-angular-templatecache');
var inject = require('gulp-inject');
var ghPages = require('gulp-gh-pages');


gulp.task('default', ['html', 'data', 'images', 'fonts']);

var dist = 'dist';
var html = ['app/index.html'];
var template = ['app/jlg-typeahead/tmpl/popup-item.html', 'app/menu/**/*.html', 'app/route/**/*.html'];
var images = ['app/**/*.ico', 'app/**/*.png'];
var fonts = ['bower_components/bootstrap/dist/fonts/*'];
var data = ['app/**/*.json', 'app/**/*.csv'];

// Delete the dist directory
gulp.task('clean', function() {
	return del(dist);
});

gulp.task('template', ['clean'], function() {
	return gulp.src(template, {base: 'app'})
		.pipe(templateCache({ base: function(file) {		
			return file.relative;
		}}))
		.pipe(gulp.dest(dist));
});

gulp.task('images', ['clean'], function() {
	return gulp.src(images)
		.pipe(gulp.dest(dist));
});

gulp.task('fonts', ['clean'], function() {
	return gulp.src(fonts, { base: 'bower_components/bootstrap/dist' })
		.pipe(gulp.dest(dist));
});

gulp.task('data', ['clean'], function() {
	return gulp.src(data)
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

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages({ cacheDir: '../.publish_boof'}));
});




