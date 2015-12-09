<p align="right">
English description | <a href="../ru/commands.md">Описание на русском</a>
</p>

# TARS-CLI commands

There is a description for all TARS-CLI commands.

## Command list

* [tars init](#tars-init) — TARS initialization.
* [tars re-init](#tars-re-init) — TARS re-init. 
* [tars dev](#tars-dev) — run dev task in TARS.
* [tars build](#tars-build) — run build task in TARS.
* [tars start](#tars-start-taskname) — run custom task from gulpfile from current directory.
* [tars add-module](#tars-add-module-modulename) — add module to markup/modules.
* [tars add-page](#tars-add-page-pagename) — add page to markup/pages.
* [tars update](#tars-update) — update TARS-CLI.

## tars init

This command allows you to initialize TARS in the current directory. Starts `gulp init` command in TARS.

This will fetch the files directly from Github (original TARS repository) and extract them.

Interactive mode is available by default. If your command line isn't pointing at an empty folder, it will ask you what to do—twice!—to prevent you from deleting any files by accident. When the downloading and extraction have completed, you will be asked a few questions to configure your project. You can select a template, a css-preprocessor, system notifications showing, pixel density screens you would like to support and etc.

If you don't need to use the interactive mode, this command must be run with flag `--silent`.

### Available flags

* `--silent`: starts init without interactive mode.
* `-s`, `--source`: init downloads from the repository TARS the latest markup builder version and unpacks in the current directory by default. With the `-s` flag you can determine where to download the zip-archive with TARS, if you have your own TARS builder-version (fork). **Attention, this flag with url have to be the last!**
    
### An example of using the command

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

## tars re-init

This command allows to re-initialize TARS with new settings (template, css-preprocessor). It is not necessary to change this settings by your hands, because you can change them in interactive mode. This command runs `gulp re-init` task in TARS. **Attention, files from pages and static folder will be deleted.**

Interactive mode is available by default like in `init` command.

### Available flags

* `--silent`: starts re-init without interactive mode.

### An example of using the command

````bash
# Starts re-init in interactive mode
tars re-init

# Starts re-init without interactive mode
tars re-init --silent
````

[Back to the command list.](#command-list)

## tars dev

This command starts dev-command (make a regular build) with watchers. Runs `gulp dev` task in TARS.

Interactive mode is available if you run command without flags. You can select dev-command additional options, available through the flags. If you want to run the command without flags and without interactive mode, use the flag `--silent`.

### Available flags

* `-l`, `--livereload`, `--lr`: starts livereload in browser.
* `-t`, `--tunnel`: initialization of project with sharing markup in outside Web.
* `--ie8`: includes styles for ie8 in the build.
* `--ie9`: includes styles for ie9 in the build.
* `--ie`: includes styles for ie8 and ie9 in the build.
* `--silent`: starts builder without interactive mode.
* `--custom-flags`: allows you to use custom flags with dev-team command. An example of use is described below. In interactive mode the flags are listed by the space without quotes and commas. **Attention, this flag with url have to be the last!**

### An example of using the command

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

## tars build

This command starts the final build of the project, without running watchers. Runs the `gulp build` task in TARS.

Available interactive mode when you run the command without flags. You can select additional options of markup builder, available through the flags. If you want to run the command without flags and without interactive mode, use the flag `--silent`.

### Available flags

* `-m`, `--min`: minimizes static files.
* `-r`, `--release`: minimizes static files and adds hash to file-names. This mode is useful if you need build, that is ready for deploy.
* `--ie8`: includes styles for ie8 in the build.
* `--ie9`: includes styles for ie9 in the build.
* `--ie`: includes styles for ie8 and ie9 in the build.
* `--silent`: starts builder without interactive mode.
* `--custom-flags`: allows you to use custom flags with dev-command. An example of use is described below. Flags have to be separated by the space without quotes and commas in interactive mode. **Attention, this flag with url have to be the last!**

### An example of using the command

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

## tars start %taskName%

You can start any task via TARS-CLI from your local gulpfile (or from gulpfile from current directory). It is very important, that TARS have to be inited. This command will be usefull to add more commands to TARS-CLI. Interactive mode is not available.

### Available flags

* `--flags`: allows you to use flags with %taskName%. An example of use is described below. Flags have to be separated by the space without quotes and commas in interactive mode. **Attention, this flag with url have to be the last!**

### An example of using the command

````bash
# Starts dev task from gulpfile
tars start dev

# Starts dev task from gulpfile with --lr flag
tars start dev --flags '--lr'

# Starts dev task from gulpfile with --lr and --ie flags
tars start dev --flags '--lr --ie'
````

[Back to the command list.](#command-list)

## tars add-module %moduleName%

The command adds a module to the project. It takes the name of the module as a parameter. An error will be thrown in case the module already exists. You have to use flags to create a module with ready files.

Available interactive mode when you run the command without flags. You can select the files and folders to be created with the module.

### Available flags

* `-f`, `--full`: adds module with all folders and files that can be in the module: folder for the assets, ie, data + selected templater file, js and selected css-preprocessor.
* `-b`, `--basic`: adds only basic files.
* `-d`, `--data`: adds a folder for data. It also creates a data-file with the following contents:
````javascript
moduleName: {}
````
* `-i`, `--ie`: adds a folder for the styles for IE.
* `-a`, `--assets`: adds a folder for assets.
* `-t`, `--template`: creates new module, which is based on module _template. So, if you need your own template for all new modules, you can use this flag. **Attention, it is very important, that _template has to be existed in markup/modules!** After using flag `-t` new module this name %moduleName% will be created and it will be a full copy of _template module. So, you have to rename all files and folders in new module by yourself in that case, cause TARS doesn't know anything about structure of _template module.
* `-e`, `--empty`: adds just module folder without files.

The keys have the following priority:
* `-t`
* `-e`
* `-f`
* `other`

In other words, if you use the `-d -b` и `-e`,  empty folder will be created for the module, because `-e` has higher priority. If you select "Full version of the module" mode and "Empty Folder" mode will be created only an empty folder.

### An example of using the command

````bash
# Will be start an adding module interactive mode named "sidebar"
tars add-module sidebar

# Adds Module "sidebar" with basic file and assets folder 
tars add-module sidebar -b -a

# Adds Module "sidebar" with the basic files, folders, assets and folders for data
tars add-module sidebar -b -a -d

# Adds Module "sidebar" with all files and folders
tars add-module sidebar --full

# Adds Module "sidebar" which is based on _template
tars add-module sidebar --template

# Adds in modules empty folder named "sidebar"
tars add-module sidebar -e -b -a -d -i
````
    
[Back to the command list.](#command-list)

## tars add-page %pageName%

This command adds a new page in the markup/pages. It takes the name of the page as a parameter . An error will be thrown in case the page already exists. It is possible to add an empty page  and copy of the template page (the default is _template. {html, jade, hbs}). You can create your _template. {html, jade, hbs}, to TARS-CLI copy this page.

Interactive mode is not available.

### Available flags

* `-e`, `--empty`: adds a empty page.

### An example of using the command

````bash
# Will be created an inner page.{Html, jade} based _template.{Html, jade}
tars add-page inner

# Will be created an inner.html page based on _template.html
tars add-page inner.html

# Will be created an empty inner.html page 
tars add-page inner -e
````

[Back to the command list.](#command-list)

##  tars update

Update the current version of TARS-CLI to the latest available. Starts npm update -g tars-cli command.

Interactive mode is not available.

### An example of using the command

````bash
tars update
````
