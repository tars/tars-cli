<p align="right">
English description | <a href="README_RU.md">Описание на русском</a>
</p>

# TARS-CLI

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-link] [![Dependency Status][deps-image]][deps-link] [![Gitter][gitter-image]][gitter-link]

TARS-CLI — TARS-CLI - Command Line Interface for the TARS markup builder [TARS](https://github.com/tars/tars/blob/master/README.md).

The main problem in developing markup with TARS is all npm-dependences installing for each project every time. As the result, each project takes more than 200MB. To simplify initialization of the project and the work with TARS TARS-CLI was established. All TARS basic documentation is in the original TARS repository [TARS](https://github.com/tars/tars/blob/master/README.md).

TARS-CLI is just an interface of the main builder, which allows you to:

* Initialize the project.
* Start dev-command with browser reloading and opening tunnel to the Internet.
* Start the build-command with the minified files or in release mode.
* Add module with different set of files.
* Add empty page or copy an existing page.

If you have any problems with TARS-CLI, please read the troubleshooting section [troubleshooting](#troubleshooting).

## How to install

You have to install TARS-CLI globally:

`npm i -g tars-cli`

May be it needs the superuser rights. But desirably to configure the system  so that it wasn’t required.

## TARS-CLI commands

All command are run by template: 

`tars` + `command-name` + `flags`

At any moment you can run the `tars --help` or `tars -h` or just `tars` without additional command and flags. his command displays information about all available commands. Also you can add the `--help` key or `-h` key to any command to get the most full description of this command.

`tars -v` or `tars --version` will display the currently installed version of TARS-CLI. Also, you will be informed about updating, if it is available.

Almost all command has the interactive mode. In this mode you can to communicate with CLI via the GUI similarity. If you are using interactive mode you don’t need to know what the flags are responsible for, because you are communicate with CLI with natural language. Interactive mode is easy to disable if you need to carry out automatic testing or something else that doesn’t require the human presence.

### Command list

* [tars init](#tars-init)
* [tars re-init](#tars-re-init)
* [tars dev](#tars-dev)
* [tars build](#tars-build)
* [tars add-module](#tars-add-module-modulename)
* [tars add-page](#tars-add-page-pagename)
* [tars update](#tars-update)

### tars init

This command allows you to initialize TARS in the current directory. Starts `gulp init`command it TARS.

Interactive mode is availabilitied as default. You can select a template, a preprocessor, to show system notifications, with what pixel density to support screens and etc. it the interactive mode is not needed to you, this command must be run with `--silent` flag.

#### Available flags

* `--silent`: starts init without interactive mode.
* `-s`, `--source`: by default init downloads from the repository TARS the latest markup builder version and unpacks in the current directory. With the `-s`you can determine where to download the zip-archive with TARS, if you have your own TARS builder. **Attention, the option must be the latest!**
    
#### An example of using the command

````bash
# Starts init in interactive mode 
tars init

# Starts init without interactive mode
tars init --silent

# Download TARS from http://url.to.tars.zip and init project in interactive mode
tars init -s http://url.to.tars.zip

# Download TARS from http://url.to.tars.zip and init project without interactive mode
tars init --silent --source http://url.to.tars.zip
````

[Back to the list command list.](#command-list)

### tars re-init

This command allows us to re-initialize TARS with new settings (template, preprocessor). Not necessarily to change this settings by your hands, because you can change them in interactive mode. Runs `gulp re-init`command in TARS.

Interactive mode is availability like in `init`command.

#### Available flags

* `--silent`: starts re-init without interactive mode.

#### An example of using the command

````bash
# Starts re-init in interactive mode
tars re-init

# Starts re-init without interactive mode
tars re-init --silent
````

[Back to the list command list.](#command-list)

### tars dev

This command starts dev-builder with watchers. Runs `gulp dev` command in TARS.

Interactive mode is availabilitied if you run command without flags. You can select dev-builder additional options, available through the flags. If you want to run the command without flags and without interactive mode, use the `--silent` flag.

#### Available flags

* `-l`, `--livereload`, `--lr`: starts livereload in browser.
* `-t`, `--tunnel`: initialization project with sharing markup in outside Web.
* `--ie8`: includes styles for ie8 in the build.
* `--silent`: starts builder without interactive mode.
* `--custom-flags`: allows you to use custom flags with dev-team command. An example of use is described below. In interactive mode the flags are listed by the space without quotes and commas. **Attention, the option must be the latest!**

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

# Will be start the server for livereload and creates a tunnel to the outside web ie8 + + two custom flag support 
tars dev --tunnel --ie8 --custom-flags '--custom-flag1 --custom-flag2'
````

[Back to the list command list.](#command-list)

### tars build

This command starts the final build of the project, without running of watchers. Runs the `gulp build` command in TARS.

Available interactive mode when you run the command without flags. You can select additional options of markup builder, available through the flags. If you want to run the command without flags and without interactive mode, use the `--silent` flag.

#### Available flags

* `-m`, `--min`: minimized files are connected to html.
* `-r`, `--release`: minimized files are connected to html whose names have hash. This mode is useful if you are trying to post markup directly to the server. 
* `--ie8`: includes styles for ie8 in the build.
* `--silent`: starts builder without interactive mode.
* `--custom-flags`: allows you to use custom flags with dev-team command. An example of use is described below. In interactive mode the flags are listed by the space without quotes and commas.  **Attention, the option must be the latest!**

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

# Will be created a release-version of the build + ie8 support + two custom flag
tars build --release --ie8 --custom-flags '--custom-flag1 --custom-flag2'
````

[Back to the list command list.](#command-list)

### tars add-module %moduleName%

The command adds a module to the project. As a parameter takes the name of the module. If the module already exists, will be given a appropriate error. To create a module with ready files - you need to use flags.

Available interactive mode when you run the command without flags. You can select the files and folders to be created with the module.

#### Available flags

* `-f`, `--full`: adds modules with all folders and files that can be in the module: folder for the assets, ie, data + selected template file, js and selected preprocessor.
* `-b`, `--basic`: adds only basic files.
* `-d`, `--data`: adds a folder for data. It also creates a data file with the following contents:
````javascript
moduleName: {}
````
* `-i`, `--ie`: adds a folder for the styles for IE.
* `-a`, `--assets`: adds a folder for assets.
* `-e`, `--empty`: adds just the module folder without files.

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
    
[Back to the list command list.](#command-list)

### tars add-page %pageName%

This command adds a new page in the markup/pages. As a parameter takes the name of the page. If the page already exists, will be given a appropriate error. It is possible to add an empty page  and copy of the template page (the default is _template. {html, jade, hbs}). You can create your _template. {Html, jade, hbs}, to TARS-CLI copy this page.

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

[Back to the list command list.](#command-list)

###  tars update

Update the current version of TARS-CLI to the latest available. Starts npm update -g tars-cli command.

Interactive mode is not available.

#### An example of using the command

````bash
tars update
````

## Troubleshooting

To work with TARS-CLI currently require git. It should be installed in the system and  registered in the PATH. If during the installation you get an error message that says that you do not have git, then I ask you to install it.

If you have Windows and git is not registered in the PATH (git --version command gives an error in cmd), the TARS-CLI must be set and updated in git bash. You can’t work with TARS-CLI in git bash. You must use the standard cmd or any other terminal.

If there is a problem with the module pty.js, please upgrade to at least 1.1.3.

If there are still any mistakes, feel free to write to [tars.builder@gmail.com](tars.builder@gmail.com) or [gitter](https://gitter.im/tars/tars-cli?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)

[downloads-image]: http://img.shields.io/npm/dm/tars-cli.svg
[npm-url]: https://npmjs.org/package/tars-cli
[npm-image]: http://img.shields.io/npm/v/tars-cli.svg

[travis-image]: https://travis-ci.org/tars/tars-cli.svg?branch=master
[travis-link]: https://travis-ci.org/tars/tars-cli

[deps-image]: https://david-dm.org/tars/tars-cli.svg
[deps-link]: https://david-dm.org/tars/tars-cli

[gitter-image]: https://badges.gitter.im/Join%20Chat.svg
[gitter-link]: https://gitter.im/tars/tars-cli?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge
