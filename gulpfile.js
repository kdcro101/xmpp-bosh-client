const gulp = require('gulp');
const ts = require('gulp-typescript');
const jasmine = require('gulp-jasmine');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');
var exec = require('child_process').exec;

// var merge = require('merge-stream');
const merge = require('merge2');

gulp.task('build-type-definitions', function() {

	const tsProject = ts.createProject('tsconfig.json');

	var tsResult = tsProject.src()
		.pipe(tsProject());

	return merge([
		// tsResult.dts.pipe(gulp.dest('./definitions')),
		tsResult.dts.pipe(gulp.dest('./definitions')),
		tsResult.dts.pipe(gulp.dest('./browser'))
		// tsResult.js.pipe(gulp.dest(tsProject.config.compilerOptions.outDir))

	]);
});

gulp.task('clean', function() {
	const task1 = gulp.src('dist', { read: false }).pipe(clean());
	const task2 = gulp.src('browser-bundle', { read: false }).pipe(clean());

    return merge(task1,task2);
});

gulp.task('build-project', function(cb) {
	exec('./node_modules/typescript/bin/tsc -p ./', function(err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
});

gulp.task('build-bundle', function(cb) {
	exec('script/browserfy-bundle.sh', function(err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
});
gulp.task('build-main', function(cb) {
	exec('script/browserfy-browser.sh', function(err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
});

gulp.task('test:run', function() {
	return gulp.src('node/spec/*.spec.js')
		.pipe(jasmine())
});

gulp.task('test', [], function(next) {
	runSequence('clean', 'build-type-definitions', 'build-project', 'build-bundle', 'test:run', next);
});

gulp.task('default', [], function(cb) {
	runSequence('clean', 'build-type-definitions', 'build-project', 'build-bundle', 'build-main', cb);
});