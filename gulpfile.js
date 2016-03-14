var gulp = require('gulp');
var runSequence = require('run-sequence');

var del = require('del');

var htmlreplace = require('gulp-html-replace');

var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
var ghPages = require('gulp-gh-pages');


var File = require('vinyl');
var mapStream = require('map-stream');


var getScripts = require('./gulp-get-scripts');

gulp.task('default', ['html', 'data', 'images', 'fonts']);

var dist = 'dist';
var html = ['app/index.html'];
var template = ['app/jlg-typeahead/tmpl/popup-item.html', 'app/menu/**/*.html', 'app/route/**/*.html'];
var images = ['app/**/*.ico', 'app/**/*.png'];
var fonts = ['bower_components/bootstrap/dist/fonts/*'];
var data = ['app/**/*.json', 'app/**/*.csv'];
var css = 'app/**/*.css';
var js = 'app/**/*.js';

// Delete the dist directory
gulp.task('clean', function() {
	return del(dist);
});

gulp.task('template', function() {
	return gulp.src(template, {base: 'app'})
		.pipe(templateCache({ base: function(file) {		
			return file.relative;
		}}))
		.pipe(gulp.dest(dist));
});

gulp.task('images', function() {
	return gulp.src(images)
		.pipe(gulp.dest(dist));
});

gulp.task('fonts', function() {
	return gulp.src(fonts, { base: 'bower_components/bootstrap/dist' })
		.pipe(gulp.dest(dist));
});

gulp.task('data', function() {
	return gulp.src(data)
		.pipe(gulp.dest(dist));
});

gulp.task('css', function() {
	return gulp.src(html)
		.pipe(getScripts('.*<link.*target="app".*rel="stylesheet".*href="(.*?)".*/>'))
		.pipe(cleanCSS())
		.pipe(concat('css/style.min.css'))
		.pipe(gulp.dest(dist));
});

gulp.task('js', function() {
	return gulp.src(html)
		.pipe(getScripts('.*<script.*target="app".*src="(.*.*?)".*?></script>.*'))
		.pipe(mapStream(log('about to uglify')))
		.pipe(uglify())
		.pipe(concat('app.min.js'))
		.pipe(gulp.dest(dist));
});

var log = function(message) {
	return function(file, cb) {
		//console.log(message, file.path);
		cb(null, file);
	};
};

gulp.task('vendors:css', function() {
	return gulp.src(html)
		.pipe(getScripts('.*<link.*target="vendors".*rel="stylesheet".*href="((.*bower_component.*?))" />'))
		.pipe(cleanCSS())
		.pipe(concat('css/vendors.min.css'))
		.pipe(gulp.dest(dist));
});

gulp.task('vendors:js', function() {
	return gulp.src(html)
		.pipe(getScripts('.*<script.*target="vendors".*src="(.*bower_component.*?)".*?></script>.*'))
		.pipe(mapStream(log('about to uglify')))
		.pipe(uglify())
		.pipe(mapStream(log('about to concat')))
		.pipe(concat('vendors.min.js'))
		.pipe(gulp.dest(dist));
});

gulp.task('html', function() {
	return gulp.src(html)
		.pipe(htmlreplace({
			js: ['vendors.min.js', 'app.min.js', 'templates.js'],
			css: ['css/vendors.min.css', 'css/style.min.css']
		}))
		.pipe(gulp.dest(dist));
});

gulp.task('deploy', function() {
	return gulp.src('./dist/**/*')
		.pipe(ghPages({ cacheDir: '../.publish_boof'}));
});

gulp.task('build', ['data', 'images', 'fonts', 'html', 'css', 'js', 'template' ], function() {
	console.log('building build');
});

gulp.task('rebuild', function() {
	runSequence('clean', 'vendors', 'build');
});

gulp.task('vendors', function() {
	runSequence('vendors:css', 'vendors:js');
});

gulp.task('watch', function() {
	var watcher = gulp.watch('app/**/*', ['build']);
	watcher.on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});





