# Troubleshooting

Здесь собраны наиболее часто повторяющиеся проблемы. 

## Список проблем

* [Запустил tars update, и теперь ничего не работает.](#Запустил-tars-update-и-теперь-ничего-не-работает)
* [У меня проблема с npm-модулем pty.js, tars-cli не устанавливается с ошибкой установки pty.js](#У-меня-проблема-с-npm-модулем-ptyjs-tars-cli-не-устанавливается-с-ошибкой-установки-ptyjs)
* [Сборка запускается, но все зависает на таске service:clean.](#Сборка-запускается-но-все-зависает-на-таске-serviceclean)
* [Проблема при установке, ошибка "Error: EPERM: operation not permitted, rename".](#Проблема-при-установке-ошибка-error-eperm-operation-not-permitted-rename)
* [Проблема при установке, отсутствует git.](#Проблема-при-установке-отсутствует-git)

## Решения

### Запустил tars update, и теперь ничего не работает

Скорее всего tars update закончился ошибкой. Возможно вы запустили обновление tars-cli не от админа, если установка была произведена с админискими правами. В данном случае необходимо выполнить установку tars-cli заново со соответствующими правами:

```bash
# в случае Windows может потребоваться запуск консоли от Администратора
npm i -g tars-cli

# или, в случае установки от админа на OSX, Linux.

sudo npm i -g tars-cli
```

[К списку вопросов.](#Список-проблем)

### У меня проблема с npm-модулем pty.js, tars-cli не устанавливается с ошибкой установки pty.js

Если возникла проблема с модулем pty.js, то необходимо обновится до версии 1.1.3 минимум. Обновлятся следует через npm:

```bash
npm update -g tars-cli
```

Возможно потребуется запуск консоли (или от команды обновления) от администратора (superuser'а).

В случае использования Windows и какие-либо ошибки все еще повторяются, удалите из папки C:/Users/%Username%/AppData/Roaming/npm/node_modules/ tars-cli и повторите установку.

[К списку вопросов.](#Список-проблем)

### Сборка запускается, но все зависает на таске service:clean

Если вы используете TARS-CLI с TARS версии 1.3.1 и ниже, то необходимо обновить таски tars/tasks/services/clean.js и tars/tasks/services/remove-init-fs.js или [обновить используемый TARS](https://github.com/tars/tars/blob/master/docs/ru/update-guide.md). Узнать используемую версию TARS можно в tars.json в корне проекта.
Если вы не хотите обновлять TARS, то можн ообнвоиьт только код тасков:

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

[К списку вопросов.](#Список-проблем)

### Проблема при установке, ошибка "Error: EPERM: operation not permitted, rename"

Ошибка возникает только на Windows. Проблема связанна с тем, что Windows, вплоть до версии 8.1 не поддерживает длинные пути (длиннее 256 символов). Чтобы исправить проблему, необходимо установить официальный фикс. Обратите внимание, что фикс требуется уставноленного Service Pack 1 в случае Windows 7. Также фикс может вызвать ошибки в работе системе, так как не был протестирован. Скачать фикс можно на официальном сайте поддержки продуктов [microsoft](https://support.microsoft.com/en-us/kb/2891362).

[К списку вопросов.](#Список-проблем)

### Проблема при установке, отсутствует git

Ошибка возникает в некоторых случаях, когда одна из зависимостей внутри себя начинает использовать протокол git для своих зависимостей. В данной ситуации необходимо установить git в систему. В случае Windows необходимо [добавить git в PATH](http://blog.countableset.ch/2012/06/07/adding-git-to-windows-7-path/), если это не произошло автоматически. Это необходимо, чтобы git был досупен из cmd.exe Если это не возможно сделать, то запускайте установку из git bash.

[К списку вопросов.](#Список-проблем)

Если возникают еще какие-либо ошибки, смело пишите на [tars.builder@gmail.com](tars.builder@gmail.com) или в [gitter](https://gitter.im/tars/tars-cli?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)
