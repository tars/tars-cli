<p align="right">
English description | <a href="README_RU.md">Описание на русском</a>
</p>

# TARS-CLI

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Mac/Linux Build Status](https://img.shields.io/travis/tars/tars-cli/master.svg?label=Mac%20OSX%20%26%20Linux)](https://travis-ci.org/tars/tars) [![Windows Build status](https://img.shields.io/appveyor/ci/artem-malko/tars-cli/master.svg?label=Windows)](https://ci.appveyor.com/project/artem-malko/tars-cli/branch/master) [![Dependency Status][deps-image]][deps-link] [![Gitter][gitter-image]][gitter-link]

TARS-CLI — Command Line Interface for the TARS markup builder [TARS](https://github.com/tars/tars/blob/master/README.md).

The main problem in developing markup with TARS is all npm-dependences installing for each project every time. As the result, each project takes more than 200MB. To simplify initialization of the project and the work with TARS TARS-CLI was established. All TARS basic documentation is in the original TARS repository [TARS](https://github.com/tars/tars/blob/master/README.md).

TARS-CLI is just an interface of the main builder, which allows you to:

* Initialize the project.
* Start dev-command with browser reloading and opening tunnel to the Internet.
* Start the build-command with the minified files or in release mode.
* Add module with different set of files.
* Add empty page or copy an existing page.

**If you have any problems with TARS-CLI, please read [the troubleshooting section](#troubleshooting).**

## How to install

You have to install TARS-CLI globally:

`npm i -g tars-cli`

If you get a **Permission denied** or **Error: EACCES** error, you should run the previous command again in sudo.

## TARS-CLI commands

All commands have similar template of executing: 

`tars` + `command-name` + `flags`

You can run the `tars --help` or `tars -h` or just `tars` without additional command and flags at any moment. This command displays information about all available commands and flags. Also you can add the `--help` key or `-h` key to any command to get full description of this command.

`tars -v` or `tars --version` will display version of TARS-CLI installed on your computer. Also, you will be informed about updating, if it is available.

Almost all command has the interactive mode. In this mode you can to communicate with CLI like it has its own GUI. If you are using interactive mode you don’t need to know what the flags are responsible for, because you are communicate with CLI with natural language. Interactive mode is easy to disable if you use automatic testing or something else that doesn’t require the human presence.

### Command list

* [tars init](#tars-init)
* [tars re-init](#tars-re-init)
* [tars dev](#tars-dev)
* [tars build](#tars-build)
* [tars add-module](#tars-add-module-modulename)
* [tars add-page](#tars-add-page-pagename)
* [tars update](#tars-update)

### tars init

This command allows you to initialize TARS in the current directory. Starts `gulp init` command in TARS.

This will fetch the files directly from Github (original TARS repository) and extract them.

Interactive mode is available by default. If your command line isn't pointing at an empty folder, it will ask you what to do—twice!—to prevent you from deleting any files by accident. When the downloading and extraction have completed, you will be asked a few questions to configure your project. You can select a template, a css-preprocessor, system notifications showing, pixel density screens you would like to support and etc.

If you don't need to use the interactive mode, this command must be run with flag `--silent`.

#### Available flags

* `--silent`: starts init without interactive mode.
* `-s`, `--source`: init downloads from the repository TARS the latest markup builder version and unpacks in the current directory by default. With the `-s` flag you can determine where to download the zip-archive with TARS, if you have your own TARS builder-version (fork). **Attention, this flag with url have to be the last!**
    
#### An example of using the command

````bash
# Starts init in interactive mode 
tars init

# Starts init without interactive mode
tars init --silent

# Downloads TARS from http://url.to.tars.zip and inits project in interactive mode
tars init -s http://url.to.tars.zip

# Downloads TARS from http://url.to.tars.zip and inits project without interactive mode
tars init --silent --source http://url.to.tars.zip
````

[Back to the command list.](#command-list)

### tars re-init

This command allows to re-initialize TARS with new settings (template, css-preprocessor). It is not necessary to change this settings by your hands, because you can change them in interactive mode. This command runs `gulp re-init` task in TARS.

Interactive mode is available by default like in `init` command.

#### Available flags

* `--silent`: starts re-init without interactive mode.

#### An example of using the command

````bash
# Starts re-init in interactive mode
tars re-init

# Starts re-init without interactive mode
tars re-init --silent
````

[Back to the command list.](#command-list)

### tars dev

This command starts dev-command (make a regular build) with watchers. Runs `gulp dev` task in TARS.

Interactive mode is available if you run command without flags. You can select dev-command additional options, available through the flags. If you want to run the command without flags and without interactive mode, use the flag `--silent`.

#### Available flags

* `-l`, `--livereload`, `--lr`: starts livereload in browser.
* `-t`, `--tunnel`: initialization of project with sharing markup in outside Web.
* `--ie8`: includes styles for ie8 in the build.
* `--ie9`: includes styles for ie9 in the build.
* `--ie`: includes styles for ie8 and ie9 in the build.
* `--silent`: starts builder without interactive mode.
* `--custom-flags`: allows you to use custom flags with dev-team command. An example of use is described below. In interactive mode the flags are listed by the space without quotes and commas. **Attention, this flag with url have to be the last!**

#### An example of using the command

````bash
# Will be start an interactive mode
tars dev

# The command will be run without flags and interactive mode
tars dev --silent

# Will be start the server for livereload
tars dev -l

# Will be start the server for livereload and create a tunnel to the outside Web + ie8 support
tars dev --tunnel --ie8

# Will be start the server for livereload and creates a tunnel to the outside web ie8 and ie9 + two custom flag support 
tars dev --tunnel --ie --custom-flags '--custom-flag1 --custom-flag2'
````

[Back to the command list.](#command-list)

### tars build

This command starts the final build of the project, without running watchers. Runs the `gulp build` task in TARS.

Available interactive mode when you run the command without flags. You can select additional options of markup builder, available through the flags. If you want to run the command without flags and without interactive mode, use the flag `--silent`.

#### Available flags

* `-m`, `--min`: minimizes static files.
* `-r`, `--release`: minimizes static files and adds hash to file-names. This mode is useful if you need build, that is ready for deploy.
* `--ie8`: includes styles for ie8 in the build.
* `--ie9`: includes styles for ie9 in the build.
* `--ie`: includes styles for ie8 and ie9 in the build.
* `--silent`: starts builder without interactive mode.
* `--custom-flags`: allows you to use custom flags with dev-command. An example of use is described below. Flags have to be separated by the space without quotes and commas in interactive mode.  **Attention, this flag with url have to be the last!**

#### An example of using the command

````bash
# Will be start an interactive mode
tars build

# The command will be run without flags and interactive mode
tars build --silent

# Will be created a version of the build with minified files
tars build -m

# Will be created a release-version of the build + ie8 support 
tars build --release --ie8

# Will be created a release-version of the build + ie8 and ie9 support + two custom flag
tars build --release --ie --custom-flags '--custom-flag1 --custom-flag2'
````

[Back to the command list.](#command-list)

### tars add-module %moduleName%

The command adds a module to the project. It takes the name of the module as a parameter. An error will be thrown in case the module already exists. You have to use flags to create a module with ready files.

Available interactive mode when you run the command without flags. You can select the files and folders to be created with the module.

#### Available flags

* `-f`, `--full`: adds module with all folders and files that can be in the module: folder for the assets, ie, data + selected templater file, js and selected css-preprocessor.
* `-b`, `--basic`: adds only basic files.
* `-d`, `--data`: adds a folder for data. It also creates a data-file with the following contents:
````javascript
moduleName: {}
````
* `-i`, `--ie`: adds a folder for the styles for IE.
* `-a`, `--assets`: adds a folder for assets.
* `-e`, `--empty`: adds just module folder without files.

The keys have the following priority:
* `-e`
* `-f`
* `other`

In other words, if you use the `-d -b` и `-e`,  empty folder will be created for the module, because `-e` has higher priority. If you select "Full version of the module" mode and "Empty Folder" mode will be created only an empty folder.

#### An example of using the command

````bash
# Will be start an adding module interactive mode named "sidebar"
tars add-module sidebar

# Adds Module "sidebar" with basic file and assets folder 
tars add-module sidebar -b -a

# Adds Module "sidebar" with the basic files, folders, assets and folders for data
tars add-module sidebar -b -a -d

# Adds Module "sidebar" with all files and folders
tars add-module sidebar --full

# Adds in modules empty folder named "sidebar"
tars add-module sidebar -e -b -a -d -i
````
    
[Back to the command list.](#command-list)

### tars add-page %pageName%

This command adds a new page in the markup/pages. It takes the name of the page as a parameter . An error will be thrown in case the page already exists. It is possible to add an empty page  and copy of the template page (the default is _template. {html, jade, hbs}). You can create your _template. {html, jade, hbs}, to TARS-CLI copy this page.

Interactive mode is not available.

#### Available flags

* `-e`, `--empty`: adds a empty page.

#### An example of using the command

````bash
# Will be created an inner page.{Html, jade} based _template.{Html, jade}
tars add-page inner

# Will be created an inner.html page based on _template.html
tars add-page inner.html

# Will be created an empty inner.html page 
tars add-page inner -e
````

[Back to the command list.](#command-list)

###  tars update

Update the current version of TARS-CLI to the latest available. Starts npm update -g tars-cli command.

Interactive mode is not available.

#### An example of using the command

````bash
tars update
````

## Troubleshooting

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

[downloads-image]: http://img.shields.io/npm/dm/tars-cli.svg
[npm-url]: https://npmjs.org/package/tars-cli
[npm-image]: http://img.shields.io/npm/v/tars-cli.svg

[travis-image]: https://travis-ci.org/tars/tars-cli.svg?branch=master
[travis-link]: https://travis-ci.org/tars/tars-cli

[deps-image]: https://david-dm.org/tars/tars-cli.svg
[deps-link]: https://david-dm.org/tars/tars-cli

[gitter-image]: https://badges.gitter.im/Join%20Chat.svg
[gitter-link]: https://gitter.im/tars/tars-cli?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge
