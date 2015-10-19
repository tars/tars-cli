# Troubleshooting

If there is a problem with the module pty.js, please upgrade to at least 1.1.3 by using command:
```bash
npm update -g tars-cli
```

If you use TARS-CLI with TARS 1.3.1 version and below, please, update tasks tars/tasks/services/clean.js and tars/tasks/services/remove-init-fs.js:

```javascript
// clean.js

'use strict';

var gulp = tars.packages.gulp;
var del = tars.packages.del;
tars.packages.promisePolyfill.polyfill();

var pathsToDel = [
        './dev/',
        './.tmpTemplater/',
        './.tmpPreproc/'
    ];

if (!tars.config.useBuildVersioning) {
    pathsToDel.push(tars.options.build.path);
}

/**
 * Clean dev directory and cache
 */
module.exports = function () {
    return gulp.task('service:clean', function (cb) {
        del(pathsToDel).then(function () { cb(); });
    });
};

// remove-init-fs.js
'use strict';

var gulp = tars.packages.gulp;
var del = tars.packages.del;
var staticFolderName = tars.config.fs.staticFolderName;
tars.packages.promisePolyfill.polyfill();

var pathsToDel = [
             'markup/' + staticFolderName + '/js/framework',
             'markup/' + staticFolderName + '/js/libraries',
             'markup/' + staticFolderName + '/js/plugins',
             'markup/' + staticFolderName + '/' + tars.config.fs.imagesFolderName + '/',
             'markup/' + staticFolderName + '/fonts/',
             'markup/' + staticFolderName + '/scss/',
             'markup/' + staticFolderName + '/stylus/',
             'markup/' + staticFolderName + '/less/',
             'markup/modules/_template/assets/',
             'markup/modules/_template/ie/',
             './markup/modules/head/',
             './markup/modules/footer/',
             './markup/modules/_template/_template.scss',
             './markup/modules/_template/_template.less',
             './markup/modules/_template/_template.styl',
             './markup/modules/_template/_template.html',
             './markup/modules/_template/_template.jade',
             './markup/pages/',
             './.tmpTemplater/',
             './.tmpPreproc/'
            ];

/**
 * Remove inited file structure.
 */
module.exports = function () {
    return gulp.task('service:remove-init-fs', function (cb) {
        del(pathsToDel).then(function () { cb(); });
    });
};

```

Feel free to write to [tars.builder@gmail.com](tars.builder@gmail.com) or [gitter](https://gitter.im/tars/tars-cli?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge) and ask me all question about TARS-CLI.
