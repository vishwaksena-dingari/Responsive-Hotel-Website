"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass")(require("node-sass"));
const browserSync = require("browser-sync").create();
const del = require("del");
const imageminimport = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const useminimport = require('gulp-usemin');
const rev = require('gulp-rev');
const cleanCss = require('gulp-clean-css');
const flatmap = require('gulp-flatmap');
const htmlmin = require('gulp-htmlmin');

function style() {
  return gulp
    .src("./css/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./css"));
}

function sasswatch() {
  gulp.watch("./css/*.scss", style);
}

function browsersync() {
  var files = ["./*.html", "./css/*.css", "./js/*.js", "./img/*{png,jpg,gif}"];
  browserSync.init(files, {
    server: {
      baseDir: "./",
    },
  });
}

function clean() {
  return del(["dist"]);
}

function copyfonts() {
  return gulp
    .src("./node_modules/font-awesome/fonts/**/*.*")
    .pipe(gulp.dest("./dist/fonts"));
}

function imagemin() {
  return gulp
    .src("img/*.{png,jpg,png}")
    .pipe(
      imageminimport({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true,
      }).pipe(gulp.dest("dist/img"))
    );
}

function usemin(){
    return gulp.src('./*.html').pipe(flatmap(function(stream, file) {
        return stream.pipe(useminimport({
            css: [rev()],
            html: [function(){return htmlmin({collapseWhitespace: true})}],
            js: [uglify(), rev()],
            inlinejs: [cleanCss(), 'concat']
        }))
    })).pipe(gulp.dest('dist/'))
}


var build = gulp.series(clean, gulp.parallel(copyfonts, imagemin, usemin));

exports.style = style;
exports.sasswatch = sasswatch;
exports.browsersync = browsersync;
exports.build = build;
exports.clean = clean;
exports.copyfonts = copyfonts;

exports.default = build;
