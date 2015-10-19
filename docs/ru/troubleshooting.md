# Troubleshooting

Если возникла проблема с модулем pty.js, то прошу обновится до версии 1.1.3 минимум. Обновлятся следует через npm:
```bash
npm update -g tars-cli
```

Возможно потребуется запуск консоли от администратора.

Если какие-либо ошибки все еще повторяются, удалите из папки C:/Users/%Username%/AppData/Roaming/npm/node_modules/ tars-cli и повторите установку.

Если вы используете TARS-CLI с TARS версии 1.3.1 и ниже, то необходимо обновить таски tars/tasks/services/clean.js и tars/tasks/services/remove-init-fs.js:

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

Если возникают еще какие-либо ошибки, смело пишите на [tars.builder@gmail.com](tars.builder@gmail.com) или в [gitter](https://gitter.im/tars/tars-cli?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)
