#!/usr/bin/env node

'use strict';

const program = require('commander');
const getCliRoot = require('../lib/get-cli-root');
const tarsUtils = require('../lib/utils');
const args = process.argv.slice(2);

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
    .action(options => {
        getCliRoot(require('../lib/command-actions/init'), options);
    });

program
    .command('re-init')
    .description('Re-init TARS-project, DEPRICATED!')
    .option('--exclude-html', 'Prevent templater-files uploading')
    .option('--exclude-css', 'Prevent preprocessor-files uploading')
    .option('--silent', 'TARS will not ask any question about configuration')
    .action(options => {

        if (isTarsReadyToWork()) {
            getCliRoot(require('../lib/command-actions/re-init'), options);
        }
    });

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
            getCliRoot(require('../lib/command-actions/build'), options);
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
    .option('-t, --template', 'Add module as a copy of _template module')
    .option('-e, --empty', 'Add module without files')
    .option('--silent', 'Add module in silent mode, without promt')
    .action((moduleName, options) => {

        if (isTarsReadyToWork()) {
            require('../lib/command-actions/add-module')(moduleName, options);
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
    .action(() => {
        require('../lib/command-actions/update')();
    });

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
            getCliRoot(require('../lib/command-actions/update-project'), options);
        }
    });

program
    .command('start <taskName>')
    .alias('run')
    .description('Start task from the local gulpfile')
    .option('--flags <flags>', 'Add flags "--flags" \'flags, with space separator\'')
    .action((taskName, options) => {

        if (isTarsReadyToWork()) {
            getCliRoot(require('../lib/command-actions/start-task'), taskName, options);
        }
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
