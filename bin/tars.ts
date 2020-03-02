#!/usr/bin/env node

'use strict';

const program = require('commander');
const fs = require('fs');
const path = require('path');
const tarsUtils = require('../lib/utils');
const args = process.argv.slice(2);
const cliRootPath = path.resolve(__dirname, '../');
let npmRootPath = path.join(cliRootPath, 'node_modules/');

try {
    fs.statSync(npmRootPath);
} catch (error) {
    npmRootPath = path.resolve(cliRootPath, '../') + path.sep;
}

// Get root npm directory for global packages and create env-var with it.
process.env.cliRoot = cliRootPath;
process.env.npmRoot = npmRootPath;

/**
 * Check TARS initialization and tars-config.js in current directory
 * @return {Boolean} TARS init status
 */
function isTarsReadyToWork() {
    const isTarsInited = tarsUtils.isTarsInited();

    // If we are not in TARS directory or TARS has not been inited
    if (!isTarsInited.inited) {
        if (!isTarsInited.error) {
            tarsUtils.tarsNotInitedActions();
        }
        return false;
    }

    return true;
}

program
    .usage('[command] [options] \n         Command without flags will be started in interactive mode.');

program
    .command('init')
    .description('Init TARS-project in current directory')
    .option('--exclude-html', 'Prevent templater-files uploading')
    .option('--exclude-css', 'Prevent preprocessor-files uploading')
    .option('--silent', 'TARS will not ask any question about configuration')
    .option('-s, --source <source>', 'Change source of TARS')
    .action(options => require('../lib/command-actions/init')(options));

program
    .command('build')
    .alias('bld')
    .description('Build project without watchers')
    .option('-r, --release', 'Create release build')
    .option('-m, --min', 'Create build with minified files')
    .option('--ie9', 'Generate files for ie9')
    .option('--ie8', 'Generate files for ie8')
    .option('--ie', 'Generate files for ie')
    .option('--silent', 'Start build in silent mode, without promt')
    .option('--custom-flags <customFlags>', 'Add custom flags')
    .action(options => {
        if (isTarsReadyToWork()) {
            require('../lib/command-actions/build')(options);
        }
    });

program
    .command('dev')
    .alias('development')
    .description('Build project with watchers')
    .option('-t, --tunnel', 'Create tunnel to the Internet')
    .option('-l, --livereload', 'Start server')
    .option('--lr', 'Allias for livereload')
    .option('--ie9', 'Generate files for ie9')
    .option('--ie8', 'Generate files for ie8')
    .option('--ie', 'Generate files for ie')
    .option('--silent', 'Start dev in silent mode, without promt')
    .option('--custom-flags <customFlags>', 'Add custom flags')
    .action(options => {
        if (isTarsReadyToWork()) {
            require('../lib/command-actions/dev')(options);
        }
    });

program
    .command('add-component <componentName>')
    .alias('add-module')
    .description('Add component to markup/components directory')
    .option('-b, --basic', 'Add component with .js, .scss (.less, .styl) and .html (.jade) files')
    .option('-a, --assets', 'Add component with general files + folder for assets')
    .option('-d, --data', 'Add component with general files + folder for data')
    .option('-i, --ie', 'Add component with general files + folder for IE')
    .option('-f, --full', 'Add component with all files and folders (assets folder, folder for IE and so on)')
    .option('-t, --template', 'Add component as a copy of _template component')
    .option(
        '-s, --scheme [schemeFile]',
        'Add component, which structure is based on scheme file'
    )
    .option('-e, --empty', 'Add component without files')
    .option('--custom-path <customPath>', 'Add component into custom folder')
    .option('--silent', 'Add component in silent mode, without promt')
    .action((componentName, options) => {
        if (isTarsReadyToWork()) {
            require('../lib/command-actions/add-component')(componentName, options);
        }
    });

program
    .command('add-page <pageName>')
    .description('Add page to markup/pages directory')
    .option('-e, --empty', 'Add empty file')
    .action((pageName, options) => {
        if (isTarsReadyToWork()) {
            require('../lib/command-actions/add-page')(pageName, options);
        }
    });

program
    .command('update')
    .alias('upgrade')
    .description('Update TARS-cli')
    .action(() => require('../lib/command-actions/update')());

program
    .command('update-project')
    .alias('upgrade-project')
    .description('Update TARS in current project')
    .option('-f, --force', 'Force update, even you have the latest version')
    .option('--exclude-html', 'Prevent templater-files updating')
    .option('--exclude-css', 'Prevent preprocessor-files updating')
    .option('-s, --source <source>', 'Change source of TARS for updating')
    .action(options => {
        if (isTarsReadyToWork()) {
            require('../lib/command-actions/update-project')(options);
        }
    });

program
    .command('start <taskName>')
    .alias('run')
    .description('Start task from the local gulpfile')
    .option('--flags <flags>', 'Add flags "--flags" \'flags, with space separator\'')
    .action((taskName, options) => {
        if (isTarsReadyToWork()) {
            require('../lib/command-actions/start-task')(taskName, options);
        }
    });

program
    .option('-v, --version', 'Version of TARS-cli');

if (program.version && args.length && (args[0] === '--version' || args[0] === '-v')) {
    require('../lib/command-actions/get-version')();
}

if (!args.length) {
    program.outputHelp();
}

program.parse(process.argv);
