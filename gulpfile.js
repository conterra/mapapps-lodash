const gulp = require("gulp");
const mapapps = require('ct-mapapps-gulp-js');
const mapappsBrowserSync = require("ct-mapapps-browser-sync");


// used to transport test urls in "run-browser-tests-local" task
const runBrowserTests = [];

const { options } = mapapps.registerTasks({
    /** enable es6 by default */
    forceTranspile: true,
    lintOnWatch: false,
    rollupEnableWatch: true,
    runBrowserTests
});

mapappsBrowserSync.registerTask({
    port: 8080
}, gulp);

gulp.task("build",
    gulp.series(
        "copy-resources",
        "rollup-build"
    )
);

gulp.task("preview",
    gulp.series(
        gulp.parallel(
            "copy-resources",
            "rollup-watch-start"
        ),
        gulp.parallel(
            "browser-sync",
            "watch" // handles everything except transpilation
        ),
        "rollup-watch-stop"
    )
);

gulp.task("run-tests",
    gulp.series(
        "browser-sync-start",
        function transportTestUrls() {
            // transport test url to run-browser-tests
            const testsAt = mapappsBrowserSync.state.url + "/js/tests/runTests.html";
            runBrowserTests.push(testsAt);
            return Promise.resolve();
        },
        "run-browser-tests",
        "browser-sync-stop"
    ));

gulp.task("test",
    gulp.series(
        "build",
        "run-tests"
    ));

gulp.task("default",
    gulp.series(
        function disableBuildOfTests() {
            // disable build of tests in nightly
            options.rollupBuildTests = false;
            return Promise.resolve();
        },
        "clean",
        "build",
    ));

gulp.task("compress", gulp.series("default"))
