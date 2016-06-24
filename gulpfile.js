var gulp = require('gulp');
var surge = require('gulp-surge');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

gulp.task('browserify', function () {
    return browserify({
        entries: ['sortable.js'],
    })
        // .transform('babelify', { presets: ['es2015']})
        .bundle()
        .pipe(source('sortable.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./build/'));
});

gulp.task('css', function () {
    return gulp.src('**/*.css')
        .pipe(gulp.dest('./build/'));
});

gulp.task('html', function () {
    return gulp.src('**/*.html')
        .pipe(gulp.dest('./build/'));
});

gulp.task('build', ['browserify', 'css', 'html']);

gulp.task('deploy', ['build'], function () {
    return surge({
	project: './build',         // Path to your static build directory
	domain: 'dysfunctional-industry.surge.sh'
    });
});

gulp.task('dev', ['browserify', 'css', 'html'], function() {
});
