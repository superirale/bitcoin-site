var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'template'
    }
  })
})

gulp.task('sass', function() {
  gulp.src('template/assets/scss/**/*.scss')
    .pipe(concat('main.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('template/assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('default',['sass','browserSync'], function() {
  gulp.watch( 'template/assets/scss/**/*.scss', ['sass'] );
  gulp.watch( 'template/assets/scss/**/*.scss', browserSync.reload);
  gulp.watch( 'template/assets/js/**/*.js', browserSync.reload);
});
