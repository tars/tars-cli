#!/usr/bin/env node

'use strict';

var program = require('commander');
var getCliRoot = require('../lib/get-cli-root');
var tarsUtils = require('../lib/utils');
var args = process.argv.slice(2);

/**
 * Check TARS initialization in current directory
 * @return {Boolean} TARS init status
 */
function isTarsInited() {
    // If we are not in TARS directory or TARS has not been inited
    if (!tarsUtils.isTarsInited()) {
        tarsUtils.tarsNotInitedActions();
        return false;
    }

    return true;
}

program
    .usage('[command] [options] \n         Command without flags will be started in interactive mode.');

program
    .command('init')
    .description('Init TARS-project in current directory')
    .option('--silent', 'TARS will not ask any question about configuration')
    .option('-s, --source <source>', 'Change source of TARS')
    .action(function (options) {
        getCliRoot(require('../lib/command-actions/init'), options);
    });

program
    .command('re-init')
    .description('Re-init TARS-project')
    .option('--silent', 'TARS will not ask any question about configuration')
    .action(function (options) {

        if (isTarsInited()) {
            getCliRoot(require('../lib/command-actions/re-init'), options);
        }
    });

program
    .command('build')
    .description('Build project without watchers')
    .option('-r, --release', 'Create release build')
    .option('-m, --min', 'Create build with minified files')
    .option('--ie9', 'Generate files for ie9')
    .option('--ie8', 'Generate files for ie8')
    .option('--ie', 'Generate files for ie')
    .option('--silent', 'Start build in silent mode, without promt')
    .option('--custom-flags <customFlags>', 'Add custom flags')
    .action(function (options) {

        if (isTarsInited()) {
            getCliRoot(require('../lib/command-actions/build'), options);
        }
    });

program
    .command('dev')
    .description('Build project with watchers')
    .option('-t, --tunnel', 'Create tunnel to the Internet')
    .option('-l, --livereload', 'Start server')
    .option('--lr', 'Allias for livereload')
    .option('--ie9', 'Generate files for ie9')
    .option('--ie8', 'Generate files for ie8')
    .option('--ie', 'Generate files for ie')
    .option('--silent', 'Start dev in silent mode, without promt')
    .option('--custom-flags <customFlags>', 'Add custom flags')
    .action(function (options) {

        if (isTarsInited()) {
            getCliRoot(require('../lib/command-actions/dev'), options);
        }
    });

program
    .command('add-module <moduleName>')
    .description('Add module to markup/modules directory')
    .option('-b, --basic', 'Add module with .js, .scss (.less, .styl) and .html (.jade) files')
    .option('-a, --assets', 'Add module with general files + folder for assets')
    .option('-d, --data', 'Add module with general files + folder for data')
    .option('-i, --ie', 'Add module with general files + folder for IE')
    .option('-f, --full', 'Add module with all files and folders (assets folder, folder for IE and so on)')
    .option('-e, --empty', 'Add module without files')
    .option('--silent', 'Add module in silent mode, without promt')
    .action(function (moduleName, options) {

        if (isTarsInited()) {
            require('../lib/command-actions/add-module')(moduleName, options);
        }
    });

program
    .command('add-page <pageName>')
    .description('Add page to markup/pages directory')
    .option('-e, --empty', 'Add empty file')
    .action(function (pageName, options) {

        if (isTarsInited()) {
            require('../lib/command-actions/add-page')(pageName, options);
        }
    });

program
    .command('update')
    .description('Update TARS-cli')
    .action(function () {
        require('../lib/command-actions/update')();
    });

program
    .option('-v, --version', 'Version of TARS-cli');

if (program.version && args.length && (args[0] === '--version' || args[0] === '-v')) {
    getCliRoot(require('../lib/command-actions/get-version'));
}

if (!args.length) {
    program.outputHelp();
}

program.parse(process.argv);
