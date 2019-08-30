<p align="right">
English description | <a href="../ru/troubleshooting.md">Описание на русском</a>
</p>

# Troubleshooting

There is a list of the most frequently appearing problems.

## Problem list

* [I have started tars command on windows, in console Please wait for a moment, while I'm preparing builder for working and nonthing more is happen](#i-have-started-tars-command-on-windows-in-console-please-wait-for-a-moment-while-im-preparing-builder-for-working-and-nonthing-more-is-happen)
* [I have started tars update and tars is not working now.](#I-have-started-tars-update-and-tars-is-not-working-now)
* [I have a problem with installation, the error: "Error: EPERM: operation not permitted, rename".](#I-have-a-problem-with-installation-the-error-error-eperm-operation-not-permitted-rename)
* [I have a problem with installation, git is not exist.](#I-have-a-problem-with-installation-git-is-not-exist)
* [Build-process starts, but nothing happens after service:clean task](#Build-process-starts-but-nothing-happens-after-serviceclean-task)
* [I have a problem with npm-package pty.js, tars-cli is installed with error of pty.js installing.](#I-have-a-problem-with-npm-package-ptyjs-tars-cli-is-installed-with-error-of-ptyjs-installing)

Don’t hesitate to get in touch by email [tars.builder@gmail.com](tars.builder@gmail.com) or [gitter](https://gitter.im/tars/tars-cli?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge) and ask me all question about TARS-CLI.

## Solutions

### I have started tars command on windows, in console Please wait for a moment, while I'm preparing builder for working and nonthing more is happen

If you have windows 10, just use [wsl](https://docs.microsoft.com/ru-ru/windows/wsl/install-win10). It works like charm)

For windows before 10 — just use any version of terminal except cmd. Standart terminal is really bad.

### I have started tars update and tars is not working now

In most cases, tars update is finished with error. It could happen in case you installed tars-cli with superuser permissions and started update process without it. You should to start installation of tars-cli again:

```bash
npm i -g tars-cli

# or, if it is needed

sudo npm i -g tars-cli
```

[To the problem list.](#Problem-list)

### I have a problem with installation, the error: "Error: EPERM: operation not permitted, rename"

It happens only on Windows. All desktop versions of Windows has the same problem: max path length, the limit is 256 symbols. So, npm can't rename file because of super-long path length. You should install official fix to resolve this problem. You have to have Service Pack 1 in case of Windows 7. You can download that fix from [official support-site](https://support.microsoft.com/en-us/kb/2891362). In case of using Windows 8 or 10, you just can try to install TARS-CLI again.
You can start npm install -g tars-cli from PowerShell, if previous advice did'nt help you.

[To the problem list.](#Problem-list)

### I have a problem with installation, git is not exist

This error can happen when one of dependencies of dependencies of tars-cli uses git in package.json to install in its own dependencies. You should install git in that case. If git is not available in terminal/cmd/console you should install tars-cli in git bash. You can use tars-cli in all type of console after installation.

[To the problem list.](#Problem-list)

### Build-process starts, but nothing happens after service:clean task

If you use TARS-CLI with TARS 1.3.1 and below (you can find used version in tras.json in the root of your project), you have to [update used TARS](https://github.com/tars/tars/blob/master/docs/en/update-guide.md).
If you don't want to update TARS, you can just update code of some tasks: tars/tasks/services/clean.js and tars/tasks/services/remove-init-fs.js:

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

[To the problem list.](#Problem-list)

### I have a problem with npm-package pty.js, tars-cli is installed with error of pty.js installing

If there is a problem with pty.js module, you have to udpate TARS-CLI to the latest version. You have to update TARS-CLI via npm, not via tars update:

```bash
npm update -g tars-cli
```

If you get a **Permission denied** or **Error: EACCES** error, you should run the previous command again in sudo.

In case of using Windows, and if you still has that error:
* remove from C:/Users/%Username%/AppData/Roaming/npm/node_modules/ folder tars-cli;
* run npm cache clean;
* try npm install again.

[To the problem list.](#Problem-list)

Don’t hesitate to get in touch by email [tars.builder@gmail.com](tars.builder@gmail.com) or [gitter](https://gitter.im/tars/tars-cli?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge) and ask me all question about TARS-CLI.
