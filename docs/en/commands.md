<p align="right">
English description | <a href="../ru/commands.md">Описание на русском</a>
</p>

# TARS-CLI commands

There is a description for all TARS-CLI commands.

## Command list

-   [tars init](#tars-init) — TARS initialization.
-   [tars dev](#tars-dev) — run dev task in TARS.
-   [tars build](#tars-build) — run build task in TARS.
-   [tars start](#tars-start-taskname) — run custom task from gulpfile from current directory.
-   [tars add-component](#tars-add-component-componentname) — добавляет компонент (модуль) в markup/components.
-   [tars add-page](#tars-add-page-pagename) — add page to markup/pages.
-   [tars update](#tars-update) — update TARS-CLI.
-   [tars update-project](#tars-update-project) — update TARS in current project.

## tars init

This command allows you to initialize TARS in the current directory. Starts `gulp init` command in TARS.

This will fetch the files directly from Github (original TARS repository) and extract them.

Interactive mode is available by default. If your command line isn't pointing at an empty folder, it will ask you what to do—twice!—to prevent you from deleting any files by accident. When the downloading and extraction have completed, you will be asked a few questions to configure your project. You can select a template, a css-preprocessor, system notifications showing, pixel density screens you would like to support and etc.

If you don't need to use the interactive mode, this command must be run with flag `--silent`.

### Available flags

-   `--silent`: starts init without interactive mode.
-   `-s`, `--source`: init downloads from the repository TARS the latest markup builder version and unpacks in the current directory by default. With the `-s` flag you can determine where to download the zip-archive with TARS, if you have your own TARS builder-version (fork).
-   `--exclude-html`: templater files will be updated by default, but you can prevent with behaviour, by using that flag.
-   `--exclude-css`: css-preprocessor files will be updated by default, but you can prevent with behaviour, by using that flag.

`--exclude-html` and `--exclude-css` can be useful in case of initing from custom source.

**Attention, -s (--source) flag always has to be passed as the last flag!**

### An example of using the command

```bash
# Starts init in interactive mode
tars init

# Starts init without interactive mode
tars init --silent

# Downloads TARS from http://url.to.tars.zip and inits project in interactive mode
tars init -s http://url.to.tars.zip

# Downloads TARS from http://url.to.tars.zip and inits project without interactive mode
tars init --silent --source http://url.to.tars.zip

# Downloads TARS from http://url.to.tars.zip and inits project in interactive mode without templater-files updating
tars init --exclude-html -s http://url.to.tars.zip
```

[Back to the command list.](#command-list)

## tars dev

This command starts dev-command (make a regular build) with watchers. Runs `gulp dev` task in TARS.

Interactive mode is available if you run command without flags. You can select dev-command additional options, available through the flags. If you want to run the command without flags and without interactive mode, use the flag `--silent`.

### Available flags

-   `-l`, `--livereload`, `--lr`: starts livereload in browser.
-   `-t`, `--tunnel`: initialization of project with sharing markup in outside Web.
-   `--ie8`: includes styles for ie8 in the build.
-   `--ie9`: includes styles for ie9 in the build.
-   `--ie`: includes styles for ie8 and ie9 in the build.
-   `--silent`: starts builder without interactive mode.
-   `--custom-flags`: allows you to use custom flags with dev-team command. An example of use is described below. In interactive mode the flags are listed by the space without quotes and commas.

### An example of using the command

```bash
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
```

[Back to the command list.](#command-list)

## tars build

This command starts the final build of the project, without running watchers. Runs the `gulp build` task in TARS.

Available interactive mode when you run the command without flags. You can select additional options of markup builder, available through the flags. If you want to run the command without flags and without interactive mode, use the flag `--silent`.

### Available flags

-   `-m`, `--min`: minimizes static files.
-   `-r`, `--release`: minimizes static files and adds hash to file-names. This mode is useful if you need build, that is ready for deploy.
-   `--ie8`: includes styles for ie8 in the build.
-   `--ie9`: includes styles for ie9 in the build.
-   `--ie`: includes styles for ie8 and ie9 in the build.
-   `--silent`: starts builder without interactive mode.
-   `--custom-flags`: allows you to use custom flags with dev-command. An example of use is described below. Flags have to be separated by the space without quotes and commas in interactive mode.

### An example of using the command

```bash
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
```

[Back to the command list.](#command-list)

## tars start %taskName%

You can start any task via TARS-CLI from your local gulpfile (or from gulpfile from current directory). It is very important, that TARS have to be inited. This command will be usefull to add more commands to TARS-CLI. Interactive mode is not available.

### Available flags

-   `--flags`: allows you to use flags with %taskName%. An example of use is described below. Flags have to be separated by the space without quotes and commas in interactive mode.

### An example of using the command

```bash
# Starts dev task from gulpfile
tars start dev

# Starts dev task from gulpfile with --lr flag
tars start dev --flags '--lr'

# Starts dev task from gulpfile with --lr and --ie flags
tars start dev --flags '--lr --ie'
```

[Back to the command list.](#command-list)

## tars add-component %componentName%

The command adds a component to the project. It takes the name of the component as a parameter. An error will be thrown in case the component already exists. You have to use flags to create a component with ready files.

Available interactive mode when you run the command without flags. You can select the files and folders to be created with the component.

### Available flags

-   `-f`, `--full`: adds component with all folders and files that can be in the component: folder for the assets, ie, data + selected templater file, js and selected css-preprocessor.
-   `-b`, `--basic`: adds only basic files.
-   `-d`, `--data`: adds a folder for data. It also creates a data-file with the following contents:

```javascript
componentName: {
}
```

-   `-i`, `--ie`: adds a folder for the styles for IE.
-   `-a`, `--assets`: adds a folder for assets.
-   `-t`, `--template`: creates new component, which is based on component \_template. So, if you need your own template for all new components, you can use this flag. **Attention, it is very important, that \_template has to be existed in markup/components!** After using flag `-t` new component this name %componentName% will be created and it will be a full copy of \_template component. So, you have to rename all files and folders in new component by yourself in that case, cause TARS doesn't know anything about structure of \_template component.
-   `-s`, `--scheme`: adds a new component which structure is based on scheme file. By default it is default_component_scheme in components folder in your project. You can get more info about scheme from [docs](component-scheme.md).
-   `--custom-path`: this option allows to set custom path for new component. This option is usefull in case of creating inserted component.
-   `-e`, `--empty`: adds just component folder without files.

The keys have the following priority:

-   `-s`
-   `-t`
-   `-e`
-   `-f`
-   `other`

In other words, if you use the `-d -b` и `-e`, empty folder will be created for the component, because `-e` has higher priority. If you select "Full version of the component" mode and "Empty Folder" mode will be created only an empty folder.

### An example of using the command

```bash
# Will be start an adding component interactive mode named "sidebar"
tars add-component sidebar

# Adds component "sidebar" with basic file and assets folder
tars add-component sidebar -b -a

# Adds component "sidebar" with the basic files, folders, assets and folders for data
tars add-component sidebar -b -a -d

# Adds component "sidebar" with all files and folders
tars add-component sidebar --full

# Adds component "sidebar" which is based on _template
tars add-component sidebar --template

# Adds in components empty folder named "sidebar"
tars add-component sidebar -e -b -a -d -i

# Adds component "sidebar" which structure is based on
# default_component_scheme.json
tars add-component sidebar -s

# Adds component "sidebar" into example-component directory
# Structure of new component is based on custom_scheme.json
tars add-component sidebar -s custom_scheme --custom-path example
```

[Back to the command list.](#command-list)

## tars add-page %pageName%

This command adds a new page in the markup/pages. It takes the name of the page as a parameter . An error will be thrown in case the page already exists. It is possible to add an empty page and copy of the template page. If there is an extension in pageName, new page will be created from \_template page with the same extension. Otherwise, the default extension for current templater will be used: .jade for Jade and .html for Handlebars.

Interactive mode is not available.

### Available flags

-   `-e`, `--empty`: adds a empty page.

### An example of using the command

```bash
# Will be created an inner page.{Html, jade} based _template.{Html, jade}
tars add-page inner

# Will be created an inner.html page based on _template.html
tars add-page inner.html

# Will be created an empty inner.html page
tars add-page inner -e
```

[Back to the command list.](#command-list)

## tars update

Update the current version of TARS-CLI to the latest available. Starts npm update -g tars-cli command. In case of installation with sudo, you have to use sudo again in tars update. If you have the same version of TARS-cLI after update as before, you need to clean NPM-cache and restart update process:

```bash
npm cache clean
```

Interactive mode is not available.

### An example of using the command

```bash
tars update
```

## tars update-project

Update the current version of TARS in current project to the latest available. **Please, be sure, that you use the latest version of TARS-CLI before update!**

### Available flags

-   `-f`, `--force`: update won't be started if current version of TARS in your project is the latest. But you can override it by using that flag.
-   `-s`, `--source`: you can update your current project with any TARS archive like in [tars init](#tars-init).
-   `--exclude-html`: \_template.{html,hbs,jade} will be updated by default, but you can prevent with behaviour, by using that flag.
-   `--exclude-css`: sprite-templates will be updated by default, but you can prevent with behaviour, by using that flag.

`--exclude-html` and `--exclude-css` can be useful in case of updating from custom source.

The update steps are described [here](update-actions.md).

Interactive mode is not available.

### An example of using the command

```bash
# Starts update-project
tars update-project

# Starts update-project without preprocessor-files updating
tars update-project --exclude-css

# Downloads TARS from http://url.to.tars.zip and update current project
tars update-project -s http://url.to.tars.zip

# Downloads TARS from http://url.to.tars.zip and update current project without templater-files updating
tars update-project --exclude-html -s http://url.to.tars.zip
```

## tars add-module %moduleName%

Alias for [tars add-component](#tars-add-components-componentname)

[Back to the command list.](#command-list)
