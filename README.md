<p align="right">
English description | <a href="README_RU.md">Описание на русском</a>
</p>

# TARS-CLI

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Mac/Linux Build Status](https://img.shields.io/travis/tars/tars-cli/master.svg?label=Mac%20OSX%20%26%20Linux&style=flat-square)](https://travis-ci.org/tars/tars-cli) [![Windows Build status](https://img.shields.io/appveyor/ci/artem-malko/tars-cli/master.svg?label=Windows&style=flat-square)](https://ci.appveyor.com/project/artem-malko/tars-cli/branch/master) [![Gitter][gitter-image]][gitter-link]

TARS-CLI — Command Line Interface for the TARS markup builder [TARS](https://github.com/tars/tars/blob/master/README.md).

The main problem in developing markup with TARS is all npm-dependences installing for each project every time. As the result, each project takes more than 200MB. To simplify initialization of the project and the work with TARS TARS-CLI was established. All TARS basic documentation is in the original TARS repository [TARS](https://github.com/tars/tars/blob/master/README.md).

TARS-CLI is just an interface of the main builder, which allows you to:

* Initialize the project.
* Start dev-command with browser reloading and opening tunnel to the Internet.
* Start the build-command with the minified files or in release mode.
* Add module with different set of files.
* Add empty page or copy an existing page.

**If you have any problems with TARS-CLI, please read [the troubleshooting docs](https://github.com/tars/tars-cli/blob/master/docs/en/troubleshooting.md).**

## How to install

You have to install TARS-CLI globally:

```bash
npm i -g tars-cli
```

If you get a **Permission denied** or **Error: EACCES** error, you should run the previous command again in sudo.

If you use Node.js version 5.x.x, please, be sure, that you use npm version 3.3.10 and higher. Otherwise update npm by using command:

```bash
npm i -g npm
```

For Windows you have to do some more steps:

* navigate to C:\Program Files (x86)\nodejs or C:\Program Files\nodejs via cmd.exe or any available terminal. The path depends on how Node.js was installed;
* run command `npm install npm@latest`.

If you get a **Permission denied** or **Error: EACCES** error, you should run the previous command again in sudo.

## TARS-CLI commands

All commands have similar template of executing: 

`tars` + `command-name` + `flags`

You can run the `tars --help` or `tars -h` or just `tars` without additional command and flags at any moment. This command displays information about all available commands and flags. Also you can add the `--help` key or `-h` key to any command to get full description of this command.

`tars -v` or `tars --version` will display version of TARS-CLI installed on your computer. Also, you will be informed about updating, if it is available.

Almost all command has the interactive mode. In this mode you can to communicate with CLI like it has its own GUI. If you are using interactive mode you don’t need to know what the flags are responsible for, because you are communicate with CLI with natural language. Interactive mode is easy to disable if you use automatic testing or something else that doesn’t require the human presence.

### Command list

* [tars init](https://github.com/tars/tars-cli/blob/master/docs/en/commands.md#tars-init) — TARS initialization.
* [tars re-init](https://github.com/tars/tars-cli/blob/master/docs/en/commands.md#tars-re-init) — TARS re-init. **Attention, files from pages and static folder will be deleted! Use this comman in case of initialization with wrong params only!**
* [tars dev](https://github.com/tars/tars-cli/blob/master/docs/en/commands.md#tars-dev) — run dev task in TARS.
* [tars build](https://github.com/tars/tars-cli/blob/master/docs/en/commands.md#tars-build) — run build task in TARS.
* [tars start](https://github.com/tars/tars-cli/blob/master/docs/en/commands.md#tars-start-taskname) — run custom task from local gulpfile.
* [tars add-module](https://github.com/tars/tars-cli/blob/master/docs/en/commands.md#tars-add-module-modulename) — add module to markup/modules.
* [tars add-page](https://github.com/tars/tars-cli/blob/master/docs/en/commands.md#tars-add-page-pagename) — add page to markup/pages.
* [tars update](https://github.com/tars/tars-cli/blob/master/docs/en/commands.md#tars-update) — update TARS-CLI.
* [tars update-project](https://github.com/tars/tars-cli/blob/master/docs/en/commands.md#tars-update-project) — update TARS in current project.

Feel free to write to [tars.builder@gmail.com](tars.builder@gmail.com) or [gitter](https://gitter.im/tars/tars-cli?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge) and ask me all question about TARS-CLI.

[downloads-image]: http://img.shields.io/npm/dm/tars-cli.svg?style=flat-square
[npm-url]: https://npmjs.org/package/tars-cli
[npm-image]: http://img.shields.io/npm/v/tars-cli.svg?style=flat-square

[travis-image]: https://travis-ci.org/tars/tars-cli.svg?branch=master
[travis-link]: https://travis-ci.org/tars/tars-cli

[deps-image]: https://david-dm.org/tars/tars-cli.svg?style=flat-square
[deps-link]: https://david-dm.org/tars/tars-cli

[gitter-image]: https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg?style=flat-square
[gitter-link]: https://gitter.im/tars/tars-cli?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge
