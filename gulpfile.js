/// <binding Clean='clean' />

const gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cleanCSS = require("gulp-clean-css"),
    uglify = require("gulp-uglify"),
    merge = require("merge-stream");

const paths = {
    npm: "./node_modules/",
    lib: "./wwwroot/lib/",
    webroot: "./wwwroot/"
};

paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.cleanCSS = paths.webroot + "css/**/*.min.css";
paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css";

gulp.task("clean:lib", cb => rimraf(paths.lib, cb));

gulp.task("clean:js", cb => rimraf(paths.concatJsDest, cb));

gulp.task("clean:css", cb => rimraf(paths.concatCssDest, cb));

gulp.task("clean", gulp.parallel("clean:js", "clean:css", "clean:lib"));

gulp.task("copy", gulp.series("clean",
        () => {
            const d3Components = ['array', 'axis', 'brush', 'chord', 'collection', 'color', 'dispatch', 'drag',
                'dsv', 'ease', 'force', 'format', 'geo', 'hierarchy', 'interpolate', 'path', 'polygon', 'quadtree',
                'queue', 'random', 'request', 'scale', 'selection', 'shape', 'time', 'time-format', 'timer', 'transition',
                'voronoi', 'zoom'];


            const npm = {
                "systemjs": "systemjs/dist/*",
                "zone.js": "zone.js/dist/*",
                "reflect-metadata": "reflect-metadata/Reflect*",
                "rxjs": "rxjs/**/*.{js,map}",
                "@angular": "{@angular/*/bundles/*,@angular/material/prebuilt-themes/*}",
                "elasticsearch-browser":"elasticsearch-browser/elasticsearch.{js,min.js}",
                "core-js": "core-js/client/*",
                "hammerjs": "hammerjs/hammer*",
                "d3": "d3/build/*",
                "ngx-charts": "@swimlane/ngx-charts/release/{index.*,*.css}",
                "moment": "moment/{min/*,moment.js}",
                "socket.io-client": "socket.io-client/dist/socket.io.js",
                "tslib": "tslib/tslib*js",
                "plotly.js": "plotly.js/dist/*"
            };
            let tasks = [];

            d3Components.forEach(comp => {
                tasks.push(gulp.src(paths.npm + 'd3-' + comp + '/build/*')
                    .pipe(gulp.dest(paths.lib + 'd3')))
                tasks.push(gulp.src(paths.npm + 'd3-' + comp + '/dist/*')
                    .pipe(gulp.dest(paths.lib + 'd3')))
            });

            for (let destinationDir in npm) {
                if (destinationDir == '@angular')
                    tasks.push(gulp.src(paths.npm + npm[destinationDir])
                        .pipe(gulp.dest(paths.lib)));
                else
                    tasks.push(gulp.src(paths.npm + npm[destinationDir])
                    .pipe(gulp.dest(paths.lib + destinationDir)));
            }
            return merge(tasks);
        })
);

gulp.task("min:js",
    () => gulp.src([paths.js, "!" + paths.minJs])
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify({
            output: {
                ascii_only: true
            }
        }))
        .pipe(gulp.dest(".")));

gulp.task("min:css",
    () => gulp.src([paths.css, "!" + paths.cleanCSS])
        .pipe(concat(paths.concatCssDest))
        .pipe(cleanCSS())
        .pipe(gulp.dest(".")));

gulp.task("min", gulp.parallel("min:js", "min:css"));