'use strict';

const chalk = require('chalk');
const runCommand = require('./utils/run-command');
const generalOptionsProcessing = require('./utils/general-options-processing');
const devPromt = require('../promt/dev-promt');
const tarsUtils = require('../utils');
var buildOptions = ['dev'];
var commandOptions;

/**
 * Get options for dev task and start dev task in TARS
 * @param  {Object} answers Answers from promt
 */
function devInit(answers) {

    if (answers) {
        answers.mode.forEach(mode => {
            switch (mode) {
                case ' Start server for livereload':
                    buildOptions.push('--lr');
                    break;
                case ' Start server for tunnel and livereload':
                    buildOptions.push('--tunnel');
                    break;
                case ' IE9 maintenance':
                    buildOptions.push('--ie9');
                    break;
                case ' IE8 maintenance':
                    buildOptions.push('--ie8');
                    break;
                case ' IE8 and IE9 maintenance':
                    buildOptions.push('--ie');
                    break;
                case ' Custom flags':
                    buildOptions = buildOptions.concat(answers.customFlags);
                    break;
                default: {
                    break;
                }
            }
        });

        if (buildOptions.indexOf('--tunnel') > -1 && buildOptions.indexOf('--lr') > -1) {
            buildOptions.splice(buildOptions.indexOf('--lr'), 1);
        }
    } else {
        tarsUtils.tarsSay('Build options (active are green): ');

        if (commandOptions.tunnel) {
            buildOptions.push('--tunnel');
            tarsUtils.tarsSay(chalk.green('✓ Server for tunnel and livereload will be started.'));
        } else {
            tarsUtils.tarsSay(chalk.grey('Server for tunnel and livereload will be started "-t".'));
        }

        if ((commandOptions.lr || commandOptions.livereload) && !commandOptions.tunnel) {
            buildOptions.push('--lr');
            tarsUtils.tarsSay(chalk.green('✓ Server for livereload will be started.'));
        } else {
            tarsUtils.tarsSay(chalk.grey('Server for livereload will be started "-l".'));
        }

        buildOptions = generalOptionsProcessing(commandOptions, buildOptions);
        console.log('\n');
        tarsUtils.tarsSay('Execute ' + chalk.bold.cyan('"tars dev --help"') + ', to see all avaliable options.');
        tarsUtils.tarsSay('You can use interactive mode via starting tars without any flags.');
    }

    tarsUtils.tarsSay('Please wait for a moment, while I\'m preparing builder for working...\n');
    runCommand('gulp', buildOptions);
}

/**
 * Start dev task in gulp
 * @param  {Object} options Build options from commander
 */
module.exports = function dev(options) {
    commandOptions = options;

    console.log('\n');
    tarsUtils.spinner.start();
    tarsUtils.tarsSay(chalk.underline('Development task has been started!') + '\n');

    if (!commandOptions.silent && !commandOptions.tunnel && !commandOptions.livereload && !commandOptions.lr && !commandOptions.ie8 && !commandOptions.ie9 && !commandOptions.ie && !commandOptions.customFlags) {
        tarsUtils.tarsSay('Welcome to the interactive mode.');
        tarsUtils.tarsSay('Please, answer some questions:');
        devPromt(devInit);
    } else {
        devInit();
    }
};
