#!/usr/bin/env node

'use strict';

var program = require('commander');

// Commands actions
var addModule = require('../lib/commandActions/addModule');
var addPage = require('../lib/commandActions/addPage');
var dev = require('../lib/commandActions/dev');
var build = require('../lib/commandActions/build');
var reInit = require('../lib/commandActions/reInit');
var init = require('../lib/commandActions/init');
var update = require('../lib/commandActions/update');
var getVersion = require('../lib/commandActions/getVersion');
var getCliRoot = require('../lib/getCliRoot');
var args = process.argv.slice(2);

program
    .command('init')
    .description('Init TARS-project in current directory')
    .option('-s, --source <source>', 'Change source of TARS')
    .action(function (options) {
        getCliRoot(init, options);
    });

program
    .command('re-init')
    .description('Re-init TARS-project')
    .action(function () {
        getCliRoot(reInit);
    });

program
    .command('build')
    .description('Build project without watchers')
    .option('-r, --release', 'Create release build')
    .option('-m, --min', 'Create build with minified files')
    .option('--ie8', 'Generate files for ie8')
    .action(function (options) {
        getCliRoot(build, options);
    });

program
    .command('dev')
    .description('Build project with watchers')
    .option('-t, --tunnel', 'Create tunnel to the Internet')
    .option('-l, --livereload', 'Start server')
    .option('--lr', 'Allias flag for livereload')
    .option('--ie8', 'Generate files for ie8')
    .action(function (options) {
        getCliRoot(dev, options);
    });

program
    .command('add-module <moduleName>')
    .description('Add module to markup/modules directory')
    .option('-f, --full', 'Add module with all files and folders (assets folder, folder for IE and so on)')
    .option('-i, --ie', 'Add module with general files + folder for IE')
    .option('-a, --assets', 'Add module with general files + folder for assets')
    .option('-b, --basic', 'Add module with .js, .scss (.less, .styl) and .html (.jade) files')
    .action(function (moduleName, options) {
        addModule(moduleName, options);
    });

program
    .command('add-page <pageName>')
    .description('Add page to markup/pages directory')
    .option('-e, --empty', 'Add empty file')
    .action(function (pageName, options) {
        addPage(pageName, options);
    });

program
    .command('update')
    .description('Update tars-cli')
    .action(function () {
        update();
    });

program
    .option('-v, --version', 'Version of tars-cli')
    .description('Get version of tars-cli');

if (program.version && args.length && (args[0] === '--version' || args[0] === '-v')) {
    getCliRoot(getVersion);
}

if (!args.length) {
    program.outputHelp();
}

program.parse(process.argv);
