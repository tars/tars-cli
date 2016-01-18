'use strict';

const chalk = require('chalk');
const runCommand = require('./utils/run-command');
const generalOptionsProcessing = require('./utils/general-options-processing');
const buildPromt = require('../promt/build-promt');
const tarsUtils = require('../utils');
var buildOptions = [];
var commandOptions;

/**
 * Get options for build task and start build task in TARS
 * @param  {Object} answers Answers from promt
 */
function buildInit(answers) {

    if (answers) {
        answers.mode.forEach(mode => {
            switch (mode) {
                case ' Release mode':
                    buildOptions.push('--release');
                    break;
                case ' Minify files only':
                    buildOptions.push('--min');
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
                default:
                    break;
            }
        });

        if (buildOptions.indexOf('--release') > -1 && buildOptions.indexOf('--min') > -1) {
            buildOptions.splice(buildOptions.indexOf('--min'), 1);
        }
    } else {
        tarsUtils.tarsSay('Build options (active are green): ');

        if (commandOptions.release) {
            buildOptions.push('--release');
            tarsUtils.tarsSay(chalk.green('✓ Release mode.'));
        } else {
            tarsUtils.tarsSay(chalk.grey('Release mode "-r".'));
        }

        if (commandOptions.min && !commandOptions.release) {
            buildOptions.push('--min');
            tarsUtils.tarsSay(chalk.green('✓ Minify mode.'));
        } else {
            tarsUtils.tarsSay(chalk.grey('Minify mode "-m".'));
        }

        buildOptions = generalOptionsProcessing(commandOptions, buildOptions);
        console.log('\n');
        tarsUtils.tarsSay('Execute ' + chalk.bold.cyan('"tars build --help"') + ', to see all avaliable options.');
        tarsUtils.tarsSay('You can use interactive mode via starting tars without any flags.');
    }

    tarsUtils.tarsSay('Please wait for a moment, while I\'m preparing builder for working...\n');

    runCommand('gulp', buildOptions);
}

/**
 * Start build task in gulp
 * @param  {Object} options Build options from commander
 */
module.exports = function build(options) {
    commandOptions = options;

    console.log('\n');
    tarsUtils.spinner.start();
    tarsUtils.tarsSay(chalk.underline('Build task has been started!') + '\n');

    if (!commandOptions.silent && !commandOptions.release && !commandOptions.min && !commandOptions.ie8 && !commandOptions.ie9 && !commandOptions.ie && !commandOptions.customFlags) {
        tarsUtils.tarsSay('Welcome to the interactive mode.');
        tarsUtils.tarsSay('Please, answer some questions:');
        buildPromt(buildInit);
    } else {
        buildInit();
    }
};
